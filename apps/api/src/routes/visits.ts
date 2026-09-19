import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { VisitService } from '../services/visit.service.js'

const DEMO_ORGANIZATION_ID = 'org-apex'

const visitStatusSchema = z.enum([
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
])

const createVisitSchema = z.object({
  customerId: z.string().min(1),
  repId: z.string().min(1),
  status: visitStatusSchema.optional(),
  scheduledAt: z.string().datetime().optional(),
  notes: z.string().optional(),
})

const updateVisitSchema = z.object({
  status: visitStatusSchema.optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
  startedAt: z.string().datetime().nullable().optional(),
  endedAt: z.string().datetime().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export async function visitRoutes(app: FastifyInstance) {
  const visitService = new VisitService(app.prisma)

  app.get('/visits', async () => ({
    data: await visitService.listVisits(DEMO_ORGANIZATION_ID),
  }))

  app.get<{ Params: { id: string } }>(
    '/visits/:id',
    async (request, reply) => {
      const visit = await visitService.getVisitById(
        DEMO_ORGANIZATION_ID,
        request.params.id,
      )

      if (!visit) {
        return reply.notFound('Visit not found')
      }

      return { data: visit }
    },
  )

  app.post('/visits', async (request, reply) => {
    const parsed = createVisitSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid visit payload',
          details: parsed.error.flatten(),
        },
      })
    }

    const visit = await visitService.createVisit(
      DEMO_ORGANIZATION_ID,
      parsed.data,
    )

    return reply.status(201).send({ data: visit })
  })

  app.patch<{ Params: { id: string } }>(
    '/visits/:id',
    async (request, reply) => {
      const parsed = updateVisitSchema.safeParse(request.body)

      if (!parsed.success) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid visit payload',
            details: parsed.error.flatten(),
          },
        })
      }

      const visit = await visitService.updateVisit(
        DEMO_ORGANIZATION_ID,
        request.params.id,
        parsed.data,
      )

      if (!visit) {
        return reply.notFound('Visit not found')
      }

      return { data: visit }
    },
  )
}