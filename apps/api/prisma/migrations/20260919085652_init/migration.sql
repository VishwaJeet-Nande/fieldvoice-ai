-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EXECUTIVE', 'MANAGER', 'REP');

-- CreateEnum
CREATE TYPE "CustomerHealth" AS ENUM ('HEALTHY', 'WATCH', 'AT_RISK', 'CRITICAL');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VoiceRecordStatus" AS ENUM ('UPLOADED', 'TRANSCRIBING', 'ANALYZING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "SentimentLabel" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- CreateEnum
CREATE TYPE "SentimentTrend" AS ENUM ('IMPROVING', 'STABLE', 'DECLINING');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('CRITICAL_FEEDBACK', 'COMPETITIVE_PRICING', 'SENTIMENT_CHANGE', 'OPPORTUNITY', 'FOLLOW_UP', 'CUSTOMER_RISK');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'REP',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ownerId" TEXT,
    "name" TEXT NOT NULL,
    "externalCode" TEXT,
    "industry" TEXT,
    "segment" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'India',
    "health" "CustomerHealth" NOT NULL DEFAULT 'HEALTHY',
    "annualValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "repId" TEXT NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'PLANNED',
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceRecord" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "status" "VoiceRecordStatus" NOT NULL DEFAULT 'UPLOADED',
    "storageKey" TEXT,
    "fileName" TEXT,
    "mimeType" TEXT,
    "durationSeconds" INTEGER,
    "transcript" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceIntelligence" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "voiceRecordId" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "oneLiner" TEXT NOT NULL,
    "sentiment" "SentimentLabel" NOT NULL,
    "sentimentScore" DOUBLE PRECISION NOT NULL,
    "sentimentTrend" "SentimentTrend" NOT NULL,
    "aspects" JSONB NOT NULL,
    "topics" TEXT[],
    "competitors" TEXT[],
    "risks" JSONB NOT NULL,
    "opportunities" JSONB NOT NULL,
    "actionItems" JSONB NOT NULL,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "suggestedFollowUpDate" TIMESTAMP(3),
    "confidence" DOUBLE PRECISION NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceIntelligence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "sourceVisitId" TEXT,
    "sourceVoiceIntelligenceId" TEXT,
    "assignedToId" TEXT,
    "type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'OPEN',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "actorId" TEXT,
    "customerId" TEXT,
    "visitId" TEXT,
    "voiceRecordId" TEXT,
    "alertId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_slug_idx" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "User_organizationId_role_idx" ON "User"("organizationId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "User_organizationId_email_key" ON "User"("organizationId", "email");

-- CreateIndex
CREATE INDEX "Customer_organizationId_idx" ON "Customer"("organizationId");

-- CreateIndex
CREATE INDEX "Customer_organizationId_health_idx" ON "Customer"("organizationId", "health");

-- CreateIndex
CREATE INDEX "Customer_ownerId_idx" ON "Customer"("ownerId");

-- CreateIndex
CREATE INDEX "Customer_name_idx" ON "Customer"("name");

-- CreateIndex
CREATE INDEX "Visit_organizationId_idx" ON "Visit"("organizationId");

-- CreateIndex
CREATE INDEX "Visit_customerId_idx" ON "Visit"("customerId");

-- CreateIndex
CREATE INDEX "Visit_repId_idx" ON "Visit"("repId");

-- CreateIndex
CREATE INDEX "Visit_status_idx" ON "Visit"("status");

-- CreateIndex
CREATE INDEX "Visit_scheduledAt_idx" ON "Visit"("scheduledAt");

-- CreateIndex
CREATE INDEX "VoiceRecord_organizationId_idx" ON "VoiceRecord"("organizationId");

-- CreateIndex
CREATE INDEX "VoiceRecord_visitId_idx" ON "VoiceRecord"("visitId");

-- CreateIndex
CREATE INDEX "VoiceRecord_customerId_idx" ON "VoiceRecord"("customerId");

-- CreateIndex
CREATE INDEX "VoiceRecord_recordedById_idx" ON "VoiceRecord"("recordedById");

-- CreateIndex
CREATE INDEX "VoiceRecord_status_idx" ON "VoiceRecord"("status");

-- CreateIndex
CREATE INDEX "VoiceRecord_createdAt_idx" ON "VoiceRecord"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceIntelligence_voiceRecordId_key" ON "VoiceIntelligence"("voiceRecordId");

-- CreateIndex
CREATE INDEX "VoiceIntelligence_organizationId_idx" ON "VoiceIntelligence"("organizationId");

-- CreateIndex
CREATE INDEX "VoiceIntelligence_visitId_idx" ON "VoiceIntelligence"("visitId");

-- CreateIndex
CREATE INDEX "VoiceIntelligence_customerId_idx" ON "VoiceIntelligence"("customerId");

-- CreateIndex
CREATE INDEX "VoiceIntelligence_sentiment_idx" ON "VoiceIntelligence"("sentiment");

-- CreateIndex
CREATE INDEX "VoiceIntelligence_processedAt_idx" ON "VoiceIntelligence"("processedAt");

-- CreateIndex
CREATE INDEX "Alert_organizationId_idx" ON "Alert"("organizationId");

-- CreateIndex
CREATE INDEX "Alert_customerId_idx" ON "Alert"("customerId");

-- CreateIndex
CREATE INDEX "Alert_severity_idx" ON "Alert"("severity");

-- CreateIndex
CREATE INDEX "Alert_status_idx" ON "Alert"("status");

-- CreateIndex
CREATE INDEX "Alert_type_idx" ON "Alert"("type");

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

-- CreateIndex
CREATE INDEX "Alert_assignedToId_idx" ON "Alert"("assignedToId");

-- CreateIndex
CREATE INDEX "ActivityEvent_organizationId_idx" ON "ActivityEvent"("organizationId");

-- CreateIndex
CREATE INDEX "ActivityEvent_createdAt_idx" ON "ActivityEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_customerId_idx" ON "ActivityEvent"("customerId");

-- CreateIndex
CREATE INDEX "ActivityEvent_visitId_idx" ON "ActivityEvent"("visitId");

-- CreateIndex
CREATE INDEX "ActivityEvent_voiceRecordId_idx" ON "ActivityEvent"("voiceRecordId");

-- CreateIndex
CREATE INDEX "ActivityEvent_alertId_idx" ON "ActivityEvent"("alertId");

-- CreateIndex
CREATE INDEX "ActivityEvent_actorId_idx" ON "ActivityEvent"("actorId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_repId_fkey" FOREIGN KEY ("repId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceRecord" ADD CONSTRAINT "VoiceRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceRecord" ADD CONSTRAINT "VoiceRecord_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceRecord" ADD CONSTRAINT "VoiceRecord_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceRecord" ADD CONSTRAINT "VoiceRecord_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceIntelligence" ADD CONSTRAINT "VoiceIntelligence_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceIntelligence" ADD CONSTRAINT "VoiceIntelligence_voiceRecordId_fkey" FOREIGN KEY ("voiceRecordId") REFERENCES "VoiceRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceIntelligence" ADD CONSTRAINT "VoiceIntelligence_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceIntelligence" ADD CONSTRAINT "VoiceIntelligence_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_sourceVisitId_fkey" FOREIGN KEY ("sourceVisitId") REFERENCES "Visit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_sourceVoiceIntelligenceId_fkey" FOREIGN KEY ("sourceVoiceIntelligenceId") REFERENCES "VoiceIntelligence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_voiceRecordId_fkey" FOREIGN KEY ("voiceRecordId") REFERENCES "VoiceRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE SET NULL ON UPDATE CASCADE;
