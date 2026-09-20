import type {
  AlertSeverity,
  AlertType,
  Prisma,
  PrismaClient,
} from '@prisma/client'

import { emitActivity } from '../realtime/socket.js'

type RiskInput = {
  id: string
  title: string
  description: string
  severity: string
  createdAt: string
}

type OpportunityInput = {
  id: string
  title: string
  description: string
  value?: number
  probability?: number
  createdAt: string
}

type ActionItemInput = {
  id: string
  title: string
  description?: string
  priority: string
  assignee: string
  dueDate: string
  completed: boolean
}

export interface GenerateAlertsInput {
  organizationId: string
  customerId: string
  visitId: string
  voiceIntelligenceId: string
  sentiment: 'positive' | 'neutral' | 'negative'
  sentimentScore: number
  sentimentTrend: 'improving' | 'stable' | 'declining'
  topics: string[]
  competitors: string[]
  risks: RiskInput[]
  opportunities: OpportunityInput[]
  actionItems: ActionItemInput[]
  followUpRequired: boolean
  suggestedFollowUpDate?: Date | null
}

type AlertDefinition = {
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
}

function containsTopic(
  topics: string[],
  value: string,
) {
  return topics.some((topic) =>
    topic.toLowerCase().includes(value.toLowerCase()),
  )
}

export class AlertService {
  constructor(private readonly prisma: PrismaClient) {}

  async generateAlerts(input: GenerateAlertsInput) {
    const definitions: AlertDefinition[] = []

    if (
      input.sentiment === 'negative' &&
      input.sentimentScore <= -0.25
    ) {
      definitions.push({
        type: 'CRITICAL_FEEDBACK',
        severity:
          input.sentimentScore <= -0.5
            ? 'CRITICAL'
            : 'HIGH',
        title: 'Critical Customer Feedback',
        description:
          `Negative customer sentiment detected with a score of ` +
          `${input.sentimentScore.toFixed(2)}.`,
      })
    }

    const pricingTopic =
      containsTopic(input.topics, 'pricing') ||
      containsTopic(input.topics, 'price')

    if (
      input.competitors.length > 0 &&
      pricingTopic &&
      input.sentiment === 'negative'
    ) {
      definitions.push({
        type: 'COMPETITIVE_PRICING',
        severity: 'CRITICAL',
        title: 'Competitive Pricing Pressure',
        description:
          `Customer mentioned ${input.competitors.join(
            ', ',
          )} in a negative pricing context.`,
      })
    }

    if (
      input.sentiment === 'negative' &&
      input.sentimentTrend === 'declining'
    ) {
      definitions.push({
        type: 'CUSTOMER_RISK',
        severity: 'HIGH',
        title: 'Customer Sentiment Declining',
        description:
          `Customer sentiment is negative and trending downward ` +
          `at ${input.sentimentScore.toFixed(2)}.`,
      })
    }

    if (input.opportunities.length > 0) {
      const topOpportunity = input.opportunities[0]

      definitions.push({
        type: 'OPPORTUNITY',
        severity: 'HIGH',
        title: topOpportunity.title,
        description:
          topOpportunity.description ||
          'A commercial opportunity was identified from the field conversation.',
      })
    }

    if (input.followUpRequired) {
      definitions.push({
        type: 'FOLLOW_UP',
        severity: 'HIGH',
        title: 'Customer Follow-up Required',
        description: input.suggestedFollowUpDate
          ? `Follow-up is required by ${input.suggestedFollowUpDate
              .toISOString()
              .slice(0, 10)}.`
          : 'The field conversation requires a customer follow-up.',
      })
    }

    const urgentAction = input.actionItems.find(
      (item) =>
        item.priority.toLowerCase() === 'critical' ||
        item.priority.toLowerCase() === 'high',
    )

    if (
      urgentAction &&
      !definitions.some(
        (definition) =>
          definition.type === 'CUSTOMER_RISK',
      )
    ) {
      definitions.push({
        type: 'CUSTOMER_RISK',
        severity:
          urgentAction.priority.toLowerCase() ===
          'critical'
            ? 'CRITICAL'
            : 'HIGH',
        title: urgentAction.title,
        description:
          urgentAction.description ||
          'A high-priority action was identified from the field conversation.',
      })
    }

    const uniqueDefinitions = Array.from(
      new Map(
        definitions.map((definition) => [
          definition.type,
          definition,
        ]),
      ).values(),
    )

    const customer =
      await this.prisma.customer.findFirst({
        where: {
          id: input.customerId,
          organizationId: input.organizationId,
        },
        select: {
          ownerId: true,
        },
      })

    const createdAlerts = []

    for (const definition of uniqueDefinitions) {
      const existing =
        await this.prisma.alert.findFirst({
          where: {
            organizationId: input.organizationId,
            customerId: input.customerId,
            sourceVoiceIntelligenceId:
              input.voiceIntelligenceId,
            type: definition.type,
          },
        })

      if (existing) {
        createdAlerts.push(existing)
        continue
      }

      const alert = await this.prisma.alert.create({
        data: {
          organizationId: input.organizationId,
          customerId: input.customerId,
          sourceVisitId: input.visitId,
          sourceVoiceIntelligenceId:
            input.voiceIntelligenceId,
          assignedToId: customer?.ownerId ?? null,
          type: definition.type,
          severity: definition.severity,
          status: 'OPEN',
          title: definition.title,
          description: definition.description,
        },
      })

      const activityEvent =
        await this.prisma.activityEvent.create({
          data: {
            organizationId: input.organizationId,
            customerId: input.customerId,
            visitId: input.visitId,
            alertId: alert.id,
            type: 'ALERT_CREATED',
            title: definition.title,
            description: definition.description,
            metadata: {
              alertType: definition.type,
              severity: definition.severity,
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

      createdAlerts.push(alert)
    }

    return createdAlerts
  }
}