export type SentimentLabel = 'positive' | 'neutral' | 'negative'

export type SentimentTrend = 'improving' | 'stable' | 'declining'

export interface SentimentPoint {
  date: string
  score: number
}

export interface IntelligenceAspect {
  name: string
  sentiment: SentimentLabel
  score: number
  evidence?: string
}

export interface Risk {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
}

export interface Opportunity {
  id: string
  title: string
  description: string
  value?: number
  probability?: number
  createdAt: string
}

export interface ActionItem {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: string
  dueDate: string
  completed: boolean
}

export interface VoiceIntelligence {
  id: string
  visitId: string
  customerId: string

  transcript: string
  summary: string
  oneLiner: string

  sentiment: SentimentLabel
  sentimentScore: number
  sentimentTrend: SentimentTrend

  aspects: IntelligenceAspect[]
  topics: string[]
  competitors: string[]

  risks: Risk[]
  opportunities: Opportunity[]
  actionItems: ActionItem[]

  followUpRequired: boolean
  suggestedFollowUpDate?: string

  confidence: number
  processedAt: string
}