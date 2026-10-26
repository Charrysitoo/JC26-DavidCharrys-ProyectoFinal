const express = require("express");
const crypto = require("crypto");
const store = require("../store");
const { productsById } = require("../catalog");
const { createRateLimiter } = require("../middleware/rateLimit");

const router = express.Router();
const limitOrderCreation = createRateLimiter({
  windowMs: 15 * 60_000,
  max: 10,
  message: "Se alcanzó el límite de pedidos. Inténtalo más tarde.",
});
const limitTrackingAttempts = createRateLimiter({
  windowMs: 15 * 60_000,
  max: 20,
  message: "Se alcanzó el límite de consultas. Inténtalo más tarde.",
});

// El servidor valida la solicitud y obtiene precios y nombres del catálogo autoritativo.
function validateOrder(body) {
  const errors = [];
  const name = typeof body.customerName === "string" ? body.customerName.trim() : "";
  const phone = typeof body.customerPhone === "string" ? body.customerPhone.trim() : "";
  const email = typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
  const address = typeof body.deliveryAddress === "string" ? body.deliveryAddress.trim() : "";
  const neighborhood = typeof body.neighborhood === "string" ? body.neighborhood.trim() : "";
  const reference = typeof body.deliveryReference === "string" ? body.deliveryReference.trim() : "";
  const notes = typeof body.orderNotes === "string" ? body.orderNotes.trim().slice(0, 500) : "";

  if (name.length < 2) errors.push("El nombre es obligatorio (mínimo 2 caracteres).");
  if (!/^[\d+() -]{7,20}$/.test(phone)) errors.push("El teléfono no tiene un formato válido.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("El correo electrónico no es válido.");
  }
  if (body.orderType !== "delivery") errors.push("Makarios solo recibe pedidos a domicilio.");
  if (!address) errors.push("La dirección de entrega es obligatoria.");
  if (!neighborhood) errors.push("El barrio o zona es obligatorio.");

  const submittedItems = Array.isArray(body.items) ? body.items : [];
  const items = [];
  const seenProductIds = new Set();
  if (submittedItems.length === 0) errors.push("El pedido debe contener al menos un producto.");
  for (const item of submittedItems) {
    const product = item && typeof item === "object"
      ? productsById.get(String(item.productId || ""))
      : null;
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 || seenProductIds.has(product.id)) {
      errors.push("Uno de los productos del pedido no es válido.");
      break;
    }
    seenProductIds.add(product.id);
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  if (!Number.isFinite(Number(body.subtotal)) || Math.abs(subtotal - Number(body.subtotal)) > 1) {
    errors.push("El subtotal no coincide con el menú actual. Actualiza la página y vuelve a intentarlo.");
  }
  return { errors, items, subtotal, name, phone, email, address, neighborhood, reference, notes };
}

function isWithinBusinessHoursInBogota(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const minutes = Number(values.hour) * 60 + Number(values.minute);
  return values.weekday !== "Sun" && minutes >= 12 * 60 && minutes < 19 * 60;
}

// POST /api/orders — crear pedido
router.post("/", limitOrderCreation, async (req, res, next) => {
  try {
    if (!isWithinBusinessHoursInBogota()) {
      return res.status(403).json({
        ok: false,
        errors: ["En este momento no recibimos pedidos. Nuestro horario es de lunes a sábado, de 12:00 p. m. a 7:00 p. m. (hora de Colombia)."],
      });
    }
    const body = req.body || {};
    const { errors, items, subtotal, name, phone, email, address, neighborhood, reference, notes } = validateOrder(body);
    if (errors.length) return res.status(400).json({ ok: false, errors });

    const trackingToken = crypto.randomBytes(32).toString("base64url");
    const trackingTokenHash = crypto.createHash("sha256").update(trackingToken).digest("hex");

    const order = await store.createOrder({
      trackingTokenHash,
      orderType: "delivery",
      paymentMethod: ["cash", "transfer", "card"].includes(body.paymentMethod)
        ? body.paymentMethod
        : "cash",
      customer: {
        name,
        phone,
        email: email || undefined,
      },
      delivery: { address, neighborhood, reference: reference || undefined },
      items,
      subtotal,
      notes: notes || undefined,
    });

    res.status(201).json({
      ok: true,
      order: {
        code: order.code,
        status: order.status,
        customer: { phone: order.customer.phone },
      },
      trackingToken,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/track — el token aleatorio funciona como credencial privada.
router.post("/track", limitTrackingAttempts, async (req, res, next) => {
  try {
    const code = String(req.body?.code || "").trim().toUpperCase();
    const token = String(req.body?.trackingToken || "").trim();
    if (!/^MK-[A-Z0-9-]{8,40}$/.test(code) || !/^[A-Za-z0-9_-]{40,50}$/.test(token)) {
      return res.status(404).json({ ok: false, errors: ["No encontramos un pedido con esos datos."] });
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const order = await store.findTrackableOrder(code, tokenHash);
    if (!order) {
      return res.status(404).json({ ok: false, errors: ["No encontramos un pedido con esos datos."] });
    }
    res.json({ ok: true, order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
