/**
 * Catálogo idempotente: conserva el historial de sesiones y decisiones.
 * Nunca elimina opciones/escenarios que hayan sido utilizados por una sesión.
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { PrismaClient, Prisma, Topic, Difficulty, SkillType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type SourceChoice = { id: string; label: string; description?: string; signal: string; icon?: string };
type SourceClue = { label: string; detail: string; targetPhrase?: string };
type SourceScenario = {
  id: string; goal: "empleo" | "dinero" | "datos";
  stage: "diagnostico" | "practica" | "transferencia";
  family: string; topic: string; signal: string; skill: string; risk: boolean;
  messages: string[]; choices: SourceChoice[]; correctChoiceId: string;
  explanation: string; signals: SourceClue[];
  [key: string]: unknown;
};

const topicMap = { empleo: Topic.EMPLOYMENT, dinero: Topic.MONEY, datos: Topic.IDENTITY } as const;
const skillMap: Record<string, SkillType> = {
  deteccion_cobros: SkillType.FINANCIAL_RISK,
  control_urgencia: SkillType.URGENCY_RECOGNITION,
  verificacion_independiente: SkillType.SOURCE_VERIFICATION,
  custodia_identidad: SkillType.DATA_PROTECTION,
  transferencia_criterio: SkillType.SAFE_DECISION,
};

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no configurada");
  const adapter = new PrismaPg({ connectionString: url, max: 5 });
  const db = new PrismaClient({ adapter });
  try {
    const source = new URL("../shared/scenario-bank.json", import.meta.url);
    const data = JSON.parse(await readFile(fileURLToPath(source), "utf8")) as SourceScenario[];
    if (data.length !== 135 || new Set(data.map((s) => s.id)).size !== data.length) {
      throw new Error("Banco inválido: se esperaban 135 escenarios únicos");
    }
    for (const [index, item] of data.entries()) {
      if (!item.choices.some((choice) => choice.id === item.correctChoiceId)) {
        throw new Error(`No existe respuesta válida para ${item.id}`);
      }
      const familyNum = Number(item.family.split("-").at(-1));
      const difficulty = familyNum <= 5 ? Difficulty.BASIC : familyNum <= 10 ? Difficulty.INTERMEDIATE : Difficulty.ADVANCED;
      const payload = {
        title: item.topic,
        description: item.explanation,
        topic: topicMap[item.goal],
        difficulty,
        conversation: item as unknown as Prisma.InputJsonValue,
        fraudPattern: item.signal,
        isPublished: true,
        version: 1,
      };
      const scenario = await db.scenario.upsert({
        where: { slug: item.id },
        create: { slug: item.id, ...payload },
        update: payload,
      });
      for (const [position, choice] of item.choices.entries()) {
        await db.scenarioOption.upsert({
          where: { scenarioId_code: { scenarioId: scenario.id, code: choice.id } },
          create: {
            scenarioId: scenario.id, code: choice.id, label: choice.label,
            position, isSafe: choice.id === item.correctChoiceId,
            score: choice.id === item.correctChoiceId ? 100 : 0,
            feedback: item.explanation,
            consequence: choice.description ?? null,
          },
          update: {
            label: choice.label, position, isSafe: choice.id === item.correctChoiceId,
            score: choice.id === item.correctChoiceId ? 100 : 0,
            feedback: item.explanation, consequence: choice.description ?? null,
          },
        });
      }
      for (const [position, clue] of item.signals.entries()) {
        const code = `signal_${position + 1}`;
        await db.scenarioClue.upsert({
          where: { scenarioId_code: { scenarioId: scenario.id, code } },
          create: {
            scenarioId: scenario.id, code, position,
            title: clue.label, description: clue.targetPhrase ?? clue.label,
            explanation: clue.detail,
          },
          update: { position, title: clue.label, description: clue.targetPhrase ?? clue.label, explanation: clue.detail },
        });
      }
      const skill = skillMap[item.skill] ?? SkillType.SAFE_DECISION;
      await db.scenarioSkill.upsert({
        where: { scenarioId_skill: { scenarioId: scenario.id, skill } },
        create: { scenarioId: scenario.id, skill, weight: 1 },
        update: { weight: 1 },
      });
      if ((index + 1) % 45 === 0) console.log(`Casos cargados: ${index + 1}/${data.length}`);
    }
    console.log(`Seed completado: ${await db.scenario.count({ where: { isPublished: true } })} escenarios publicados.`);
  } finally {
    await db.$disconnect();
  }
}

seed().catch((error) => { console.error(error); process.exitCode = 1; });
