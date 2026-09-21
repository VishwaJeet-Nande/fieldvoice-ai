import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

import { emitActivity } from '../realtime/socket.js'

const DEMO_ORGANIZATION_ID = 'org-apex'

const updateAlertSchema = z.object({
  status: z.enum([
    'OPEN',
    'ACKNOWLEDGED',
    'IN_PROGRESS',
    'RESOLVED',
  ]),
})

export async function alertRoutes(app: FastifyInstance) {
  app.get('/alerts', async (request) => {
    const query = request.query as {
      status?: string
      severity?: string
      customerId?: string
    }

    const alerts = await app.prisma.alert.findMany({
      where: {
        organizationId: DEMO_ORGANIZATION_ID,
        ...(query.status
          ? { status: query.status as never }
          : {}),
        ...(query.severity
          ? { severity: query.severity as never }
          : {}),
        ...(query.customerId
          ? { customerId: query.customerId }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            health: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        sourceVisit: {
          select: {
            id: true,
            scheduledAt: true,
          },
        },
      },
    })

    return {
      data: alerts,
    }
  })

  app.get<{
    Params: {
      id: string
    }
  }>('/alerts/:id', async (request, reply) => {
    const alert = await app.prisma.alert.findFirst({
      where: {
        id: request.params.id,
        organizationId: DEMO_ORGANIZATION_ID,
      },
      include: {
        customer: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        sourceVisit: true,
        sourceVoiceIntelligence: true,
      },
    })

    if (!alert) {
      return reply.notFound('Alert not found')
    }

    return {
      data: alert,
    }
  })

  app.patch<{
    Params: {
      id: string
    }
    Body: {
      status: string
    }
  }>('/alerts/:id', async (request, reply) => {
    const parsed = updateAlertSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.badRequest('Invalid alert status')
    }

    const existing = await app.prisma.alert.findFirst({
      where: {
        id: request.params.id,
        organizationId: DEMO_ORGANIZATION_ID,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!existing) {
      return reply.notFound('Alert not found')
    }

    const nextStatus = parsed.data.status

    if (existing.status === nextStatus) {
      return {
        data: existing,
      }
    }

    const alert = await app.prisma.alert.update({
      where: {
        id: existing.id,
      },
      data: {
        status: nextStatus,
        updatedAt: new Date(),
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            health: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        sourceVisit: {
          select: {
            id: true,
            scheduledAt: true,
          },
        },
      },
    })

    const activityEvent =
      await app.prisma.activityEvent.create({
        data: {
          organizationId: DEMO_ORGANIZATION_ID,
          customerId: existing.customerId,
          alertId: alert.id,
          type: 'ALERT_STATUS_CHANGED',
          title: `${alert.title} status updated`,
          description:
            `${existing.status} → ${nextStatus}`,
          metadata: {
            previousStatus: existing.status,
            newStatus: nextStatus,
            alertType: alert.type,
            severity: alert.severity,
          } satisfies Prisma.InputJsonValue,
        },
      })

    emitActivity({
      id: activityEvent.id,
      type: activityEvent.type,
      title: activityEvent.title,
      description: activityEvent.description,
      customerId: activityEvent.customerId,
      alertId: activityEvent.alertId,
      createdAt:
        activityEvent.createdAt.toISOString(),
    })

    return {
      data: alert,
    }
  })
}