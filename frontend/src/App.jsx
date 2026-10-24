import React from "react";
import Home from "./Home";
import Menu from "./Menu";
import Order from "./Order";

// Rutas sencillas para la demo. En producción, configura el hosting para
// redirigir las rutas desconocidas a index.html (SPA fallback).
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/menu") return <Menu />;
  if (path === "/pedidos") return <Order />;
  return <Home />;
}
