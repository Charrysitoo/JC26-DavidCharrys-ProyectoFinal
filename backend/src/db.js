// Conexión a MongoDB Atlas (o cualquier Mongo local) vía Mongoose.
// Si no hay MONGODB_URI definida, la app sigue corriendo en "modo demo"
// usando memoria, para poder desarrollar el frontend sin base de datos.
const mongoose = require("mongoose");

let connected = false;

async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI es obligatoria en producción; se cancela el inicio para no perder registros en memoria.");
    }
    console.warn(
      "[db] MONGODB_URI no está definida: la API funcionará en modo demo (datos en memoria)."
    );
    return false;
  }
  await mongoose.connect(uri);
  connected = true;
  console.log("[db] Conectado a MongoDB.");
  return true;
}

function isMongoConnected() {
  return connected;
}

module.exports = { connectDb, isMongoConnected };
