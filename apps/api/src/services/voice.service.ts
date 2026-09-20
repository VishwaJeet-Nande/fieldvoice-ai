import type {
  Prisma,
  PrismaClient,
  VoiceRecordStatus,
} from '@prisma/client'

import type { IntelligenceProvider } from '../providers/intelligence/intelligence.provider.js'
import type { SpeechProvider } from '../providers/speech/speech.provider.js'
import { AlertService } from './alert.service.js'

export interface CreateVoiceRecordInput {
  recordedById: string
  fileName?: string
  mimeType?: string
  storageKey?: string
  durationSeconds?: number
}

function toJsonInput(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

export class VoiceService {
  private readonly alertService: AlertService

  constructor(
    private readonly prisma: PrismaClient,
    private readonly speechProvider: SpeechProvider,
    private readonly intelligenceProvider: IntelligenceProvider,
  ) {
    this.alertService = new AlertService(prisma)
  }

  async createVoiceRecord(
    organizationId: string,
    visitId: string,
    input: CreateVoiceRecordInput,
  ) {
    const visit = await this.prisma.visit.findFirst({
      where: {
        id: visitId,
        organizationId,
      },
      select: {
        id: true,
        customerId: true,
        repId: true,
      },
    })

    if (!visit) {
      return null
    }

    return this.prisma.voiceRecord.create({
      data: {
        organizationId,
        visitId: visit.id,
        customerId: visit.customerId,
        recordedById: input.recordedById,
        status: 'UPLOADED',
        fileName: input.fileName ?? 'field-voice-note.webm',
        mimeType: input.mimeType ?? 'audio/webm',
        storageKey:
          input.storageKey ?? `demo/${visit.id}/voice-note.webm`,
        durationSeconds: input.durationSeconds ?? 30,
      },
    })
  }

  async getVoiceRecord(
    organizationId: string,
    voiceRecordId: string,
  ) {
    return this.prisma.voiceRecord.findFirst({
      where: {
        id: voiceRecordId,
        organizationId,
      },
      include: {
        visit: {
          include: {
            customer: true,
            rep: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        intelligence: true,
      },
    })
  }

  async processVoiceRecord(
    organizationId: string,
    voiceRecordId: string,
  ) {
    const voiceRecord = await this.prisma.voiceRecord.findFirst({
      where: {
        id: voiceRecordId,
        organizationId,
      },
      include: {
        visit: {
          select: {
            id: true,
            customerId: true,
          },
        },
      },
    })

    if (!voiceRecord) {
      return null
    }

    try {
      await this.updateStatus(
        organizationId,
        voiceRecordId,
        'TRANSCRIBING',
      )

      const transcription = await this.speechProvider.transcribe({
        voiceRecordId: voiceRecord.id,
        storageKey: voiceRecord.storageKey,
      })

      await this.prisma.voiceRecord.update({
        where: {
          id: voiceRecord.id,
        },
        data: {
          transcript: transcription.transcript,
          status: 'ANALYZING',
        },
      })

      const intelligence = await this.intelligenceProvider.analyze({
        transcript: transcription.transcript,
        visitId: voiceRecord.visit.id,
        customerId: voiceRecord.visit.customerId,
      })

      const intelligenceData = {
        transcript: intelligence.transcript,
        summary: intelligence.summary,
        oneLiner: intelligence.oneLiner,

        sentiment: intelligence.sentiment.toUpperCase() as
          | 'POSITIVE'
          | 'NEUTRAL'
          | 'NEGATIVE',

        sentimentScore: intelligence.sentimentScore,

        sentimentTrend: intelligence.sentimentTrend.toUpperCase() as
          | 'IMPROVING'
          | 'STABLE'
          | 'DECLINING',

        aspects: toJsonInput(intelligence.aspects),

        topics: intelligence.topics,

        competitors: intelligence.competitors,

        risks: toJsonInput(intelligence.risks),

        opportunities: toJsonInput(
          intelligence.opportunities,
        ),

        actionItems: toJsonInput(
          intelligence.actionItems,
        ),

        followUpRequired: intelligence.followUpRequired,

        suggestedFollowUpDate:
          intelligence.suggestedFollowUpDate
            ? new Date(
                intelligence.suggestedFollowUpDate,
              )
            : null,

        confidence: intelligence.confidence,

        processedAt: new Date(),
      }

      const savedIntelligence =
        await this.prisma.voiceIntelligence.upsert({
          where: {
            voiceRecordId: voiceRecord.id,
          },

          create: {
            organizationId,
            voiceRecordId: voiceRecord.id,
            visitId: voiceRecord.visit.id,
            customerId: voiceRecord.visit.customerId,
            ...intelligenceData,
          },

          update: intelligenceData,
        })

      const generatedAlerts =
        await this.alertService.generateAlerts({
          organizationId,
          customerId: voiceRecord.visit.customerId,
          visitId: voiceRecord.visit.id,
          voiceIntelligenceId: savedIntelligence.id,

          sentiment: intelligence.sentiment,
          sentimentScore: intelligence.sentimentScore,
          sentimentTrend: intelligence.sentimentTrend,

          topics: intelligence.topics,
          competitors: intelligence.competitors,

          risks: intelligence.risks,
          opportunities: intelligence.opportunities,
          actionItems: intelligence.actionItems,

          followUpRequired: intelligence.followUpRequired,

          suggestedFollowUpDate:
            intelligence.suggestedFollowUpDate
              ? new Date(
                  intelligence.suggestedFollowUpDate,
                )
              : null,
        })

      await this.updateStatus(
        organizationId,
        voiceRecordId,
        'COMPLETED',
      )

      return {
        voiceRecord: await this.getVoiceRecord(
          organizationId,
          voiceRecordId,
        ),
        intelligence: savedIntelligence,
        alerts: generatedAlerts,
      }
    } catch (error) {
      await this.updateStatus(
        organizationId,
        voiceRecordId,
        'FAILED',
      )

      throw error
    }
  }

  private async updateStatus(
    organizationId: string,
    voiceRecordId: string,
    status: VoiceRecordStatus,
  ) {
    const result = await this.prisma.voiceRecord.updateMany({
      where: {
        id: voiceRecordId,
        organizationId,
      },
      data: {
        status,
      },
    })

    if (result.count === 0) {
      throw new Error('Voice record not found')
    }
  }
}