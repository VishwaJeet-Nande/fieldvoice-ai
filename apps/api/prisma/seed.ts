import {
  PrismaClient,
  AlertSeverity,
  AlertStatus,
  AlertType,
  CustomerHealth,
  SentimentLabel,
  SentimentTrend,
  UserRole,
  VisitStatus,
  VoiceRecordStatus
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding FieldVoice AI database...')

  // ============================================================
  // ORGANIZATION
  // ============================================================

  const organization = await prisma.organization.upsert({
    where: {
      slug: 'apex-consumer-products'
    },
    update: {},
    create: {
      id: 'org-apex',
      name: 'Apex Consumer Products',
      slug: 'apex-consumer-products'
    }
  })

  // ============================================================
  // USERS
  // ============================================================

  const admin = await prisma.user.upsert({
    where: {
      id: 'user-admin'
    },
    update: {},
    create: {
      id: 'user-admin',
      organizationId: organization.id,
      name: 'Vishwajeet Nande',
      email: 'vishwajeet@apexconsumer.com',
      role: UserRole.ADMIN
    }
  })

  const manager = await prisma.user.upsert({
    where: {
      id: 'user-manager'
    },
    update: {},
    create: {
      id: 'user-manager',
      organizationId: organization.id,
      name: 'Ananya Sharma',
      email: 'ananya@apexconsumer.com',
      role: UserRole.MANAGER
    }
  })

  const repRavi = await prisma.user.upsert({
    where: {
      id: 'user-ravi'
    },
    update: {},
    create: {
      id: 'user-ravi',
      organizationId: organization.id,
      name: 'Ravi Mehta',
      email: 'ravi@apexconsumer.com',
      role: UserRole.REP
    }
  })

  const repNeha = await prisma.user.upsert({
    where: {
      id: 'user-neha'
    },
    update: {},
    create: {
      id: 'user-neha',
      organizationId: organization.id,
      name: 'Neha Kulkarni',
      email: 'neha@apexconsumer.com',
      role: UserRole.REP
    }
  })

  // ============================================================
  // CUSTOMERS
  // ============================================================

  const sharma = await prisma.customer.upsert({
    where: {
      id: 'cust-sharma'
    },
    update: {},
    create: {
      id: 'cust-sharma',
      organizationId: organization.id,
      ownerId: repRavi.id,
      name: 'Sharma Enterprises',
      externalCode: 'CUST-001',
      industry: 'FMCG Distribution',
      segment: 'Enterprise',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      health: CustomerHealth.AT_RISK,
      annualValue: 48000000
    }
  })

  const metro = await prisma.customer.upsert({
    where: {
      id: 'cust-metro'
    },
    update: {},
    create: {
      id: 'cust-metro',
      organizationId: organization.id,
      ownerId: repRavi.id,
      name: 'Metro Distributors',
      externalCode: 'CUST-002',
      industry: 'FMCG Distribution',
      segment: 'Enterprise',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      health: CustomerHealth.HEALTHY,
      annualValue: 36000000
    }
  })

  const greenMart = await prisma.customer.upsert({
    where: {
      id: 'cust-greenmart'
    },
    update: {},
    create: {
      id: 'cust-greenmart',
      organizationId: organization.id,
      ownerId: repNeha.id,
      name: 'GreenMart Retail',
      externalCode: 'CUST-003',
      industry: 'Retail',
      segment: 'Strategic',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      health: CustomerHealth.HEALTHY,
      annualValue: 28000000
    }
  })

  const futureMart = await prisma.customer.upsert({
    where: {
      id: 'cust-futuremart'
    },
    update: {},
    create: {
      id: 'cust-futuremart',
      organizationId: organization.id,
      ownerId: repNeha.id,
      name: 'FutureMart Wholesale',
      externalCode: 'CUST-004',
      industry: 'Wholesale',
      segment: 'Enterprise',
      city: 'Nashik',
      state: 'Maharashtra',
      country: 'India',
      health: CustomerHealth.CRITICAL,
      annualValue: 42000000
    }
  })

  // ============================================================
  // VISITS
  // ============================================================

  const sharmaVisit = await prisma.visit.upsert({
    where: {
      id: 'visit-001'
    },
    update: {},
    create: {
      id: 'visit-001',
      organizationId: organization.id,
      customerId: sharma.id,
      repId: repRavi.id,
      status: VisitStatus.COMPLETED,
      scheduledAt: new Date('2026-09-17T09:30:00+05:30'),
      startedAt: new Date('2026-09-17T09:42:00+05:30'),
      endedAt: new Date('2026-09-17T10:18:00+05:30'),
      notes: 'Quarterly commercial review and relationship visit.'
    }
  })

  const metroVisit = await prisma.visit.upsert({
    where: {
      id: 'visit-002'
    },
    update: {},
    create: {
      id: 'visit-002',
      organizationId: organization.id,
      customerId: metro.id,
      repId: repRavi.id,
      status: VisitStatus.COMPLETED,
      scheduledAt: new Date('2026-09-17T11:00:00+05:30'),
      startedAt: new Date('2026-09-17T11:08:00+05:30'),
      endedAt: new Date('2026-09-17T11:41:00+05:30'),
      notes: 'Delivery and inventory review.'
    }
  })

  const greenMartVisit = await prisma.visit.upsert({
    where: {
      id: 'visit-003'
    },
    update: {},
    create: {
      id: 'visit-003',
      organizationId: organization.id,
      customerId: greenMart.id,
      repId: repNeha.id,
      status: VisitStatus.COMPLETED,
      scheduledAt: new Date('2026-09-17T14:00:00+05:30'),
      startedAt: new Date('2026-09-17T14:12:00+05:30'),
      endedAt: new Date('2026-09-17T14:46:00+05:30'),
      notes: 'Premium range and shelf-space discussion.'
    }
  })

  const futureMartVisit = await prisma.visit.upsert({
    where: {
      id: 'visit-004'
    },
    update: {},
    create: {
      id: 'visit-004',
      organizationId: organization.id,
      customerId: futureMart.id,
      repId: repNeha.id,
      status: VisitStatus.COMPLETED,
      scheduledAt: new Date('2026-09-17T16:00:00+05:30'),
      startedAt: new Date('2026-09-17T16:07:00+05:30'),
      endedAt: new Date('2026-09-17T16:39:00+05:30'),
      notes: 'Commercial and service review.'
    }
  })

  // ============================================================
  // VOICE RECORD — GOLDEN SCENARIO
  // ============================================================

  const sharmaVoice = await prisma.voiceRecord.upsert({
    where: {
      id: 'record-001'
    },
    update: {},
    create: {
      id: 'record-001',
      organizationId: organization.id,
      visitId: sharmaVisit.id,
      customerId: sharma.id,
      recordedById: repRavi.id,
      status: VoiceRecordStatus.COMPLETED,
      fileName: 'sharma-enterprises-visit-001.m4a',
      mimeType: 'audio/mp4',
      durationSeconds: 31,
      transcript:
        'Rajesh mentioned that Nova Consumer is offering approximately 15% lower pricing. Sharma Enterprises could move close to half of its monthly order volume if the pricing gap is not addressed. They want a volume discount proposal within the next two weeks. They also raised concerns about product quality consistency.',
      createdAt: new Date('2026-09-17T10:20:00+05:30'),
      updatedAt: new Date('2026-09-17T10:24:00+05:30')
    }
  })

  // ============================================================
  // AI INTELLIGENCE — GOLDEN SCENARIO
  // ============================================================

  const sharmaIntelligence = await prisma.voiceIntelligence.upsert({
    where: {
      voiceRecordId: sharmaVoice.id
    },
    update: {},
    create: {
      id: 'voice-001',
      organizationId: organization.id,
      voiceRecordId: sharmaVoice.id,
      visitId: sharmaVisit.id,
      customerId: sharma.id,

      transcript: sharmaVoice.transcript!,

      summary:
        'Sharma Enterprises is facing significant competitive pricing pressure from Nova Consumer, with a potential shift of up to 50% of monthly order volume unless a revised commercial proposal is provided. The customer also raised product quality consistency concerns.',

      oneLiner:
        'Sharma Enterprises may shift 50% of volume due to a 15% competitor pricing gap.',

      sentiment: SentimentLabel.NEGATIVE,
      sentimentScore: -0.45,
      sentimentTrend: SentimentTrend.DECLINING,

      aspects: [
        {
          name: 'Pricing',
          sentiment: 'negative',
          score: -0.72,
          evidence: 'Competitor pricing is approximately 15% lower.'
        },
        {
          name: 'Competitor',
          sentiment: 'negative',
          score: -0.61,
          evidence: 'Nova Consumer is actively pressuring the account.'
        },
        {
          name: 'Volume Discount',
          sentiment: 'neutral',
          score: 0.02,
          evidence: 'Customer requested a volume discount proposal.'
        },
        {
          name: 'Product Quality',
          sentiment: 'negative',
          score: -0.48,
          evidence: 'Customer raised consistency concerns.'
        }
      ],

      topics: [
        'Pricing',
        'Competitor',
        'Volume Discount',
        'Product Quality'
      ],

      competitors: [
        'Nova Consumer'
      ],

      risks: [
        {
          id: 'risk-001',
          title: 'Potential volume loss',
          description:
            'Customer could shift close to 50% of monthly order volume.',
          severity: 'critical'
        },
        {
          id: 'risk-002',
          title: 'Competitive pricing pressure',
          description:
            'Nova Consumer is currently offering approximately 15% lower pricing.',
          severity: 'high'
        },
        {
          id: 'risk-003',
          title: 'Product quality concern',
          description:
            'Customer reported concerns about product quality consistency.',
          severity: 'medium'
        }
      ],

      opportunities: [
        {
          id: 'opp-001',
          title: 'Volume discount proposal',
          description:
            'Prepare a commercial proposal tied to increased order volume.',
          value: 12000000,
          probability: 0.68
        },
        {
          id: 'opp-002',
          title: 'Account retention',
          description:
            'Resolve pricing and quality concerns before competitor conversion.',
          value: 24000000,
          probability: 0.54
        }
      ],

      actionItems: [
        {
          id: 'action-001',
          title: 'Prepare volume discount proposal',
          description:
            'Create a revised commercial proposal addressing the 15% pricing gap.',
          priority: 'critical',
          assignee: manager.name,
          dueDate: '2026-10-01',
          completed: false
        },
        {
          id: 'action-002',
          title: 'Review product quality consistency',
          description:
            'Coordinate with quality team and provide corrective-action update.',
          priority: 'high',
          assignee: 'Quality Team',
          dueDate: '2026-09-24',
          completed: false
        },
        {
          id: 'action-003',
          title: 'Schedule commercial follow-up',
          description:
            'Follow up with Sharma Enterprises on the revised proposal.',
          priority: 'high',
          assignee: repRavi.name,
          dueDate: '2026-09-30',
          completed: false
        }
      ],

      followUpRequired: true,
      suggestedFollowUpDate: new Date('2026-10-01T10:00:00+05:30'),
      confidence: 0.94,
      processedAt: new Date('2026-09-17T10:24:00+05:30')
    }
  })

  // ============================================================
  // SECOND VOICE RECORD
  // ============================================================

  const metroVoice = await prisma.voiceRecord.upsert({
    where: {
      id: 'record-002'
    },
    update: {},
    create: {
      id: 'record-002',
      organizationId: organization.id,
      visitId: metroVisit.id,
      customerId: metro.id,
      recordedById: repRavi.id,
      status: VoiceRecordStatus.COMPLETED,
      fileName: 'metro-distributors-visit-002.m4a',
      mimeType: 'audio/mp4',
      durationSeconds: 28,
      transcript:
        'Metro Distributors said delivery performance has improved. They want better inventory visibility and are interested in the upcoming promotion program.',
      createdAt: new Date('2026-09-17T11:45:00+05:30')
    }
  })

  await prisma.voiceIntelligence.upsert({
    where: {
      voiceRecordId: metroVoice.id
    },
    update: {},
    create: {
      id: 'voice-002',
      organizationId: organization.id,
      voiceRecordId: metroVoice.id,
      visitId: metroVisit.id,
      customerId: metro.id,

      transcript: metroVoice.transcript!,

      summary:
        'Metro Distributors reported improving delivery performance and requested better inventory visibility.',

      oneLiner:
        'Metro Distributors is stable with interest in inventory visibility and promotions.',

      sentiment: SentimentLabel.NEUTRAL,
      sentimentScore: 0.12,
      sentimentTrend: SentimentTrend.STABLE,

      aspects: [
        {
          name: 'Delivery',
          sentiment: 'positive',
          score: 0.34
        },
        {
          name: 'Inventory',
          sentiment: 'neutral',
          score: 0.05
        },
        {
          name: 'Promotions',
          sentiment: 'positive',
          score: 0.27
        }
      ],

      topics: [
        'Delivery',
        'Inventory',
        'Promotions'
      ],

      competitors: [],

      risks: [],

      opportunities: [
        {
          id: 'opp-003',
          title: 'Promotion program',
          description:
            'Customer is interested in participating in the upcoming promotion program.',
          value: 6000000,
          probability: 0.72
        }
      ],

      actionItems: [
        {
          id: 'action-004',
          title: 'Share inventory visibility roadmap',
          priority: 'medium',
          assignee: repRavi.name,
          dueDate: '2026-09-22',
          completed: false
        }
      ],

      followUpRequired: true,
      suggestedFollowUpDate: new Date('2026-09-22T10:00:00+05:30'),
      confidence: 0.91,
      processedAt: new Date('2026-09-17T11:48:00+05:30')
    }
  })

  // ============================================================
  // ALERTS
  // ============================================================

  await prisma.alert.upsert({
    where: {
      id: 'alert-001'
    },
    update: {},
    create: {
      id: 'alert-001',
      organizationId: organization.id,
      customerId: sharma.id,
      sourceVisitId: sharmaVisit.id,
      sourceVoiceIntelligenceId: sharmaIntelligence.id,
      assignedToId: manager.id,

      type: AlertType.COMPETITIVE_PRICING,
      severity: AlertSeverity.CRITICAL,
      status: AlertStatus.OPEN,

      title: 'Competitive pricing pressure detected',
      description:
        'Nova Consumer is offering approximately 15% lower pricing. Sharma Enterprises may shift close to 50% of monthly order volume.'
    }
  })

  await prisma.alert.upsert({
    where: {
      id: 'alert-002'
    },
    update: {},
    create: {
      id: 'alert-002',
      organizationId: organization.id,
      customerId: sharma.id,
      sourceVisitId: sharmaVisit.id,
      sourceVoiceIntelligenceId: sharmaIntelligence.id,
      assignedToId: manager.id,

      type: AlertType.CUSTOMER_RISK,
      severity: AlertSeverity.HIGH,
      status: AlertStatus.OPEN,

      title: 'Customer risk requires follow-up',
      description:
        'Customer sentiment is declining and product quality consistency concerns were raised during the latest visit.'
    }
  })

  // ============================================================
  // ACTIVITY EVENTS
  // ============================================================

  await prisma.activityEvent.upsert({
    where: {
      id: 'activity-001'
    },
    update: {},
    create: {
      id: 'activity-001',
      organizationId: organization.id,
      actorId: repRavi.id,
      customerId: sharma.id,
      visitId: sharmaVisit.id,
      voiceRecordId: sharmaVoice.id,

      type: 'voice.completed',
      title: 'Voice intelligence completed',
      description:
        'Sharma Enterprises visit voice note was transcribed and analyzed.',
      metadata: {
        sentiment: -0.45,
        confidence: 0.94
      }
    }
  })

  await prisma.activityEvent.upsert({
    where: {
      id: 'activity-002'
    },
    update: {},
    create: {
      id: 'activity-002',
      organizationId: organization.id,
      actorId: manager.id,
      customerId: sharma.id,
      alertId: 'alert-001',

      type: 'alert.created',
      title: 'Critical pricing alert created',
      description:
        'Competitive pricing pressure was detected for Sharma Enterprises.',
      metadata: {
        competitor: 'Nova Consumer',
        pricingGap: 0.15
      }
    }
  })

  await prisma.activityEvent.upsert({
    where: {
      id: 'activity-003'
    },
    update: {},
    create: {
      id: 'activity-003',
      organizationId: organization.id,
      actorId: repRavi.id,
      customerId: metro.id,
      visitId: metroVisit.id,

      type: 'visit.completed',
      title: 'Customer visit completed',
      description:
        'Metro Distributors visit completed successfully.'
    }
  })

  console.log('')
  console.log('✅ FieldVoice AI seed completed')
  console.log('')
  console.log(`Organization: ${organization.name}`)
  console.log(`Customers: 4`)
  console.log(`Visits: 4`)
  console.log(`Voice intelligence: 2`)
  console.log(`Alerts: 2`)
  console.log(`Activity events: 3`)
  console.log('')
  console.log('🎯 Golden scenario: Sharma Enterprises')
  console.log('   Competitor: Nova Consumer')
  console.log('   Pricing gap: 15%')
  console.log('   Potential volume shift: 50%')
  console.log('   Sentiment: -0.45')
  console.log('')
}

main()
  .catch((error) => {
    console.error('❌ Seed failed')
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })