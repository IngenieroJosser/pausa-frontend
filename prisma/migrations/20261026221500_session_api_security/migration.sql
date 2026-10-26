-- Extend the existing schema without dropping data.
ALTER TABLE "LearningSession" ADD COLUMN "accessTokenHash" VARCHAR(64);
CREATE UNIQUE INDEX "LearningSession_accessTokenHash_key" ON "LearningSession"("accessTokenHash");

ALTER TABLE "InteractionEvent" ADD COLUMN "requestId" UUID;
CREATE UNIQUE INDEX "InteractionEvent_sessionId_requestId_key" ON "InteractionEvent"("sessionId", "requestId");
