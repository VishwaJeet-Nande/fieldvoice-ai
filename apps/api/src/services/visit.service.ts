import type { PrismaClient, VisitStatus } from '@prisma/client'

export interface CreateVisitInput {
  customerId: string
  repId: string
  status?: VisitStatus
  scheduledAt?: string
  notes?: string
}

export interface UpdateVisitInput {
  status?: VisitStatus
  scheduledAt?: string | null
  startedAt?: string | null
  endedAt?: string | null
  notes?: string | null
}

export class VisitService {
  constructor(private readonly prisma: PrismaClient) {}

  async listVisits(organizationId: string) {
    return this.prisma.visit.findMany({
      where: { organizationId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            health: true
          }
        },
        rep: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        _count: {
          select: {
            voiceRecords: true,
            intelligence: true,
            alerts: true
          }
        }
      },
      orderBy: [
        { scheduledAt: 'desc' },
        { createdAt: 'desc' }
      ]
    })
  }

  async getVisitById(organizationId: string, visitId: string) {
    return this.prisma.visit.findFirst({
      where: {
        id: visitId,
        organizationId
      },
      include: {
        customer: true,
        rep: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        voiceRecords: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        intelligence: {
          orderBy: {
            processedAt: 'desc'
          }
        },
        alerts: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        activityEvents: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
  }

  async createVisit(
    organizationId: string,
    input: CreateVisitInput
  ) {
    return this.prisma.visit.create({
      data: {
        organizationId,
        customerId: input.customerId,
        repId: input.repId,
        status: input.status ?? 'PLANNED',
        scheduledAt: input.scheduledAt
          ? new Date(input.scheduledAt)
          : undefined,
        notes: input.notes
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            health: true
          }
        },
        rep: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })
  }

  async updateVisit(
    organizationId: string,
    visitId: string,
    input: UpdateVisitInput
  ) {
    const existingVisit = await this.prisma.visit.findFirst({
      where: {
        id: visitId,
        organizationId
      }
    })

    if (!existingVisit) {
      return null
    }

    return this.prisma.visit.update({
      where: {
        id: visitId
      },
      data: {
        status: input.status,
        scheduledAt:
          input.scheduledAt === undefined
            ? undefined
            : input.scheduledAt === null
              ? null
              : new Date(input.scheduledAt),
        startedAt:
          input.startedAt === undefined
            ? undefined
            : input.startedAt === null
              ? null
              : new Date(input.startedAt),
        endedAt:
          input.endedAt === undefined
            ? undefined
            : input.endedAt === null
              ? null
              : new Date(input.endedAt),
        notes: input.notes
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            health: true
          }
        },
        rep: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })
  }
}