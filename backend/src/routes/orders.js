const express = require("express");
const crypto = require("crypto");
const store = require("../store");

const router = express.Router();
const trackingAttempts = new Map();

function limitTrackingAttempts(req, res, next) {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const current = trackingAttempts.get(key);
  if (!current || current.resetAt <= now) {
    trackingAttempts.set(key, { count: 1, resetAt: now + 15 * 60_000 });
    return next();
  }
  if (current.count >= 20) {
    return res.status(429).json({ ok: false, errors: ["Se alcanzó el límite de consultas. Inténtalo más tarde."] });
  }
  current.count += 1;
  return next();
}

// Validación ligera en el servidor (espejo de lo que ya valida el formulario).
function validateOrder(body) {
  const errors = [];
  const name = (body.customerName || "").trim();
  const phone = (body.customerPhone || "").trim();

  if (name.length < 2) errors.push("El nombre es obligatorio (mínimo 2 caracteres).");
  if (!/^[\d+() -]{7,20}$/.test(phone)) errors.push("El teléfono no tiene un formato válido.");
  if (body.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail)) {
    errors.push("El correo electrónico no es válido.");
  }
  if (body.orderType !== "delivery") errors.push("Makarios solo recibe pedidos a domicilio.");
  if (!(body.deliveryAddress || "").trim()) errors.push("La dirección de entrega es obligatoria.");
  if (!(body.neighborhood || "").trim()) errors.push("El barrio o zona es obligatorio.");

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) errors.push("El pedido debe contener al menos un producto.");
  for (const item of items) {
    if (!item.productId || !item.name || typeof item.price !== "number" ||
        !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      errors.push("Uno de los productos del pedido no es válido.");
      break;
    }
  }

  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  if (Math.abs(subtotal - Number(body.subtotal)) > 1) {
    errors.push("El subtotal no coincide con los productos enviados.");
  }
  return { errors, items, subtotal };
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
router.post("/", async (req, res, next) => {
  try {
    if (!isWithinBusinessHoursInBogota()) {
      return res.status(403).json({
        ok: false,
        errors: ["En este momento no recibimos pedidos. Nuestro horario es de lunes a sábado, de 12:00 p. m. a 7:00 p. m. (hora de Colombia)."],
      });
    }
    const body = req.body || {};
    const { errors, items, subtotal } = validateOrder(body);
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
        name: body.customerName.trim(),
        phone: body.customerPhone.trim(),
        email: (body.customerEmail || "").trim() || undefined,
      },
      delivery:
        body.orderType === "delivery"
          ? {
              address: body.deliveryAddress.trim(),
              neighborhood: body.neighborhood.trim(),
              reference: (body.deliveryReference || "").trim() || undefined,
            }
          : undefined,
      items,
      subtotal,
      notes: (body.orderNotes || "").trim().slice(0, 500) || undefined,
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
