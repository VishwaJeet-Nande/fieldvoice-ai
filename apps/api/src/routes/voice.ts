import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { MockIntelligenceProvider } from '../providers/intelligence/mock-intelligence.provider.js'
import { MockSpeechProvider } from '../providers/speech/mock-speech.provider.js'
import {
  VoiceService,
  type CreateVoiceRecordInput,
} from '../services/voice.service.js'

const DEMO_ORGANIZATION_ID = 'org-apex'

const createVoiceSchema = z.object({
  recordedById: z.string().min(1),
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
  storageKey: z.string().optional(),
  durationSeconds: z.number().positive().max(3600).optional(),
})

export async function voiceRoutes(app: FastifyInstance) {
  const voiceService = new VoiceService(
    app.prisma,
    new MockSpeechProvider(),
    new MockIntelligenceProvider(),
  )

  app.post<{
    Params: {
      visitId: string
    }
  }>('/visits/:visitId/voice', async (request, reply) => {
    const parsed = createVoiceSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid voice record payload',
          details: parsed.error.flatten(),
        },
      })
    }

    const voiceRecord = await voiceService.createVoiceRecord(
      DEMO_ORGANIZATION_ID,
      request.params.visitId,
      parsed.data as CreateVoiceRecordInput,
    )

    if (!voiceRecord) {
      return reply.notFound('Visit not found')
    }

    return reply.status(201).send({
      data: voiceRecord,
    })
  })

  app.get<{
    Params: {
      id: string
    }
  }>('/voice/:id', async (request, reply) => {
    const voiceRecord = await voiceService.getVoiceRecord(
      DEMO_ORGANIZATION_ID,
      request.params.id,
    )

    if (!voiceRecord) {
      return reply.notFound('Voice record not found')
    }

    return {
      data: voiceRecord,
    }
  })

  app.post<{
    Params: {
      id: string
    }
  }>('/voice/:id/process', async (request, reply) => {
    const result = await voiceService.processVoiceRecord(
      DEMO_ORGANIZATION_ID,
      request.params.id,
    )

    if (!result) {
      return reply.notFound('Voice record not found')
    }

    return {
      data: result,
    }
  })
}