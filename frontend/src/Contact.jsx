import { useEffect, useState } from "react";
import "./Contact.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { submitContactMessage } from "./apiClient";

export default function Contact() {
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Contacto - Makarios Company";
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setIsSubmitting(true);
    setStatus("");
    try {
      await submitContactMessage({
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        phone: data.get("phone"),
        message: data.get("message"),
      });
      setIsError(false);
      setStatus(
        "Mensaje recibido. Gracias por escribirnos: te responderemos muy pronto al correo indicado."
      );
      form.reset();
    } catch (error) {
      setIsError(true);
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="contact-page" id="top">
      <SiteHeader
        activePage="contact"
        actionLabel="Hacer pedido"
        actionHref="/pedidos"
        actionAriaLabel="Ir a realizar un pedido"
      />

      <section className="contact-hero">
        <div className="contact-hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> Estamos para escucharte
          </p>
          <h1>
            Hablemos de <em>buen sabor.</em>
          </h1>
          <p>
            ¿Tienes una pregunta, una sugerencia o quieres conocer más sobre
            nuestros platos? Escríbenos y cuéntanos cómo podemos ayudarte.
          </p>
        </div>
        <div className="contact-hero-stamp" aria-hidden="true">
          <span>MAKARIOS</span>
          <strong>Contigo</strong>
          <span>EN CADA DETALLE</span>
        </div>
      </section>

      <section className="contact-content" aria-labelledby="contact-form-title">
        <div className="contact-intro">
          <p className="eyebrow">Contacto</p>
          <h2 id="contact-form-title">
            Cuéntanos <em>qué necesitas.</em>
          </h2>
          <p>
            Completa el formulario con tus datos y escribe tu mensaje con el
            mayor detalle posible para que podamos entender tu consulta.
          </p>
          <div className="contact-required-note">
            <span aria-hidden="true">*</span> Todos los campos son obligatorios.
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field-grid">
            <label className="contact-field">
              <span>Nombres <b aria-hidden="true">*</b></span>
              <input
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Escribe tus nombres"
                minLength={2}
                maxLength={80}
                required
              />
            </label>

            <label className="contact-field">
              <span>Apellidos <b aria-hidden="true">*</b></span>
              <input
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Escribe tus apellidos"
                minLength={2}
                maxLength={80}
                required
              />
            </label>

            <label className="contact-field">
              <span>Correo electrónico <b aria-hidden="true">*</b></span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@correo.com"
                maxLength={150}
                required
              />
            </label>

            <label className="contact-field">
              <span>Teléfono de contacto <b aria-hidden="true">*</b></span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Tu número de teléfono"
                minLength={7}
                maxLength={20}
                pattern="[0-9+() -]{7,20}"
                title="Usa entre 7 y 20 caracteres: números, espacios, paréntesis, + o guiones."
                required
              />
            </label>

            <label className="contact-field contact-field-full">
              <span>Mensaje <b aria-hidden="true">*</b></span>
              <textarea
                name="message"
                rows={6}
                minLength={10}
                maxLength={1500}
                placeholder="Escribe aquí tu pregunta, sugerencia o comentario..."
                required
              />
              <small>Escribe al menos 10 caracteres.</small>
            </label>
          </div>

          <div className="contact-form-bottom">
            <button className="button button-primary contact-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando mensaje..." : "Enviar mensaje"} <span aria-hidden="true">→</span>
            </button>
            <p>Usaremos tus datos únicamente para atender tu mensaje.</p>
          </div>

          {status && (
            <div
              className={`contact-status${isError ? " contact-status-error" : ""}`}
              role={isError ? "alert" : "status"}
              aria-live="polite"
            >
              {status}
            </div>
          )}
        </form>
      </section>

      <SiteFooter backLabel="Volver arriba" backHref="#top" backToTop />
    </main>
  );
}
