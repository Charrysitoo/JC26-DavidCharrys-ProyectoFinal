const express = require("express");
const store = require("../store");

const router = express.Router();

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
  if (!["delivery", "pickup"].includes(body.orderType)) {
    errors.push("El tipo de pedido debe ser delivery o pickup.");
  }
  if (body.orderType === "delivery") {
    if (!(body.deliveryAddress || "").trim()) errors.push("La dirección de entrega es obligatoria.");
    if (!(body.neighborhood || "").trim()) errors.push("El barrio o zona es obligatorio.");
  }

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

// POST /api/orders — crear pedido
router.post("/", async (req, res, next) => {
  try {
    const body = req.body || {};
    const { errors, items, subtotal } = validateOrder(body);
    if (errors.length) return res.status(400).json({ ok: false, errors });

    const order = await store.createOrder({
      orderType: body.orderType,
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

    res.status(201).json({ ok: true, order });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders — listado (protegido más adelante con el panel privado)
router.get("/", async (req, res, next) => {
  try {
    const orders = await store.listOrders();
    res.json({ ok: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
