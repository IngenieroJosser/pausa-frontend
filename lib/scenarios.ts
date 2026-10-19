export type RiskSignal = "pago" | "urgencia" | "canal" | "datos";

export type Choice = {
  id: string;
  label: string;
  description?: string;
  icon?: "card" | "message" | "search" | "shield" | "alert";
  signal: RiskSignal;
};

export type ScenarioSignal = {
  label: string;
  detail: string;
  color?: "coral" | "amber" | "purple" | "teal";
  targetPhrase?: string;
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
  signals: ScenarioSignal[];
  caseSource?: {
    caseName: string;
    organization: string;
    pedagogy: string;
  };
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
    {
      id: "pay",
      label: "Pagar para no perder el cupo",
      description: "Hacer el pago ahora mismo para asegurar la oportunidad de trabajo.",
      icon: "card",
      signal: "pago",
    },
    {
      id: "ask",
      label: "Pedir más detalles por el mismo chat",
      description: "Responder para solicitar más información sobre el proceso.",
      icon: "message",
      signal: "canal",
    },
    {
      id: "verify",
      label: "Buscar la empresa y verificar por un canal oficial",
      description: "Contactar a la empresa por sus canales oficiales para confirmar si es real.",
      icon: "search",
      signal: "canal",
    },
  ],
  explanation: "Una empresa legítima no debería cobrar por participar en un proceso de selección. Verifica usando un canal que tú mismo encuentres, no uno enviado en el mensaje.",
  signals: [
    {
      label: "Pago anticipado",
      detail: "Te piden dinero antes de cualquier verificación laboral o firma de contrato.",
      color: "coral",
      targetPhrase: "pagar hoy $48.000",
    },
    {
      label: "Urgencia artificial",
      detail: "Presionan con plazo inmediato ('hoy') para que decidas rápido y sin consultar.",
      color: "amber",
      targetPhrase: "hoy",
    },
    {
      label: "Datos sensibles",
      detail: "Solicitan foto de cédula y datos personales sin contrato ni política de datos.",
      color: "purple",
      targetPhrase: "foto de tu cédula",
    },
  ],
  caseSource: {
    caseName: "Modalidad Falsa Vacante Laboral",
    organization: "Operación “Thunder” · Policía Nacional de Colombia",
    pedagogy: "Eficacia probada en formación de respuesta inmediata (Estudio IEEE Phishing Training)",
  },
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
      {
        id: "transfer",
        label: "Transferir y guardar el comprobante",
        description: "Hacer la transferencia bancaria para asegurar el uniforme y asistir.",
        icon: "card",
        signal: "pago",
      },
      {
        id: "negotiate",
        label: "Pedir pagar solo la mitad",
        description: "Proponer pagar el saldo al momento de recibir la prenda.",
        icon: "message",
        signal: "pago",
      },
      {
        id: "refuse",
        label: "No pagar y confirmar la vacante con el restaurante",
        description: "Buscar el teléfono oficial del establecimiento y corroborar la vacante.",
        icon: "search",
        signal: "canal",
      },
    ],
    explanation: "Cambiar el monto no elimina el riesgo. No pagues para acceder a una vacante y confirma que el negocio realmente está contratando.",
    signals: [
      {
        label: "Cobro para acceder",
        detail: "La oportunidad depende de un desembolso previo, patrón típico de estafa.",
        color: "coral",
        targetPhrase: "cuesta $35.000. Transfiere ahora",
      },
      {
        label: "Beneficio futuro no garantizado",
        detail: "Prometen entregar algo material después de transferir a una cuenta particular.",
        color: "amber",
        targetPhrase: "mañana te lo entregamos",
      },
      {
        label: "Canal no institucional",
        detail: "Coordinan contrataciones exclusivamente por mensajería instantánea.",
        color: "purple",
        targetPhrase: "Restaurante La Cosecha",
      },
    ],
    caseSource: {
      caseName: "Cobro de dotación simulada",
      organization: "Operación “Thunder” · Policía Nacional de Colombia",
      pedagogy: "Refuerzo contextual inmediato ante sesgo de pérdida económica (IEEE)",
    },
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
      {
        id: "open",
        label: "Abrir rápido antes de perder la vacante",
        description: "Hacer clic de inmediato en el enlace para no arriesgar la oportunidad.",
        icon: "alert",
        signal: "urgencia",
      },
      {
        id: "forward",
        label: "Reenviar el enlace a un amigo",
        description: "Pedirle a otra persona que revise o intente registrarse primero.",
        icon: "message",
        signal: "datos",
      },
      {
        id: "pause",
        label: "Detenerme y verificar empresa, dominio y vacante",
        description: "Hacer una pausa, buscar el portal oficial y corroborar la oferta de empleo.",
        icon: "shield",
        signal: "canal",
      },
    ],
    explanation: "Una oportunidad real permite verificar. La presión extrema busca que actúes antes de revisar el dominio, la empresa y el uso de tus datos.",
    signals: [
      {
        label: "Tiempo límite asfixiante",
        detail: "Un plazo de minutos (20 min) busca bloquear el pensamiento crítico.",
        color: "amber",
        targetPhrase: "en 20 minutos",
      },
      {
        label: "Amenaza de pérdida",
        detail: "Explotan el sesgo de aversión a la pérdida ('asignamos el cupo a otra persona').",
        color: "coral",
        targetPhrase: "asignamos el cupo a otra persona",
      },
      {
        label: "Enlace externo sospechoso",
        detail: "Empujan a un formulario externo desconocido para capturar datos masivos.",
        color: "purple",
        targetPhrase: "Ingresa ya al enlace",
      },
    ],
    caseSource: {
      caseName: "Ingeniería social por urgencia y fomo",
      organization: "Operación “Thunder” · Policía Nacional de Colombia",
      pedagogy: "Desarme del secuestro de atención por límite de tiempo (IEEE Phishing Training)",
    },
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
      {
        id: "email",
        label: "Escribir al correo que enviaron",
        description: "Enviar los datos directamente a la dirección indicada en el mensaje.",
        icon: "message",
        signal: "canal",
      },
      {
        id: "google",
        label: "Buscar el sitio oficial y contactar desde allí",
        description: "Localizar de forma autónoma el conmutador o web legítima de la compañía.",
        icon: "search",
        signal: "canal",
      },
      {
        id: "contract",
        label: "Esperar el contrato para revisar el logo",
        description: "Avanzar en el trámite y juzgar solo por la apariencia gráfica posterior.",
        icon: "shield",
        signal: "datos",
      },
    ],
    explanation: "El canal incluido en el mensaje puede ser parte del engaño. Busca el sitio oficial por tu cuenta y compara dominio, vacante y datos de contacto.",
    signals: [
      {
        label: "Canal controlado por el atacante",
        detail: "El remitente dicta qué medio usar para evitar que consultes fuentes verificadas.",
        color: "purple",
        targetPhrase: "seleccion@grupo-andino-empleos.co",
      },
      {
        label: "Aislamiento inducido",
        detail: "Prohíben contactar a la organización con la excusa de 'convocatoria confidencial'.",
        color: "coral",
        targetPhrase: "No llames a la empresa",
      },
      {
        label: "Dominio clonado o similar",
        detail: "Registran dominios con guiones o terminaciones inusuales para fingir legitimidad.",
        color: "amber",
        targetPhrase: "grupo-andino-empleos.co",
      },
    ],
    caseSource: {
      caseName: "Typosquatting y aislamiento de la víctima",
      organization: "Operación “Thunder” · Policía Nacional de Colombia",
      pedagogy: "Consolidación de canal alterno autónomo sobre validación de apariencia (IEEE)",
    },
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
      {
        id: "watermark",
        label: "Enviar las fotos con una marca de agua",
        description: "Poner un texto sobre la cédula pensando que así estás totalmente protegido.",
        icon: "shield",
        signal: "datos",
      },
      {
        id: "minimum",
        label: "Enviar solo una cara de la cédula",
        description: "Omitir el reverso para reducir parcialmente los datos expuestos.",
        icon: "alert",
        signal: "datos",
      },
      {
        id: "stop",
        label: "No enviar datos y verificar quién los solicita",
        description: "Rehusar el envío hasta identificar con certeza a la persona jurídica responsable.",
        icon: "search",
        signal: "canal",
      },
    ],
    explanation: "Antes de compartir documentos debes conocer al responsable, la finalidad y el tratamiento de los datos. Aquí ni siquiera identifican a la empresa.",
    signals: [
      {
        label: "Exceso de datos sensibles",
        detail: "Piden cédula, selfie y EPS antes de cualquier entrevista formal o vinculación.",
        color: "coral",
        targetPhrase: "cédula por ambos lados, dirección, EPS y una selfie",
      },
      {
        label: "Identidad del receptor oculta",
        detail: "Ocultan la razón social real para operar en el anonimato e impunidad.",
        color: "amber",
        targetPhrase: "La empresa se revela después",
      },
      {
        label: "Riesgo de suplantación de identidad",
        detail: "Con estos documentos pueden abrir billeteras digitales o tramitar créditos fraudulentos.",
        color: "purple",
        targetPhrase: "validar tu identidad",
      },
    ],
    caseSource: {
      caseName: "Robo de identidad digital y créditos exprés",
      organization: "Operación “Thunder” · Policía Nacional de Colombia",
      pedagogy: "Sensibilización sobre vector de datos biométricos y documentales (IEEE)",
    },
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
    {
      id: "login",
      label: "Entrar al enlace y revisar el saldo",
      description: "Abrir la dirección para comprobar cuántos puntos tienes acumulados.",
      icon: "alert",
      signal: "urgencia",
    },
    {
      id: "app",
      label: "Abrir la app oficial del banco y comprobar allí",
      description: "Ignorar el mensaje y entrar a la banca móvil oficial directamente.",
      icon: "shield",
      signal: "canal",
    },
    {
      id: "reply",
      label: "Responder para confirmar si es real",
      description: "Preguntar por el mismo chat si el mensaje proviene efectivamente del banco.",
      icon: "message",
      signal: "canal",
    },
  ],
  explanation: "Aplicaste el mismo criterio en un contexto distinto: no usar el enlace recibido y verificar desde un canal independiente que ya conoces.",
  signals: [
    {
      label: "Dominio imitado / Typosquatting",
      detail: "Utiliza un dominio '.info' no oficial imitando la marca bancaria.",
      color: "coral",
      targetPhrase: "bancocentral-beneficios.info",
    },
    {
      label: "Vencimiento inmediato y cebo",
      detail: "Recompensa económica atractiva con plazo de pocos minutos para provocar prisa.",
      color: "amber",
      targetPhrase: "vencen hoy... antes de las 7:00 p. m.",
    },
    {
      label: "Captura de credenciales bancarias",
      detail: "El formulario falso clonado roba usuario y clave dinámica de la cuenta.",
      color: "purple",
      targetPhrase: "Confirma tu usuario",
    },
  ],
  caseSource: {
    caseName: "Smishing y phishing bancario de recompensas",
    organization: "Operación “Thunder” · Policía Nacional de Colombia",
    pedagogy: "Medición de transferencia de criterio en entornos no laborales (IEEE Phishing Efficacy)",
  },
};

export function getAdaptiveScenario(signal: RiskSignal) {
  return adaptiveScenarios[signal];
}

export function getScenarioById(id: string) {
  if (id === diagnosticScenario.id) return diagnosticScenario;
  if (id === transferScenario.id) return transferScenario;
  return Object.values(adaptiveScenarios).find((scenario) => scenario.id === id) ?? null;
}
