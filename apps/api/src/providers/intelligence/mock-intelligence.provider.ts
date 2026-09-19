import type { VoiceIntelligence } from '@fieldvoice/types'
import type { IntelligenceProvider } from './intelligence.provider.js'

export class MockIntelligenceProvider implements IntelligenceProvider {
  async analyze(input: {
    transcript: string
    visitId: string
    customerId: string
  }): Promise<Omit<VoiceIntelligence, 'id' | 'processedAt'>> {
    return {
      visitId: input.visitId,
      customerId: input.customerId,

      transcript: input.transcript,

      summary:
        'Sharma Enterprises is facing significant competitive pricing pressure. Nova Consumer is offering approximately 15% lower pricing, creating a potential risk of losing up to 50% of monthly order volume unless a revised commercial proposal is presented.',

      oneLiner:
        'Sharma Enterprises may shift 50% of volume due to a 15% competitor pricing gap.',

      sentiment: 'negative',
      sentimentScore: -0.45,
      sentimentTrend: 'declining',

      aspects: [
        {
          name: 'Pricing',
          sentiment: 'negative',
          score: -0.72,
          evidence: 'Nova Consumer is offering approximately 15% lower pricing.',
        },
        {
          name: 'Competitor',
          sentiment: 'negative',
          score: -0.61,
          evidence: 'Nova Consumer is actively competing on price.',
        },
        {
          name: 'Product Quality',
          sentiment: 'negative',
          score: -0.38,
          evidence: 'Customer raised concerns about product quality consistency.',
        },
      ],

      topics: [
        'Pricing',
        'Competitor',
        'Volume Discount',
        'Product Quality',
      ],

      competitors: ['Nova Consumer'],

      risks: [
        {
          id: 'risk-voice-001-1',
          title: 'Potential volume loss',
          description:
            'Customer may shift close to 50% of monthly order volume to Nova Consumer.',
          severity: 'critical',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'risk-voice-001-2',
          title: 'Competitive pricing pressure',
          description:
            'Nova Consumer has approximately a 15% pricing advantage.',
          severity: 'high',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'risk-voice-001-3',
          title: 'Product quality concern',
          description:
            'Customer has raised concerns about product quality consistency.',
          severity: 'medium',
          createdAt: new Date().toISOString(),
        },
      ],

      opportunities: [
        {
          id: 'opp-voice-001-1',
          title: 'Volume discount proposal',
          description:
            'A revised volume-based commercial proposal could protect the account.',
          value: 2400000,
          probability: 0.72,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'opp-voice-001-2',
          title: 'Account retention intervention',
          description:
            'Proactive commercial and quality response could retain significant volume.',
          value: 4800000,
          probability: 0.65,
          createdAt: new Date().toISOString(),
        },
      ],

      actionItems: [
        {
          id: 'action-voice-001-1',
          title: 'Prepare volume discount proposal',
          description:
            'Prepare a revised commercial proposal addressing the 15% pricing gap.',
          priority: 'critical',
          assignee: 'Ravi Mehta',
          dueDate: '2026-09-19',
          completed: false,
        },
        {
          id: 'action-voice-001-2',
          title: 'Review product quality concerns',
          description:
            'Coordinate with quality team to address consistency concerns.',
          priority: 'high',
          assignee: 'Ananya Sharma',
          dueDate: '2026-09-20',
          completed: false,
        },
        {
          id: 'action-voice-001-3',
          title: 'Schedule customer follow-up',
          description:
            'Follow up with Sharma Enterprises on the revised proposal.',
          priority: 'high',
          assignee: 'Ravi Mehta',
          dueDate: '2026-09-19',
          completed: false,
        },
      ],

      followUpRequired: true,
      suggestedFollowUpDate: '2026-09-19',
      confidence: 0.94,
    }
  }
}