import "./Home.css";
import mainImage from "./assets/Main-Image.jpg";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { products, formatPrice } from "./products";

export default function Home() {
  return (
    <main className="home-page">
      <SiteHeader
        activePage="home"
        actionLabel="Hacer pedido"
        actionHref="/pedidos"
        actionAriaLabel="Ir a realizar un pedido"
      />

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            Sabor colombiano, hecho con intención
          </p>

          <h1>
            Lo nuestro,
            <br />
            <em>con un toque</em>
            <br />
            extraordinario.
          </h1>

          <p className="hero-description">
            Sabores que nos representan, ingredientes frescos y una mirada
            gourmet para disfrutar lo mejor de la comida colombiana, sin
            complicaciones.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="/menu">
              Explorar el menú <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href="#nosotros">
              Conoce nuestra historia
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Presentación gastronómica">
          <div className="hero-image-frame">
            <img
              src={mainImage}
              alt="Plato especial del restaurante"
              className="hero-food-image"
            />
          </div>
          <div className="hero-stamp" aria-hidden="true">
            <span>HECHO</span>
            <strong>con sabor</strong>
            <span>COLOMBIANO</span>
          </div>
          <div className="hero-caption">
            <span className="caption-line" />
            <span>Una experiencia para saborear</span>
          </div>
        </div>
      </section>

      <section className="value-strip" aria-label="Lo que nos caracteriza">
        <div className="value-item">
          <span className="value-number">01</span>
          <div>
            <h2>Ingredientes frescos</h2>
            <p>Elegidos con cuidado cada día.</p>
          </div>
        </div>
        <div className="value-item">
          <span className="value-number">02</span>
          <div>
            <h2>Raíces colombianas</h2>
            <p>Recetas inspiradas en nuestra tierra.</p>
          </div>
        </div>
        <div className="value-item">
          <span className="value-number">03</span>
          <div>
            <h2>Rápido, nunca común</h2>
            <p>Calidad y sabor en cada bocado.</p>
          </div>
        </div>
      </section>

      <section className="menu-section section-wrap" id="menu">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Una selección especial</p>
            <h2>Antójate de <em>algo bueno.</em></h2>
          </div>
          <p className="section-intro">
            Tus clásicos favoritos, reinterpretados con creatividad y el sello
            de nuestra cocina.
          </p>
        </div>

        <div className="dish-grid">
          {products.slice(0, 3).map((dish) => (
            <article className="dish-card" key={dish.id}>
              <div className="dish-image-wrap">
                <img src={dish.image} alt={dish.name} loading="lazy" />
                <span className="dish-tag">{dish.tag}</span>
              </div>
              <div className="dish-details">
                <div className="dish-title-row">
                  <h3>{dish.name}</h3>
                  <span className="dish-price">{formatPrice(dish.price)}</span>
                </div>
                <p>{dish.description}</p>
                <a href="/menu" className="dish-link">
                  Ver en el menú <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="menu-bottom">
          <p>¿Ya sabes qué se te antoja?</p>
          <a className="button button-outline" href="/menu">
            Consulta el menú completo <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="story-section" id="nosotros">
        <div className="story-decoration" aria-hidden="true">SABOR<br />DE AQUÍ</div>
        <div className="story-content">
          <p className="eyebrow">Nuestra esencia</p>
          <h2>Colombia en la raíz.<br /><em>Creatividad en el plato.</em></h2>
          <p>
            Creemos que la comida rápida también puede tener origen, cuidado y
            personalidad. Por eso celebramos los ingredientes de nuestra tierra
            y los transformamos en platos generosos, actuales y llenos de sabor.
          </p>
          <a className="text-link story-link" href="#contacto">
            Ven a conocernos <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="story-image">
          <img
            src="/images/cocina-colombiana.png"
            alt="Ingredientes frescos utilizados en la cocina"
            loading="lazy"
          />
        </div>
      </section>

      <section className="order-cta" id="contacto">
        <div>
          <p className="eyebrow">Tu próximo antojo comienza aquí</p>
          <h2>Algo delicioso<br /><em>te está esperando.</em></h2>
        </div>
        <div className="order-cta-action">
          <p>
            Escríbenos para consultar el menú, conocer nuestros horarios o
            preguntar por las opciones para pedir.
          </p>
          {/* Reemplaza el enlace por el WhatsApp, teléfono o sistema de pedidos real. */}
          <a className="button button-light" href="mailto:hola@turestaurante.com">
            Hablemos de comida <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <SiteFooter brandHref="#inicio" backLabel="Volver arriba" backHref="#inicio" backToTop />
    </main>
  );
}
