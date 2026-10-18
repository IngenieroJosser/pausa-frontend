export type RiskSignal = "pago" | "urgencia" | "canal" | "datos";

export type Choice = {
  id: string;
  label: string;
  isCorrect: boolean;
  signal: RiskSignal;
};

export type Scenario = {
  id: string;
  stage: "diagnostico" | "practica" | "transferencia";
  eyebrow: string;
  sender: string;
  avatar: string;
  time: string;
  messages: string[];
  prompt: string;
  choices: Choice[];
  explanation: string;
  signals: { label: string; detail: string }[];
};

export const diagnosticScenario: Scenario = {
  id: "oferta-auxiliar",
  stage: "diagnostico",
  eyebrow: "Diagnóstico inicial",
  sender: "Talento Humano Express",
  avatar: "TH",
  time: "10:42 a. m.",
  messages: [
    "Hola, vimos tu hoja de vida. Fuiste preseleccionado para Auxiliar Logístico. Salario: $2.400.000 + beneficios.",
    "Para separar el cupo debes pagar hoy $48.000 del examen médico. Envíanos foto de tu cédula y el comprobante por aquí.",
  ],
  prompt: "¿Qué harías antes de responder?",
  choices: [
    { id: "pay", label: "Pagar para no perder el cupo", isCorrect: false, signal: "pago" },
    { id: "ask", label: "Pedir más detalles por el mismo chat", isCorrect: false, signal: "canal" },
    { id: "verify", label: "Buscar la empresa y verificar por un canal oficial", isCorrect: true, signal: "canal" },
  ],
  explanation: "Una empresa legítima no debería cobrar por participar en un proceso de selección. Verifica usando un canal que tú mismo encuentres, no uno enviado en el mensaje.",
  signals: [
    { label: "Pago anticipado", detail: "Te cobran antes de firmar o conocer la empresa." },
    { label: "Urgencia artificial", detail: "“Hoy” reduce el tiempo para pensar y verificar." },
    { label: "Datos sensibles", detail: "Piden cédula sin explicar el tratamiento de datos." },
  ],
};

