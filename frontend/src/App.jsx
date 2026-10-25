import Home from "./Home";
import Menu from "./Menu";
import Order from "./Order";
import Contact from "./Contact";

// Rutas sencillas para la demo. En producción, configura el hosting para
// redirigir las rutas desconocidas a index.html (SPA fallback).
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/menu") return <Menu />;
  if (path === "/pedidos") return <Order />;
  if (path === "/contacto") return <Contact />;
  return <Home />;
}
