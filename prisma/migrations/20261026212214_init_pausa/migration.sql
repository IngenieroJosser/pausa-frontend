-- CreateEnum
CREATE TYPE "Topic" AS ENUM ('EMPLOYMENT', 'MONEY', 'IDENTITY');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "LearningPhase" AS ENUM ('CALIBRATION', 'PRACTICE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('PENDING', 'PRESENTED', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "InspectionStage" AS ENUM ('BEFORE_DECISION', 'AFTER_DECISION');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('SOURCE_VERIFICATION', 'URGENCY_RECOGNITION', 'DATA_PROTECTION', 'FINANCIAL_RISK', 'REPORTING', 'SAFE_DECISION');

-- CreateTable
CREATE TABLE "Scenario" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "topic" "Topic" NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'BASIC',
    "conversation" JSONB NOT NULL,
    "fraudPattern" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioOption" (
    "id" UUID NOT NULL,
    "scenarioId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isSafe" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "feedback" TEXT NOT NULL,
    "consequence" TEXT,

    CONSTRAINT "ScenarioOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioClue" (
    "id" UUID NOT NULL,
    "scenarioId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ScenarioClue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioSkill" (
    "scenarioId" UUID NOT NULL,
    "skill" "SkillType" NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ScenarioSkill_pkey" PRIMARY KEY ("scenarioId","skill")
);

-- CreateTable
CREATE TABLE "LearningSession" (
    "id" UUID NOT NULL,
    "resumeToken" UUID NOT NULL,
    "topic" "Topic" NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPhase" "LearningPhase" NOT NULL DEFAULT 'CALIBRATION',
    "currentPosition" INTEGER NOT NULL DEFAULT 0,
    "calibrationData" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionScenario" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "scenarioId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "phase" "LearningPhase" NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'PENDING',
    "countsTowardScore" BOOLEAN NOT NULL DEFAULT true,
    "selectionReason" TEXT,
    "adaptationData" JSONB,
    "presentedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "SessionScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "sessionScenarioId" UUID NOT NULL,
    "optionId" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "isSafe" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "feedbackSnapshot" JSONB,
    "responseTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClueInspection" (
    "id" UUID NOT NULL,
    "sessionScenarioId" UUID NOT NULL,
    "clueId" UUID NOT NULL,
    "stage" "InspectionStage" NOT NULL,
    "inspectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClueInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteractionEvent" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "sessionScenarioId" UUID,
    "type" VARCHAR(64) NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InteractionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillAssessment" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "skill" "SkillType" NOT NULL,
    "phase" "LearningPhase" NOT NULL,
    "totalDecisions" INTEGER NOT NULL DEFAULT 0,
    "correctDecisions" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionOutcome" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "totalCases" INTEGER NOT NULL DEFAULT 0,
    "totalDecisions" INTEGER NOT NULL DEFAULT 0,
    "safeDecisions" INTEGER NOT NULL DEFAULT 0,
    "finalScore" INTEGER NOT NULL DEFAULT 0,
    "reachedTransfer" BOOLEAN NOT NULL DEFAULT false,
    "strengths" JSONB,
    "improvementAreas" JSONB,
    "recommendations" JSONB,
    "summary" JSONB,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_slug_key" ON "Scenario"("slug");

-- CreateIndex
CREATE INDEX "Scenario_topic_difficulty_isPublished_idx" ON "Scenario"("topic", "difficulty", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioOption_scenarioId_code_key" ON "ScenarioOption"("scenarioId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioOption_scenarioId_position_key" ON "ScenarioOption"("scenarioId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioClue_scenarioId_code_key" ON "ScenarioClue"("scenarioId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioClue_scenarioId_position_key" ON "ScenarioClue"("scenarioId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "LearningSession_resumeToken_key" ON "LearningSession"("resumeToken");

-- CreateIndex
CREATE INDEX "LearningSession_topic_startedAt_idx" ON "LearningSession"("topic", "startedAt");

-- CreateIndex
CREATE INDEX "LearningSession_status_updatedAt_idx" ON "LearningSession"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "SessionScenario_scenarioId_idx" ON "SessionScenario"("scenarioId");

-- CreateIndex
CREATE INDEX "SessionScenario_sessionId_status_idx" ON "SessionScenario"("sessionId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "SessionScenario_sessionId_position_key" ON "SessionScenario"("sessionId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Decision_sessionScenarioId_key" ON "Decision"("sessionScenarioId");

-- CreateIndex
CREATE INDEX "Decision_optionId_idx" ON "Decision"("optionId");

-- CreateIndex
CREATE INDEX "Decision_sessionId_createdAt_idx" ON "Decision"("sessionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Decision_sessionId_requestId_key" ON "Decision"("sessionId", "requestId");

-- CreateIndex
CREATE INDEX "ClueInspection_clueId_idx" ON "ClueInspection"("clueId");

-- CreateIndex
CREATE UNIQUE INDEX "ClueInspection_sessionScenarioId_clueId_stage_key" ON "ClueInspection"("sessionScenarioId", "clueId", "stage");

-- CreateIndex
CREATE INDEX "InteractionEvent_sessionId_createdAt_idx" ON "InteractionEvent"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "InteractionEvent_type_createdAt_idx" ON "InteractionEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "SkillAssessment_skill_score_idx" ON "SkillAssessment"("skill", "score");

-- CreateIndex
CREATE UNIQUE INDEX "SkillAssessment_sessionId_skill_phase_key" ON "SkillAssessment"("sessionId", "skill", "phase");

-- CreateIndex
CREATE UNIQUE INDEX "SessionOutcome_sessionId_key" ON "SessionOutcome"("sessionId");

-- AddForeignKey
ALTER TABLE "ScenarioOption" ADD CONSTRAINT "ScenarioOption_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioClue" ADD CONSTRAINT "ScenarioClue_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioSkill" ADD CONSTRAINT "ScenarioSkill_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionScenario" ADD CONSTRAINT "SessionScenario_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LearningSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionScenario" ADD CONSTRAINT "SessionScenario_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LearningSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_sessionScenarioId_fkey" FOREIGN KEY ("sessionScenarioId") REFERENCES "SessionScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "ScenarioOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClueInspection" ADD CONSTRAINT "ClueInspection_sessionScenarioId_fkey" FOREIGN KEY ("sessionScenarioId") REFERENCES "SessionScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClueInspection" ADD CONSTRAINT "ClueInspection_clueId_fkey" FOREIGN KEY ("clueId") REFERENCES "ScenarioClue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionEvent" ADD CONSTRAINT "InteractionEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LearningSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionEvent" ADD CONSTRAINT "InteractionEvent_sessionScenarioId_fkey" FOREIGN KEY ("sessionScenarioId") REFERENCES "SessionScenario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillAssessment" ADD CONSTRAINT "SkillAssessment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LearningSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionOutcome" ADD CONSTRAINT "SessionOutcome_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LearningSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
