import { useMemo, useState, useEffect } from "react";
import "./Order.css";
import { products, formatPrice } from "./products";
import { readCart, writeCart } from "./cartStorage";
import { submitOrder } from "./apiClient";
import { isSundayInBogota } from "./businessHours";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export default function Order() {
  useEffect(() => {
        document.title = 'Realizar Pedido - Makarios Company';
      }, []);
  const [cart, setCart] = useState(() => readCart());
  const [isClosedSunday, setIsClosedSunday] = useState(isSundayInBogota);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setIsClosedSunday(isSundayInBogota()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const selectedItems = useMemo(
    () => cart
      .map((item) => {
        const product = products.find((entry) => entry.id === item.id);
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter(Boolean),
    [cart]
  );

  const itemCount = selectedItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  function updateCart(nextCart) {
    setCart(nextCart);
    writeCart(nextCart);
    setConfirmation("");
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSundayInBogota()) {
      setIsClosedSunday(true);
      setErrorMessage("Los domingos no recibimos pedidos. Puedes volver a intentarlo de lunes a sábado, de 12:00 p. m. a 7:00 p. m.");
      return;
    }
    if (selectedItems.length === 0 || isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setErrorMessage("");
    setConfirmation("");
    try {
      const payload = {
        orderType: "delivery",
        paymentMethod,
        customerName: formData.get("customerName"),
        customerPhone: formData.get("customerPhone"),
        customerEmail: formData.get("customerEmail") || "",
        deliveryAddress: formData.get("deliveryAddress") || "",
        neighborhood: formData.get("neighborhood") || "",
        deliveryReference: formData.get("deliveryReference") || "",
        orderNotes: formData.get("orderNotes") || "",
        subtotal,
        items: selectedItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };
      const { order, trackingToken } = await submitOrder(payload);
      setConfirmation(
        `Tu pedido ${order.code} ha sido registrado. Guarda también este código privado de seguimiento: ${trackingToken}. Lo necesitarás para consultar el estado. Te contactaremos al ${order.customer.phone} para confirmar disponibilidad, tiempo de entrega y el valor del domicilio.`
      );
      form.reset();
      setCart([]);
      writeCart([]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function addProduct(productId) {
    const current = readCart();
    const existing = current.find((item) => item.id === productId);
    const next = existing
      ? current.map((item) => item.id === productId
          ? { ...item, quantity: Math.min(99, item.quantity + 1) }
          : item)
      : [...current, { id: productId, quantity: 1 }];
    updateCart(next);
  }

  function changeQuantity(productId, amount) {
    const next = cart
      .map((item) => item.id === productId
        ? { ...item, quantity: item.quantity + amount }
        : item)
      .filter((item) => item.quantity > 0);
    updateCart(next);
  }

  function removeProduct(productId) {
    updateCart(cart.filter((item) => item.id !== productId));
  }

  return (
    <main className="order-page">
      <SiteHeader
        activePage="order"
        actionLabel="Seguir eligiendo"
        actionHref="/menu"
        actionAriaLabel="Volver al menú para seguir eligiendo"
      />

      <section className="order-hero">
        <p className="eyebrow"><span className="eyebrow-dot" /> Un buen antojo está cerca</p>
        <h1>Hagamos tu pedido <em>especial.</em></h1>
        <p>
          Elige tus platos, revisa las cantidades y déjanos los datos de entrega.
          Recibimos pedidos únicamente a domicilio.
        </p>
        <div className="order-steps" aria-label="Pasos para realizar el pedido">
          <span><b>01</b> Elige tus platos</span>
          <span><b>02</b> Completa tus datos</span>
          <span><b>03</b> Revisa el resumen</span>
        </div>
        <p className={`order-hours-note${isClosedSunday ? " is-closed" : ""}`}>
          {isClosedSunday
            ? "Hoy domingo no recibimos pedidos. Volvemos el lunes a las 12:00 p. m."
            : "Horario de atención: lunes a sábado, de 12:00 p. m. a 7:00 p. m. (hora de Colombia)."}
        </p>
      </section>

      <div className="order-layout">
        <div className="order-main-column">
          <section className="order-section" aria-labelledby="choose-dishes-title">
            <div className="order-section-heading">
              <div>
                <p className="eyebrow">Nuestra selección</p>
                <h2 id="choose-dishes-title">¿Qué se te <em>antoja?</em></h2>
              </div>
              <span className="order-count-pill">{itemCount} {itemCount === 1 ? "producto" : "productos"}</span>
            </div>
            <div className="order-product-list">
              {products.map((product) => {
                const selected = cart.find((item) => item.id === product.id);
                return (
                  <article className="order-product-card" key={product.id}>
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <div className="order-product-info">
                      <p className="order-product-category">{product.category}</p>
                      <h3>{product.name}</h3>
                      <p className="order-product-description">{product.description}</p>
                      <div className="order-product-bottom">
                        <strong>{formatPrice(product.price)}</strong>
                        {selected && <span className="order-selected-note">En tu pedido: {selected.quantity}</span>}
                      </div>
                    </div>
                    <button className="order-add-button" type="button" onClick={() => addProduct(product.id)}>
                      <span aria-hidden="true">+</span><span className="visually-hidden">Agregar {product.name}</span>
                    </button>
                  </article>
                );
              })}
            </div>
            <p className="order-catalog-note">El valor del domicilio y la disponibilidad se confirman al recibir tu pedido.</p>
          </section>

          <section className="order-section cart-section" aria-labelledby="cart-title">
            <div className="order-section-heading">
              <div>
                <p className="eyebrow">Antes de continuar</p>
                <h2 id="cart-title">Tu <em>pedido.</em></h2>
              </div>
              {selectedItems.length > 0 && (
                <button className="order-clear-button" type="button" onClick={() => updateCart([])}>Vaciar pedido</button>
              )}
            </div>

            {selectedItems.length === 0 ? (
              <div className="order-empty-cart">
                <span className="order-empty-icon" aria-hidden="true">＋</span>
                <div>
                  <h3>Tu pedido está vacío</h3>
                  <p>Agrega uno o más platos desde la selección de arriba. Puedes cambiar cantidades cuando quieras.</p>
                </div>
              </div>
            ) : (
              <div className="order-cart-lines">
                {selectedItems.map((item) => (
                  <article className="order-cart-line" key={item.id}>
                    <img src={item.image} alt="" />
                    <div className="order-cart-line-details">
                      <h3>{item.name}</h3>
                      <span>{formatPrice(item.price)} c/u</span>
                      <button type="button" className="order-remove-button" onClick={() => removeProduct(item.id)}>Quitar</button>
                    </div>
                    <div className="order-quantity-control" aria-label={`Cantidad de ${item.name}`}>
                      <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Reducir cantidad de ${item.name}`}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Aumentar cantidad de ${item.name}`} disabled={item.quantity >= 99}>+</button>
                    </div>
                    <strong className="order-line-total">{formatPrice(item.price * item.quantity)}</strong>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="order-checkout" aria-labelledby="checkout-title">
          <div className="checkout-heading">
            <p className="eyebrow">Casi listo</p>
            <h2 id="checkout-title">Datos para <em>tu pedido.</em></h2>
            <p>Completa la información para preparar el resumen.</p>
          </div>

          <form className="order-form" onSubmit={handleSubmit}>
            <div className="order-form-fields">
              <label className="order-field">
                <span>Nombre completo *</span>
                <input name="customerName" type="text" placeholder="¿A nombre de quién?" autoComplete="name" required />
              </label>
              <label className="order-field">
                <span>Teléfono de contacto *</span>
                <input name="customerPhone" type="tel" placeholder="Tu número de celular" autoComplete="tel" required />
              </label>
              <label className="order-field">
                <span>Correo electrónico (opcional)</span>
                <input name="customerEmail" type="email" placeholder="nombre@correo.com" autoComplete="email" />
              </label>

              <label className="order-field">
                <span>Dirección de entrega *</span>
                <input name="deliveryAddress" type="text" placeholder="Calle, carrera, número..." autoComplete="street-address" required />
              </label>
              <label className="order-field">
                <span>Barrio o zona *</span>
                <input name="neighborhood" type="text" placeholder="Barrio donde te encuentras" required />
              </label>
              <label className="order-field">
                <span>Referencia para llegar (opcional)</span>
                <input name="deliveryReference" type="text" placeholder="Edificio, portería, casa esquinera..." />
              </label>

              <label className="order-field">
                <span>Forma de pago preferida</span>
                <select name="paymentMethod" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia (por coordinar)</option>
                  <option value="card">Tarjeta al recibir (por confirmar)</option>
                </select>
              </label>
              <label className="order-field">
                <span>Indicaciones adicionales (opcional)</span>
                <textarea name="orderNotes" rows="3" placeholder="Aclaraciones sobre el pedido o la entrega..." />
              </label>
            </div>

            <div className="order-summary">
              <div className="order-summary-line"><span>Productos ({itemCount})</span><strong>{formatPrice(subtotal)}</strong></div>
              <div className="order-summary-line"><span>Domicilio</span><strong>Por confirmar</strong></div>
              <div className="order-summary-total"><span>Subtotal de productos</span><strong>{formatPrice(subtotal)}</strong></div>
              <p>El valor del domicilio, la disponibilidad y el tiempo de entrega se confirmarán antes de aceptar el pedido.</p>
            </div>

            {confirmation && (
              <div className="order-status-message order-success-message" role="status">
                {confirmation}
              </div>
            )}
            {errorMessage && (
              <div className="order-status-message order-error-message" role="alert">
                {errorMessage}
              </div>
            )}

            <button className="order-submit-button" type="submit" disabled={selectedItems.length === 0 || isSubmitting || isClosedSunday}>
              {isSubmitting ? "Enviando pedido..." : "Enviar mi pedido"} <span aria-hidden="true">→</span>
            </button>
            {isClosedSunday ? (
              <p className="order-submit-hint">Los pedidos se habilitan de lunes a sábado, de 12:00 p. m. a 7:00 p. m.</p>
            ) : selectedItems.length === 0 && <p className="order-submit-hint">Agrega al menos un plato para continuar.</p>}
            <p className="order-privacy-note">Tus datos se envían de forma segura al sistema del restaurante y se utilizan únicamente para preparar y entregar tu pedido.</p>
          </form>
        </aside>
      </div>

      <section className="order-help-strip">
        <div><span aria-hidden="true">✳</span><p><strong>¿Tienes una pregunta?</strong><br />La página de contacto sigue siendo independiente para consultas generales.</p></div>
        <a href="/contacto">Ir a contacto <span aria-hidden="true">↗</span></a>
      </section>

      <SiteFooter
        backLabel="Volver al menú"
        backHref="/menu"
        backToTop={false}
      />
    </main>
  );
}
