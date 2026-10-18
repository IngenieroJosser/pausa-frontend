export function Brand({
  compact = false,
  onClick,
}: {
  compact?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <svg className="brand-mark" viewBox="0 0 64 68" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="shield-blue" x1="8" y1="5" x2="44" y2="62">
            <stop stopColor="#17619d" />
            <stop offset="1" stopColor="#032953" />
          </linearGradient>
          <linearGradient id="shield-teal" x1="35" y1="5" x2="55" y2="54">
            <stop stopColor="#2bc5bd" />
            <stop offset="1" stopColor="#0795aa" />
          </linearGradient>
        </defs>
        <path d="M32 2 58 14v23c0 14-9 24-26 30C15 61 6 51 6 37V14L32 2Z" fill="url(#shield-blue)" />
        <path d="M32 2c0 8 3 13 10 16 7 3 12 8 13 17 0 14-7 24-23 32 1-11 6-19 15-26 6-5 9-13 8-24L32 2Z" fill="url(#shield-teal)" />
        <path d="M16 20h29c6 0 10 5 10 11v9c0 7-5 11-11 11H29L18 60l2-9c-6-1-9-5-9-11v-9c0-6 3-11 5-11Z" fill="white" />
        <rect x="25" y="28" width="6" height="15" rx="2" fill="#07305b" />
        <rect x="36" y="28" width="6" height="15" rx="2" fill="#07305b" />
      </svg>
      {!compact && <span>PAUSA</span>}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="brand brand-btn"
        onClick={onClick}
        aria-label="Volver al inicio · PAUSA"
        title="Volver al inicio"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="brand" aria-label="PAUSA">
      {content}
    </div>
  );
}
