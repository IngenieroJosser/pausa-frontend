import { CornerDownRight } from "lucide-react";

export function Brand({ compact = false, onClick }: { compact?: boolean; onClick?: () => void }) {
  const content = (
    <>
      <span className="brand-symbol" aria-hidden="true"><span className="brand-symbol-stroke" /><CornerDownRight size={15} strokeWidth={2.6} /></span>
      {!compact && <span className="brand-wordmark">PAUSA<span className="brand-wordmark-dot">.</span></span>}
    </>
  );
  if (onClick) {
    return <button type="button" className="brand brand-btn" onClick={onClick} aria-label="Volver al inicio · PAUSA" title="Volver al inicio">{content}</button>;
  }
  return <div className="brand" aria-label="PAUSA">{content}</div>;
}
