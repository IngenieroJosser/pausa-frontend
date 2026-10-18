import { Brand } from "./brand";

const labels = ["Diagnóstico", "Práctica", "Transferencia"];

export function Progress({ step, onHome }: { step: number; onHome?: () => void }) {
  return (
    <header className="topbar">
      <Brand onClick={onHome} />
      <div className="progress-wrap" aria-label={`Paso ${step} de 3`}>
        <div className="progress-copy"><span>{labels[Math.min(step - 1, 2)]}</span><span>{step}/3</span></div>
        <div className="progress-track"><span style={{ width: `${(step / 3) * 100}%` }} /></div>
      </div>
    </header>
  );
}
