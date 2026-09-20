import type { FastifyInstance } from 'fastify'

const DEMO_ORGANIZATION_ID = 'org-apex'

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
          ? {
              status: query.status as never,
            }
          : {}),

        ...(query.severity
          ? {
              severity: query.severity as never,
            }
          : {}),

        ...(query.customerId
          ? {
              customerId: query.customerId,
            }
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
}