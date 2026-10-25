import { useState } from "react";
import { sendChatMessage, trackOrder } from "../apiClient";
import "./ChatWidget.css";

const STATUS_LABELS = {
  pending: "Pendiente de confirmación",
  confirmed: "Confirmado",
  preparing: "En preparación",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const GREETING = {
  role: "model",
  text: "¡Hola! Puedo ayudarte a conocer el menú, elegir un plato o saber cómo hacer tu pedido.",
};

const QUICK_PROMPTS = [
  { label: "¿Qué me recomiendas?", prompt: "Quiero una recomendación para elegir un plato." },
  {
    label: "¿Qué horarios hay?",
    prompt: "¿Qué horarios hay?",
    reply: "Atendemos de lunes a sábado, de 12:00 p. m. a 7:00 p. m. Los domingos no tenemos servicio ni recibimos pedidos.",
  },
  {
    label: "¿Cómo puedo pedir?",
    prompt: "¿Cómo puedo pedir?",
    reply: "En la opción «Hacer pedido» puedes añadir los platos que quieras, completar tus datos de entrega, elegir el método de pago y enviar el pedido. Al terminar recibirás un número de pedido y un código privado para consultar su estado. Solo hacemos domicilios.",
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("chat");
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [chatError, setChatError] = useState("");
  const [trackResult, setTrackResult] = useState("");
  const [trackError, setTrackError] = useState("");

  async function askAssistant(history) {
    setBusy(true);
    setChatError("");
    try {
      const result = await sendChatMessage(history.slice(1).slice(-10));
      setMessages([...history, { role: "model", text: result.reply }]);
    } catch (error) {
      setChatError(error.message);
    } finally {
      setBusy(false);
    }
  }

  function sendChatText(text) {
    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    askAssistant(next);
  }

  function handleQuickPrompt(quickPrompt) {
    if (busy) return;
    const next = [...messages, { role: "user", text: quickPrompt.prompt }];
    setMessages(next);
    setChatError("");
    if (quickPrompt.reply) {
      setMessages([...next, { role: "model", text: quickPrompt.reply }]);
      return;
    }
    askAssistant(next);
  }

  function handleChatSubmit(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendChatText(text);
  }

  async function handleTrackSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const formData = new FormData(event.currentTarget);
    setBusy(true);
    setTrackError("");
    setTrackResult("");
    try {
      const { order } = await trackOrder(formData.get("orderCode"), formData.get("trackingToken"));
      const status = STATUS_LABELS[order.status] || "Estado actualizado";
      const updated = order.updatedAt
        ? ` Última actualización: ${new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.updatedAt))}.`
        : "";
      setTrackResult(`Pedido ${order.code}: ${status}.${updated}`);
    } catch (error) {
      setTrackError(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="makarios-assistant">
      {open && (
        <section className="assistant-panel" aria-label="Asistente de Makarios">
          <header className="assistant-header">
            <div><strong>Asistente Makarios</strong><small>Menú, pedidos y consultas</small></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar asistente">×</button>
          </header>
          <div className="assistant-tabs" role="tablist" aria-label="Opciones del asistente">
            <button type="button" role="tab" aria-selected={mode === "chat"} onClick={() => setMode("chat")}>Preguntar</button>
            <button type="button" role="tab" aria-selected={mode === "track"} onClick={() => setMode("track")}>Estado de pedido</button>
          </div>

          {mode === "chat" ? (
            <>
              <div className="assistant-messages" aria-live="polite">
                {messages.map((message, index) => (
                  <p className={`assistant-message ${message.role === "user" ? "from-user" : "from-assistant"}`} key={`${index}-${message.role}`}>
                    {message.text}
                  </p>
                ))}
                {busy && <p className="assistant-message from-assistant">Escribiendo…</p>}
              </div>
              {messages.length === 1 && (
                <div className="assistant-quick-prompts" aria-label="Preguntas rápidas">
                  {QUICK_PROMPTS.map((quickPrompt) => (
                    <button key={quickPrompt.label} type="button" onClick={() => handleQuickPrompt(quickPrompt)} disabled={busy}>
                      {quickPrompt.label}
                    </button>
                  ))}
                </div>
              )}
              {chatError && <p className="assistant-error" role="alert">{chatError}</p>}
              <form className="assistant-composer" onSubmit={handleChatSubmit}>
                <label className="visually-hidden" htmlFor="assistant-question">Escribe tu consulta</label>
                <input id="assistant-question" value={input} onChange={(event) => setInput(event.target.value)} maxLength={1200} placeholder="¿Qué te gustaría saber?" disabled={busy} />
                <button type="submit" disabled={busy || !input.trim()}>Enviar</button>
              </form>
              <small className="assistant-disclaimer">Asistente con IA. No compartas datos personales. Confirma disponibilidad y precios con el equipo.</small>
            </>
          ) : (
            <form className="assistant-track-form" onSubmit={handleTrackSubmit}>
              <p>Ingresa el número de pedido y el código privado que recibiste al realizarlo. No compartas ese código con otras personas.</p>
              <label>Número de pedido<input name="orderCode" placeholder="MK-…" autoComplete="off" required maxLength={48} /></label>
              <label>Código privado de seguimiento<input name="trackingToken" placeholder="Pega aquí tu código privado" autoComplete="off" required minLength={40} maxLength={50} /></label>
              <button type="submit" disabled={busy}>{busy ? "Consultando…" : "Consultar estado"}</button>
              {trackResult && <p className="assistant-success" role="status">{trackResult}</p>}
              {trackError && <p className="assistant-error" role="alert">{trackError}</p>}
            </form>
          )}
        </section>
      )}
      <button className="assistant-launcher" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span aria-hidden="true">✦</span>{open ? "Cerrar" : "¿Te ayudo?"}
      </button>
    </div>
  );
}
