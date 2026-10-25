import logo from "../assets/MAKARIOS-LOGO.svg";

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
      <a
        className="brand"
        href={activePage === "home" ? "#inicio" : "/"}
        aria-label="Ir al inicio"
      >
        <img className="brand-logo" src={logo} alt="Logo de Makarios Company" />
      </a>

      <nav className="main-nav" aria-label="Navegación principal">
        <a href={homeHref} aria-current={activePage === "home" ? "page" : undefined}>
          Inicio
        </a>
        <a href="/menu" aria-current={activePage === "menu" ? "page" : undefined}>
          Menú
        </a>
        <a href="/contacto" aria-current={activePage === "contact" ? "page" : undefined}>Contacto</a>
      </nav>

      <a
        className="header-cta"
        href={actionHref}
        aria-label={actionAriaLabel || actionLabel}
      >
        {actionLabel} <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
