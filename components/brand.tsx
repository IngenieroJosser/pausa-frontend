import Image from "next/image";

/** Identidad PAUSA: mismo isotipo para logo, favicon y touch icons. */
export function Brand({ compact = false, onClick }: { compact?: boolean; onClick?: () => void }) {
  const content = (
    <>
      <span className="brand-symbol" aria-hidden="true">
        <Image
          src="/logo-mark.svg"
          alt=""
          width={42}
          height={42}
          unoptimized
          priority
          className="brand-symbol-image"
        />
      </span>
      {!compact && (
        <span className="brand-lockup">
          <span className="brand-wordmark">PAUSA<span className="brand-wordmark-dot">.</span></span>
          <span className="brand-baseline">PIENSA. VERIFICA. DECIDE.</span>
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="brand brand-btn" onClick={onClick} aria-label="Volver al inicio · PAUSA" title="Volver al inicio">
        {content}
      </button>
    );
  }

  return <div className="brand" aria-label="PAUSA">{content}</div>;
}
