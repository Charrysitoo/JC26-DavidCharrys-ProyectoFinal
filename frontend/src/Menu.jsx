import React, { useMemo, useState, useEffect } from "react";
import "./Menu.css";
import { products, categories, formatPrice } from "./products";
import { readCart, writeCart } from "./cartStorage";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

/* Catálogo compartido en products.js para mantener menú y pedidos sincronizados. */
export default function Menu() {
  useEffect(() => {
      document.title = 'Menú - Makarios Company';
    }, []);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [cart, setCart] = useState(() => readCart());
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  function handleAddToOrder(productId) {
    const currentCart = readCart();
    const existingItem = currentCart.find((item) => item.id === productId);
    const updatedCart = existingItem
      ? currentCart.map((item) =>
          item.id === productId ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item
        )
      : [...currentCart, { id: productId, quantity: 1 }];

    writeCart(updatedCart);
    setCart(updatedCart);
    setRecentlyAddedId(productId);
  }

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
      <SiteHeader
        activePage="menu"
        actionLabel={`Mi pedido (${cartCount})`}
        actionHref="/pedidos"
        actionAriaLabel={`Ver mi pedido, ${cartCount} productos`}
      />

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
                    <button
                      className="menu-add-button"
                      type="button"
                      onClick={() => handleAddToOrder(product.id)}
                      aria-label={`Agregar ${product.name} al pedido`}
                    >
                      {recentlyAddedId === product.id ? "Añadido ✓" : "Agregar al pedido +"}
                    </button>
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
          <p className="eyebrow">¿Listo para disfrutar?</p>
          <h2>Tu próximo antojo <em>empieza aquí.</em></h2>
        </div>
        <div className="menu-banner-actions">
          <a className="button button-light" href="/pedidos">
            Realizar pedido <span aria-hidden="true">↗</span>
          </a>
          <a className="menu-banner-contact" href="/#contacto">Contactar al restaurante</a>
        </div>
      </section>

      <SiteFooter
        backLabel="Volver arriba"
        backHref="#top"
        backToTop
      />
    </main>
  );
}
