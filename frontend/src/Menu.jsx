import { useMemo, useState } from "react";
import "./Home.css";
import "./Menu.css";
import logo from "./assets/MAKARIOS-LOGO.svg";

// Datos de demostración. Más adelante se cargarán desde la API del restaurante.
const products = [
  {
    id: "burger-criollo",
    name: "Burger criollo",
    description:
      "Carne jugosa, queso, vegetales frescos y salsa de la casa.",
    price: 24000,
    category: "Hamburguesas",
    image: "/images/burger-criollo.png",
    tag: "Favorito",
  },
  {
    id: "arepa-gourmet",
    name: "Arepa gourmet",
    description:
      "Arepa dorada con relleno generoso e ingredientes locales.",
    price: 18000,
    category: "Arepas",
    image: "/images/arepa-gourmet.png",
    tag: "Tradición",
  },
  {
    id: "patacon-especial",
    name: "Patacón especial",
    description:
      "Patacón crujiente con una combinación fresca y sabrosa.",
    price: 22000,
    category: "Patacones",
    image: "/images/patacon-especial.png",
    tag: "De la casa",
  },
];

const categories = ["Todos", "Hamburguesas", "Arepas", "Patacones"];

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const visibleProducts = useMemo(() => {
    const search = searchTerm.trim().toLocaleLowerCase("es-CO");

    const filtered = products.filter((product) => {
      const matchesCategory =
        activeCategory === "Todos" || product.category === activeCategory;
      const searchableText =
        `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase("es-CO");
      return matchesCategory && searchableText.includes(search);
    });

    if (sortBy === "price-asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [activeCategory, searchTerm, sortBy]);

  return (
    <main className="menu-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Ir al inicio">
          <img
            className="brand-logo"
            src={logo}
            alt="Logo del restaurante"
          />
        </a>

        <nav className="main-nav" aria-label="Navegación principal">
          <a href="/">Inicio</a>
          <a href="/menu" aria-current="page">Menú</a>
          <a href="/#nosotros">Nuestra esencia</a>
          <a href="/#contacto">Contacto</a>
        </nav>

        <a className="header-cta" href="/#contacto">
          Contáctanos <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="menu-hero">
        <p className="eyebrow"><span className="eyebrow-dot" /> Hecho con sabor colombiano</p>
        <h1>El menú, <em>a tu manera.</em></h1>
        <p className="menu-hero-description">
          Explora nuestros sabores, encuentra tu próximo antojo y descubre una
          forma diferente de disfrutar los ingredientes de nuestra tierra.
        </p>
        <div className="menu-hero-note" aria-hidden="true">
          <span>BUEN SABOR</span><span className="menu-note-divider" /><span>BUEN ORIGEN</span>
        </div>
      </section>

      <section className="menu-catalog" aria-labelledby="catalog-title">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">Encuentra tu favorito</p>
            <h2 id="catalog-title">Antójate de <em>algo bueno.</em></h2>
          </div>
          <p className="catalog-description">
            Recetas con identidad, preparadas para disfrutar cada bocado.
          </p>
        </div>

        <div className="catalog-toolbar">
          <div className="category-filters" role="group" aria-label="Filtrar por categoría">
            {categories.map((category) => (
              <button
                className={`category-button ${activeCategory === category ? "is-active" : ""}`}
                key={category}
                type="button"
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="catalog-controls">
            <label className="menu-search">
              <span className="visually-hidden">Buscar en el menú</span>
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar un plato..."
              />
            </label>
            <label className="sort-control">
              <span className="visually-hidden">Ordenar productos</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="featured">Recomendados</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
              </select>
            </label>
          </div>
        </div>

        <div className="catalog-result-line" aria-live="polite">
          <span>{visibleProducts.length} {visibleProducts.length === 1 ? "opción" : "opciones"}</span>
          <span>Precios en pesos colombianos (COP)</span>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="menu-product-grid">
            {visibleProducts.map((product, index) => (
              <article className="menu-product-card" key={product.id}>
                <div className="menu-product-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span className="menu-product-tag">{product.tag}</span>
                  <span className="menu-product-number">0{index + 1}</span>
                </div>
                <div className="menu-product-info">
                  <p className="menu-product-category">{product.category}</p>
                  <div className="menu-product-title-row">
                    <h3>{product.name}</h3>
                    <span className="menu-product-price">{formatPrice(product.price)}</span>
                  </div>
                  <p className="menu-product-description">{product.description}</p>
                  <div className="menu-product-footer">
                    <span className="product-made-here"><span aria-hidden="true">✳</span> Sabor de aquí</span>
                    <a href="/#contacto" aria-label={`Consultar por ${product.name}`}>
                      Consultar <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="menu-empty-state">
            <span aria-hidden="true">⌕</span>
            <h3>No encontramos ese antojo.</h3>
            <p>Prueba con otro nombre o selecciona una categoría diferente.</p>
            <button
              className="button button-primary"
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("Todos");
              }}
            >
              Ver todo el menú
            </button>
          </div>
        )}

        <p className="menu-data-note">
          Catálogo inicial de muestra: los platos, precios, descripciones e imágenes
          se podrán editar desde el panel de administración cuando conectemos el backend.
        </p>
      </section>

      <section className="menu-contact-banner">
        <div>
          <p className="eyebrow">¿Tienes una pregunta?</p>
          <h2>Hablemos de <em>comida.</em></h2>
        </div>
        <a className="button button-light" href="/#contacto">
          Contactar al restaurante <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="/">
          <img src="/images/logo.svg" alt="" />
          <span>Buen sabor. Buen origen.</span>
        </a>
        <p>© {new Date().getFullYear()} Tu Restaurante. Hecho con sabor colombiano.</p>
        <a href="#top" className="back-to-top" onClick={(event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}>Volver arriba ↑</a>
      </footer>
    </main>
  );
}
