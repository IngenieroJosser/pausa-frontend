import { test } from "node:test";
import assert from "node:assert/strict";
import { selectScenario, getMeta, recommendationFor } from "@/lib/server/domain";

type Candidate = Parameters<typeof selectScenario>[0]["candidates"][number];
const sample = (i: number, stage: string, signal: string, family: string): Candidate => ({
  id: String(i), slug: `caso-${i}`, fraudPattern: signal,
  difficulty: i % 3 === 0 ? "ADVANCED" : i % 2 === 0 ? "INTERMEDIATE" : "BASIC",
  conversation: { family, stage, skill: "verificacion_independiente", choices: [{ id: "verify", signal: "canal" }] },
});
const pool = [
  sample(1, "diagnostico", "pago", "familia1"),
  sample(2, "diagnostico", "urgencia", "familia2"),
  sample(3, "practica", "pago", "familia1"),
  sample(4, "practica", "canal", "familia2"),
  sample(5, "practica", "datos", "familia3"),
  sample(6, "transferencia", "datos", "familia1"),
  sample(7, "transferencia", "urgencia", "familia4"),
];

test("metadatos sin respuestas correctas y entrada inválida", () => {
  assert.deepEqual(getMeta(null).choices, []);
  assert.equal(getMeta(pool[0].conversation).stage, "diagnostico");
});
test("misma sesión y misma etapa generan el mismo escenario", () => {
  const args = { candidates: pool, sessionId: "sesion-fija", phase: "CALIBRATION" as const };
  assert.equal(selectScenario(args)?.slug, selectScenario(args)?.slug);
});
test("distintas sesiones reciben combinaciones variables", () => {
  const diverse: Candidate[] = Array.from({ length: 15 }, (_, i) => sample(i + 20, "diagnostico", "canal", `family-${i}`));
  const results = new Set(Array.from({ length: 60 }, (_, i) => selectScenario({ candidates: diverse, sessionId: `sesion-${i}`, phase: "CALIBRATION" })?.id));
  assert.ok(results.size >= 8, `Solo se seleccionaron ${results.size} escenarios distintos`);
});
test("foco adaptativo después del diagnóstico", () => {
  const selected = selectScenario({ candidates: pool, sessionId: "1", phase: "PRACTICE", targetSignal: "datos" });
  assert.equal(selected?.fraudPattern, "datos");
});
test("excluye la familia ya vista cuando hay alternativas", () => {
  const selected = selectScenario({ candidates: pool, sessionId: "1", phase: "PRACTICE", usedFamilies: ["familia3"] });
  assert.notEqual(getMeta(selected?.conversation).family, "familia3");
});
test("evita la misma pista durante la transferencia", () => {
  const selected = selectScenario({ candidates: pool, sessionId: "1", phase: "TRANSFER", avoidSignal: "datos" });
  assert.equal(selected?.fraudPattern, "urgencia");
});
test("no elige un escenario fuera de la etapa ni una lista vacía", () => {
  assert.equal(selectScenario({ candidates: [], sessionId: "1", phase: "PRACTICE" }), null);
  assert.equal(selectScenario({ candidates: pool, sessionId: "1", phase: "PRACTICE" })?.conversation && getMeta(selectScenario({ candidates: pool, sessionId: "1", phase: "PRACTICE" })?.conversation).stage, "practica");
});
test("recomendación contextual", () => {
  assert.match(recommendationFor(["pago"]), /pagos/i);
  assert.match(recommendationFor([]), /hábito/i);
});
