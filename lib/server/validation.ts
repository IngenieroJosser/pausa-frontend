import { z } from "zod";

const uuid = z.uuid();
export const sessionIdSchema = uuid;
export const createSessionSchema = z.strictObject({
  goal: z.enum(["empleo", "dinero", "datos"]),
  friction: z.enum(["urgencia", "autoridad", "oportunidad", "aislamiento"]).optional(),
  habit: z.enum(["impulso", "verifico", "consulto", "evito"]).optional(),
  confidence: z.enum(["baja", "media", "alta"]).optional(),
  context: z.enum(["laboral", "bancario", "redes"]).optional(),
  // Los resultados iniciales no definen respuestas correctas del backend.
  calibration: z.array(z.strictObject({ scenarioId: z.string().min(2).max(80), flagged: z.boolean() })).max(5).optional(),
});
export const decisionSchema = z.strictObject({
  requestId: uuid,
  scenarioId: z.string().min(2).max(80),
  choiceId: z.string().min(1).max(80),
  elapsedMs: z.number().int().min(0).max(3_600_000).optional(),
});
export const interactionSchema = z.strictObject({
  requestId: uuid,
  scenarioId: z.string().min(2).max(80).optional(),
  eventType: z.enum(["hint_opened", "lesson_viewed", "scenario_started", "feedback_viewed"]),
  payload: z.record(z.string().max(60), z.union([z.string().max(300), z.number(), z.boolean(), z.null()])).optional(),
});
export const completeSchema = z.strictObject({});
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SubmitDecisionInput = z.infer<typeof decisionSchema>;
export type InteractionInput = z.infer<typeof interactionSchema>;
