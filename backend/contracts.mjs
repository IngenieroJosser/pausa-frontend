import { z } from "zod";

const requestId = z.string().uuid();

export const createSessionSchema = z.object({
  goal: z.enum(["empleo", "dinero", "datos"]).nullable().optional(),
  friction: z.enum(["urgencia", "autoridad", "oportunidad", "aislamiento"]).nullable().optional(),
}).strict();

export const decisionSchema = z.object({
  requestId,
  scenarioId: z.string().min(1).max(80),
  choiceId: z.string().min(1).max(80),
  elapsedMs: z.number().int().min(0).max(3_600_000).optional(),
}).strict();

export const interactionSchema = z.object({
  requestId,
  scenarioId: z.string().min(1).max(80).optional(),
  eventType: z.enum(["hint_opened", "lesson_viewed", "scenario_started", "feedback_viewed"]),
  payload: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
}).strict();
