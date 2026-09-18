export type CustomerStatus = 'active' | 'at-risk' | 'inactive'

export type CustomerHealth = 'healthy' | 'watch' | 'at-risk' | 'critical'

export type CustomerType =
  | 'distributor'
  | 'wholesaler'
  | 'retailer'
  | 'institutional'

export interface CustomerContact {
  name: string
  role: string
  phone: string
  email: string
}

export interface Customer {
  id: string
  name: string
  type: CustomerType
  status: CustomerStatus
  health: CustomerHealth
  territory: string
  city: string
  state: string
  ownerId: string
  ownerName: string
  contact: CustomerContact

  revenue: number
  annualOrderVolume: number
  pipelineValue: number

  sentimentScore: number
  sentimentTrend: 'improving' | 'stable' | 'declining'
  topics: string[]
  competitors: string[]

  riskCount: number
  opportunityCount: number

  lastVisitAt: string
  nextVisitAt?: string
  totalVisits: number
}
