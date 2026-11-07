import logo from "../assets/MAKARIOS-LOGO.svg";
import { Link } from "react-router-dom";

/**
 * Encabezado reutilizable para las páginas principales del sitio.
 * La página activa y el botón de la derecha se configuran mediante props.
 */
export default function SiteHeader({
  activePage = "home",
  actionLabel = "Hacer pedido",
  actionHref = "/pedidos",
  actionAriaLabel,
}) {
  const homeHref = activePage === "home" ? "#inicio" : "/#inicio";

  return (
    <header className="site-header">
      <Link
        className="brand"
        to={activePage === "home" ? "#inicio" : "/"}
        aria-label="Ir al inicio"
      >
        <img className="brand-logo" src={logo} alt="Logo de Makarios Company" />
      </Link>

      <nav className="main-nav" aria-label="Navegación principal">
        <Link to={homeHref} aria-current={activePage === "home" ? "page" : undefined}>
          Inicio
        </Link>
        <Link to="/menu" aria-current={activePage === "menu" ? "page" : undefined}>
          Menú
        </Link>
        <Link to="/contacto" aria-current={activePage === "contact" ? "page" : undefined}>Contacto</Link>
      </nav>

      <Link
        className="header-cta"
        to={actionHref}
        aria-label={actionAriaLabel || actionLabel}
      >
        {actionLabel} <span aria-hidden="true">↗</span>
      </Link>
    </header>
  );
}
