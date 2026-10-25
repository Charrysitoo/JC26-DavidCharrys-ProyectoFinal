// Cliente HTTP mínimo para hablar con el backend de Makarios.
// En desarrollo, Vite hace proxy de /api hacia http://localhost:4000.
const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("No hay conexión con el servidor. Inténtalo de nuevo en unos minutos.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* respuesta sin cuerpo JSON */
  }

  if (!response.ok) {
    const message =
      data && Array.isArray(data.errors) && data.errors.length
        ? data.errors.join(" ")
        : "Ocurrió un problema al enviar la información. Inténtalo de nuevo.";
    const error = new Error(message);
    error.status = response.status;
    error.details = data?.errors || [];
    throw error;
  }
  return data;
}

export function submitOrder(payload) {
  return request("/orders", { method: "POST", body: JSON.stringify(payload) });
}

export function submitContactMessage(payload) {
  return request("/messages", { method: "POST", body: JSON.stringify(payload) });
}
