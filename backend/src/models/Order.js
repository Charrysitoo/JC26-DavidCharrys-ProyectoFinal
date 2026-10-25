const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 99 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    // Se entrega al cliente una sola vez; solo se conserva su hash para consultar el estado.
    trackingTokenHash: { type: String, select: false },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
      default: "pending",
    },
    orderType: { type: String, enum: ["delivery", "pickup"], required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "transfer", "card"],
      default: "cash",
    },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
    },
    delivery: {
      address: String,
      neighborhood: String,
      reference: String,
    },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, "El pedido debe tener al menos un producto."],
    },
    subtotal: { type: Number, required: true, min: 0 },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
