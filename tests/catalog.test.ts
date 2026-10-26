import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

type Case = { id: string; goal: string; stage: string; family: string; choices: { id: string; signal: string }[]; correctChoiceId?: string };
const bank = JSON.parse(readFileSync(new URL("../shared/scenario-bank.json", import.meta.url), "utf8")) as Case[];
const publicBank = JSON.parse(readFileSync(new URL("../shared/public-scenario-bank.json", import.meta.url), "utf8")) as Case[];

test("135 situaciones con 45 por tema y 15 por etapa", () => {
  assert.equal(bank.length, 135);
  assert.equal(new Set(bank.map((item) => item.id)).size, bank.length);
  for (const goal of ["empleo", "dinero", "datos"]) {
    assert.equal(bank.filter((item) => item.goal === goal).length, 45);
    for (const stage of ["diagnostico", "practica", "transferencia"]) {
      assert.equal(bank.filter((item) => item.goal === goal && item.stage === stage).length, 15);
    }
  }
});
test("todas las preguntas tienen 3 elecciones únicas y regla de evaluación del servidor", () => {
  for (const item of bank) {
    assert.equal(item.choices.length, 3, item.id);
    assert.equal(new Set(item.choices.map((c) => c.id)).size, 3, item.id);
    assert.equal(item.choices.filter((choice) => choice.id === item.correctChoiceId).length, 1, item.id);
  }
});
test("catálogo público no incluye el identificador de respuesta correcta", () => {
  assert.equal(publicBank.length, bank.length);
  assert.ok(publicBank.every((item) => !Object.hasOwn(item, "correctChoiceId")));
});
