import type { FastifyInstance } from 'fastify'

const DEMO_ORGANIZATION_ID = 'org-apex'

export async function activityRoutes(app: FastifyInstance) {
  app.get('/activity', async (request) => {
    const query = request.query as {
      limit?: string
      customerId?: string
    }

    const limit = Math.min(
      Math.max(Number(query.limit ?? 50), 1),
      100,
    )

    const events = await app.prisma.activityEvent.findMany({
      where: {
        organizationId: DEMO_ORGANIZATION_ID,

        ...(query.customerId
          ? {
              customerId: query.customerId,
            }
          : {}),
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: limit,

      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },

        customer: {
          select: {
            id: true,
            name: true,
            health: true,
          },
        },

        visit: {
          select: {
            id: true,
            scheduledAt: true,
          },
        },

        voiceRecord: {
          select: {
            id: true,
            status: true,
            durationSeconds: true,
          },
        },

        alert: {
          select: {
            id: true,
            type: true,
            severity: true,
            status: true,
            title: true,
          },
        },
      },
    })

    return {
      data: events,
    }
  })

  app.get<{
    Params: {
      id: string
    }
  }>('/activity/:id', async (request, reply) => {
    const event = await app.prisma.activityEvent.findFirst({
      where: {
        id: request.params.id,
        organizationId: DEMO_ORGANIZATION_ID,
      },

      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },

        customer: true,
        visit: true,
        voiceRecord: true,
        alert: true,
      },
    })

    if (!event) {
      return reply.notFound('Activity event not found')
    }

    return {
      data: event,
    }
  })
}