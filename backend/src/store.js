// Almacén unificado: usa MongoDB si está conectado, si no memoria (modo demo).
const { isMongoConnected } = require("./db");
const Order = require("./models/Order");
const ContactMessage = require("./models/ContactMessage");

const memory = { orders: [], messages: [] };

function makeOrderCode() {
  const n = String(memory.orders.length + 1).padStart(4, "0");
  return `MK-${Date.now().toString(36).toUpperCase()}-${n}`;
}

// ---------- Pedidos ----------
async function createOrder(payload) {
  if (isMongoConnected()) {
    const doc = await Order.create({ ...payload, code: makeOrderCode() });
    return doc.toObject();
  }
  const order = {
    _id: `mem-${Date.now()}`,
    code: makeOrderCode(),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...payload,
  };
  memory.orders.push(order);
  return order;
}

async function listOrders() {
  if (isMongoConnected()) return Order.find().sort("-createdAt").limit(100).lean();
  return [...memory.orders].reverse();
}

// ---------- Mensajes de contacto ----------
async function createMessage(payload) {
  if (isMongoConnected()) {
    const doc = await ContactMessage.create(payload);
    return doc.toObject();
  }
  const msg = {
    _id: `mem-${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
    ...payload,
  };
  memory.messages.push(msg);
  return msg;
}

async function listMessages() {
  if (isMongoConnected()) return ContactMessage.find().sort("-createdAt").limit(100).lean();
  return [...memory.messages].reverse();
}

module.exports = { createOrder, listOrders, createMessage, listMessages };
