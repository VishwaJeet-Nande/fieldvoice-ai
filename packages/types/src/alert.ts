export type AlertSeverity = 'info' | 'warning' | 'high' | 'critical'

export type AlertStatus =
  | 'open'
  | 'acknowledged'
  | 'in-progress'
  | 'resolved'

export type AlertType =
  | 'critical-feedback'
  | 'competitive-pricing'
  | 'sentiment-change'
  | 'opportunity'
  | 'follow-up'
  | 'customer-risk'

export interface Alert {
  id: string
  customerId: string
  customerName: string

  type: AlertType
  severity: AlertSeverity
  status: AlertStatus

  title: string
  description: string

  sourceVisitId?: string
  sourceVoiceIntelligenceId?: string

  createdAt: string
  acknowledgedAt?: string
  resolvedAt?: string

  assignedTo?: string
}