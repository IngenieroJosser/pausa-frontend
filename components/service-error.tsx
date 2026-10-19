import { RefreshCw, ServerOff } from "lucide-react";
import { Brand } from "./brand";

export function ServiceError({ onRetry, onHome }: { onRetry: () => void; onHome: () => void }) {
  return (
    <main className="service-error-page">
      <Brand onClick={onHome} />
      <section className="service-error-card" role="alert">
        <span className="service-error-icon"><ServerOff /></span>
        <span className="eyebrow">Conexión interrumpida</span>
        <h1>Tu práctica está a salvo.</h1>
        <p>No pudimos contactar el motor de evaluación. No mostraremos una respuesta inventada ni perderemos tu selección.</p>
        <button className="primary-button" type="button" onClick={onRetry}>
          <RefreshCw size={18} /> Intentar de nuevo
        </button>
      </section>
    </main>
  );
}