const adaptiveScenarios: Record<RiskSignal, Scenario> = {
  pago: {
    id: "uniforme-restaurante",
    stage: "practica",
    eyebrow: "Práctica adaptada · pagos",
    sender: "Restaurante La Cosecha",
    avatar: "LC",
    time: "11:08 a. m.",
    messages: [
      "Tu perfil encaja para mesero de fin de semana. La entrevista es mañana.",
      "El uniforme cuesta $35.000. Transfiere ahora y mañana te lo entregamos en la entrevista.",
    ],
    prompt: "¿Cuál es la decisión más segura?",
    choices: [
      { id: "transfer", label: "Transferir y guardar el comprobante", isCorrect: false, signal: "pago" },
      { id: "negotiate", label: "Pedir pagar solo la mitad", isCorrect: false, signal: "pago" },
      { id: "refuse", label: "No pagar y confirmar la vacante con el restaurante", isCorrect: true, signal: "canal" },
    ],
    explanation: "Cambiar el monto no elimina el riesgo. No pagues para acceder a una vacante y confirma que el negocio realmente está contratando.",
    signals: [
      { label: "Cobro para acceder", detail: "La oportunidad depende de un pago previo." },
      { label: "Beneficio futuro", detail: "Prometen entregar algo después de transferir." },
    ],
  },
  urgencia: {
    id: "entrevista-inmediata",
    stage: "practica",
    eyebrow: "Práctica adaptada · urgencia",
    sender: "Selección Nacional",
    avatar: "SN",
    time: "2:17 p. m.",
    messages: [
      "Tenemos una vacante remota. Necesitamos cerrar la contratación en 20 minutos.",
      "Ingresa ya al enlace y completa todos los datos o asignamos el cupo a otra persona.",
    ],
    prompt: "¿Cómo respondes a la presión?",
    choices: [
      { id: "open", label: "Abrir rápido antes de perder la vacante", isCorrect: false, signal: "urgencia" },
      { id: "forward", label: "Reenviar el enlace a un amigo", isCorrect: false, signal: "datos" },
      { id: "pause", label: "Detenerme y verificar empresa, dominio y vacante", isCorrect: true, signal: "canal" },
    ],
    explanation: "Una oportunidad real permite verificar. La presión extrema busca que actúes antes de revisar el dominio, la empresa y el uso de tus datos.",
    signals: [
      { label: "Tiempo límite", detail: "Un plazo de minutos impide una revisión razonable." },
      { label: "Amenaza de pérdida", detail: "Usan el miedo a perder la oportunidad." },
    ],
  },
  canal: {
    id: "correo-similar",
    stage: "practica",
    eyebrow: "Práctica adaptada · verificación",
    sender: "Grupo Andino Empleos",
    avatar: "GA",
    time: "4:35 p. m.",
    messages: [
      "Continúa tu proceso escribiendo a seleccion@grupo-andino-empleos.co. Allí te enviarán el contrato.",
      "No llames a la empresa porque la convocatoria es confidencial.",
    ],
    prompt: "¿Qué verificas primero?",
    choices: [
      { id: "email", label: "Escribir al correo que enviaron", isCorrect: false, signal: "canal" },
      { id: "google", label: "Buscar el sitio oficial y contactar desde allí", isCorrect: true, signal: "canal" },
      { id: "contract", label: "Esperar el contrato para revisar el logo", isCorrect: false, signal: "datos" },
    ],
    explanation: "El canal incluido en el mensaje puede ser parte del engaño. Busca el sitio oficial por tu cuenta y compara dominio, vacante y datos de contacto.",
    signals: [
      { label: "Canal controlado", detail: "El remitente decide dónde debes verificar." },
      { label: "Aislamiento", detail: "Piden que no contactes a la organización real." },
    ],
  },
  datos: {
    id: "formulario-datos",
    stage: "practica",
    eyebrow: "Práctica adaptada · datos",
    sender: "Empleos Colombia Ya",
    avatar: "EC",
    time: "8:51 a. m.",
    messages: [
      "Para validar tu perfil envíanos cédula por ambos lados, dirección, EPS y una selfie sosteniendo el documento.",
      "La empresa se revela después de validar tu identidad.",
    ],
    prompt: "¿Qué harías con esta solicitud?",
    choices: [
      { id: "watermark", label: "Enviar las fotos con una marca de agua", isCorrect: false, signal: "datos" },
      { id: "minimum", label: "Enviar solo una cara de la cédula", isCorrect: false, signal: "datos" },
      { id: "stop", label: "No enviar datos y verificar quién los solicita", isCorrect: true, signal: "canal" },
    ],
    explanation: "Antes de compartir documentos debes conocer al responsable, la finalidad y el tratamiento de los datos. Aquí ni siquiera identifican a la empresa.",
    signals: [
      { label: "Exceso de datos", detail: "Solicitan más información de la necesaria." },
      { label: "Identidad oculta", detail: "No puedes saber quién almacenará tus documentos." },
    ],
  },
};

export const transferScenario: Scenario = {
  id: "banco-premio",
  stage: "transferencia",
  eyebrow: "Prueba de transferencia",
  sender: "Beneficios Banco Central",
  avatar: "BC",
  time: "6:24 p. m.",
  messages: [
    "Acumulaste 18.500 puntos que vencen hoy. Canjéalos por un bono de mercado.",
    "Confirma tu usuario en bancocentral-beneficios.info antes de las 7:00 p. m.",
  ],
  prompt: "Es un contexto nuevo. ¿Qué decides?",
  choices: [
    { id: "login", label: "Entrar al enlace y revisar el saldo", isCorrect: false, signal: "urgencia" },
    { id: "app", label: "Abrir la app oficial del banco y comprobar allí", isCorrect: true, signal: "canal" },
    { id: "reply", label: "Responder para confirmar si es real", isCorrect: false, signal: "canal" },
  ],
  explanation: "Aplicaste el mismo criterio en un contexto distinto: no usar el enlace recibido y verificar desde un canal independiente que ya conoces.",
  signals: [
    { label: "Dominio parecido", detail: "Imita el nombre de una organización conocida." },
    { label: "Vencimiento inmediato", detail: "La recompensa y el tiempo límite empujan a actuar." },
  ],
};

export function getAdaptiveScenario(signal: RiskSignal) {
  return adaptiveScenarios[signal];
}
