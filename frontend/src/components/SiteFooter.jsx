import logo from "../assets/MAKARIOS-LOGO.svg";
import { Link } from "react-router-dom";

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
      <Link className="footer-brand" to={brandHref} aria-label="Makarios Company: ir al inicio">
        <img src={logo} alt="Makarios Company" />
        <span>Isaías 41:10-13</span>
      </Link>
      <p>© {new Date().getFullYear()} Makarios Company. By: David Santiago Charrys Pacheco.</p>
      <Link
        to={backHref}
        className="back-to-top"
        onClick={handleBackClick}
      >
        {backLabel} {backToTop ? "↑" : "↗"}
      </Link>
    </footer>
  );
}
