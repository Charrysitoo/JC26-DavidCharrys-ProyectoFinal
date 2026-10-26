// Almacén unificado: usa MongoDB si está conectado, si no memoria (modo demo).
const crypto = require("crypto");
const { isMongoConnected } = require("./db");
const Order = require("./models/Order");
const ContactMessage = require("./models/ContactMessage");

const memory = { orders: [], messages: [] };

function makeOrderCode() {
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `MK-${Date.now().toString(36).toUpperCase()}-${suffix}`;
}

// ---------- Pedidos ----------
async function createOrder(payload) {
  if (isMongoConnected()) {
    const doc = await Order.create({ ...payload, code: makeOrderCode() });
    return doc.toObject();
  }
  const order = {
    _id: `mem-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
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

async function findTrackableOrder(code, trackingTokenHash) {
  if (isMongoConnected()) {
    return Order.findOne({ code, trackingTokenHash })
      .select("code status updatedAt createdAt")
      .lean();
  }
  const order = memory.orders.find(
    (entry) => entry.code === code && entry.trackingTokenHash === trackingTokenHash
  );
  if (!order) return null;
  return {
    code: order.code,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt || order.createdAt,
  };
}

// ---------- Mensajes de contacto ----------
async function createMessage(payload) {
  if (isMongoConnected()) {
    const doc = await ContactMessage.create(payload);
    return doc.toObject();
  }
  const msg = {
    _id: `mem-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
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

module.exports = { createOrder, listOrders, findTrackableOrder, createMessage, listMessages };
