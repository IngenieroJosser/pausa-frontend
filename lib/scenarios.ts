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
  goal?: "empleo" | "dinero" | "datos";
  family?: string;
  risk?: boolean;
  topic?: string;
  channel?: "whatsapp" | "sms" | "email";
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

import scenarioBank from "@/shared/public-scenario-bank.json";

// Frontend only renders educational content. Correct answers are never sent
// as trusted inputs: the backend independently validates every decision.
export const fullScenarioBank: Scenario[] = scenarioBank.map((item) => item as Scenario);
export const diagnosticScenario: Scenario = fullScenarioBank.find((s) => s.goal === "empleo" && s.stage === "diagnostico") ?? fullScenarioBank[0];

export function getScenarioById(id: string): Scenario | null {
  return fullScenarioBank.find((item) => item.id === id) ?? null;
}
