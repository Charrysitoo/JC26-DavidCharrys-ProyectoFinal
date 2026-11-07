// Conserva la selección entre Menú y Pedidos; solo persiste IDs y cantidades.
// El servidor vuelve a resolver precios y nombres al recibir el pedido.
const CART_STORAGE_KEY = "restaurante-carrito-v2";

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
