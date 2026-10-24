import React from "react";
import logo from "../assets/MAKARIOS-LOGO.svg";

/** Pie de página común. Puede volver arriba o llevar a otra página. */
export default function SiteFooter({
  brandHref = "/",
  backLabel = "Volver arriba",
  backHref = "#inicio",
  backToTop = true,
}) {
  function handleBackClick(event) {
    if (!backToTop) return;

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="site-footer">
      <a className="footer-brand" href={brandHref} aria-label="Makarios Company: ir al inicio">
        <img src={logo} alt="Makarios Company" />
        <span>Buen sabor. Buen origen.</span>
      </a>
      <p>© {new Date().getFullYear()} Makarios Company. Hecho con sabor colombiano.</p>
      <a
        href={backHref}
        className="back-to-top"
        onClick={handleBackClick}
      >
        {backLabel} {backToTop ? "↑" : "↗"}
      </a>
    </footer>
  );
}
