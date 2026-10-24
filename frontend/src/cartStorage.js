// El carrito se guarda solo en el navegador para poder pasar del menú a pedidos.
// No se envía a ningún servidor hasta conectar el backend.
const CART_STORAGE_KEY = "restaurante-carrito-v1";

export function readCart() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item.id === "string")
      .map((item) => ({
        id: item.id,
        quantity: Math.max(1, Math.min(99, Number.parseInt(item.quantity, 10) || 1)),
      }));
  } catch {
    return [];
  }
}

export function writeCart(cart) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("No se pudo guardar el carrito en este navegador.", error);
  }
}
