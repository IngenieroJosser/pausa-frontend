export const SCENARIO_VERSION = "2026.10.1";

export const scenarios = {
  "oferta-auxiliar": {
    id: "oferta-auxiliar",
    version: SCENARIO_VERSION,
    stage: "diagnostico",
    skill: "verificacion_independiente",
    choiceIds: ["pay", "ask", "verify"],
    correctChoiceId: "verify",
    errorSignals: { pay: "pago", ask: "canal", verify: "canal" },
  },
  "uniforme-restaurante": {
    id: "uniforme-restaurante",
    version: SCENARIO_VERSION,
    stage: "practica",
    skill: "deteccion_cobros",
    choiceIds: ["transfer", "negotiate", "refuse"],
    correctChoiceId: "refuse",
    errorSignals: { transfer: "pago", negotiate: "pago", refuse: "canal" },
  },
  "entrevista-inmediata": {
    id: "entrevista-inmediata",
    version: SCENARIO_VERSION,
    stage: "practica",
    skill: "control_urgencia",
    choiceIds: ["open", "forward", "pause"],
    correctChoiceId: "pause",
    errorSignals: { open: "urgencia", forward: "datos", pause: "canal" },
  },
  "correo-similar": {
    id: "correo-similar",
    version: SCENARIO_VERSION,
    stage: "practica",
    skill: "verificacion_independiente",
    choiceIds: ["email", "google", "contract"],
    correctChoiceId: "google",
    errorSignals: { email: "canal", google: "canal", contract: "datos" },
  },
  "formulario-datos": {
    id: "formulario-datos",
    version: SCENARIO_VERSION,
    stage: "practica",
    skill: "custodia_identidad",
    choiceIds: ["watermark", "minimum", "stop"],
    correctChoiceId: "stop",
    errorSignals: { watermark: "datos", minimum: "datos", stop: "canal" },
  },
  "banco-premio": {
    id: "banco-premio",
    version: SCENARIO_VERSION,
    stage: "transferencia",
    skill: "transferencia_criterio",
    choiceIds: ["login", "app", "reply"],
    correctChoiceId: "app",
    errorSignals: { login: "urgencia", app: "canal", reply: "canal" },
  },
};

const practiceBySignal = {
  pago: "uniforme-restaurante",
  urgencia: "entrevista-inmediata",
  canal: "correo-similar",
  datos: "formulario-datos",
};

export function evaluateDecision(scenarioId, choiceId) {
  const scenario = scenarios[scenarioId];
  if (!scenario || !scenario.choiceIds.includes(choiceId)) return null;
  return {
    correct: scenario.correctChoiceId === choiceId,
    signal: scenario.errorSignals[choiceId],
    skill: scenario.skill,
    stage: scenario.stage,
  };
}

export function getExpectedScenario(decisions) {
  if (decisions.length === 0) return "oferta-auxiliar";
  if (decisions.length === 1) {
    const first = decisions[0];
    return practiceBySignal[first.correct ? "datos" : first.error_signal];
  }
  if (decisions.length === 2) return "banco-premio";
  return null;
}

export function publicScenario(scenarioId) {
  const scenario = scenarios[scenarioId];
  if (!scenario) return null;
  return {
    id: scenario.id,
    version: scenario.version,
    stage: scenario.stage,
    skill: scenario.skill,
    choiceIds: scenario.choiceIds,
  };
}
