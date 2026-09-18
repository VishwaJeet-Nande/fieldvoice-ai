export type VisitStatus =
  | 'scheduled'
  | 'in-progress'
  | 'completed'
  | 'cancelled'

export interface Visit {
  id: string
  customerId: string
  customerName: string
  repId: string
  repName: string

  status: VisitStatus
  scheduledAt: string
  startedAt?: string
  completedAt?: string

  durationMinutes?: number

  purpose: string
  summary?: string

  voiceNoteId?: string
  sentimentScore?: number
  sentimentLabel?: 'positive' | 'neutral' | 'negative'

  topics: string[]
  competitors: string[]

  followUpRequired: boolean
  followUpDate?: string
}