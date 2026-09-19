import type { PrismaClient } from '@prisma/client'

export class CustomerService {
  constructor(private readonly prisma: PrismaClient) {}

  async listCustomers(organizationId: string) {
    return this.prisma.customer.findMany({
      where: {
        organizationId
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        _count: {
          select: {
            visits: true,
            alerts: true,
            intelligence: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
  }

  async getCustomerById(
    organizationId: string,
    customerId: string
  ) {
    return this.prisma.customer.findFirst({
      where: {
        id: customerId,
        organizationId
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        visits: {
          orderBy: {
            scheduledAt: 'desc'
          },
          take: 20,
          include: {
            rep: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        alerts: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 20
        }
      }
    })
  }

  async getCustomerIntelligence(
    organizationId: string,
    customerId: string
  ) {
    return this.prisma.voiceIntelligence.findMany({
      where: {
        organizationId,
        customerId
      },
      orderBy: {
        processedAt: 'desc'
      },
      include: {
        voiceRecord: {
          select: {
            id: true,
            visitId: true,
            durationSeconds: true,
            status: true,
            createdAt: true
          }
        },
        visit: {
          select: {
            id: true,
            scheduledAt: true,
            startedAt: true,
            endedAt: true,
            rep: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
  }
}