const express = require("express");
const store = require("../store");

const router = express.Router();

function validateMessage(body) {
  const errors = [];
  const str = (v) => String(v || "").trim();

  if (str(body.firstName).length < 2) errors.push("Los nombres son obligatorios (mínimo 2 caracteres).");
  if (str(body.lastName).length < 2) errors.push("Los apellidos son obligatorios (mínimo 2 caracteres).");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(body.email))) errors.push("El correo electrónico no es válido.");
  if (!/^[\d+() -]{7,20}$/.test(str(body.phone))) errors.push("El teléfono no tiene un formato válido.");
  const msg = str(body.message);
  if (msg.length < 10) errors.push("El mensaje debe tener al menos 10 caracteres.");
  if (msg.length > 1500) errors.push("El mensaje no puede superar los 1500 caracteres.");
  return errors;
}

// POST /api/messages — guardar mensaje de contacto
router.post("/", async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = validateMessage(body);
    if (errors.length) return res.status(400).json({ ok: false, errors });

    const message = await store.createMessage({
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone).trim(),
      message: String(body.message).trim(),
    });

    res.status(201).json({ ok: true, messageId: message._id });
  } catch (err) {
    next(err);
  }
});

// GET /api/messages — listado (para el futuro panel privado)
router.get("/", async (req, res, next) => {
  try {
    const messages = await store.listMessages();
    res.json({ ok: true, count: messages.length, messages });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
