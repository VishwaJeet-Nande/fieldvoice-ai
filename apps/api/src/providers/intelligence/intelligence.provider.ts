import type { VoiceIntelligence } from '@fieldvoice/types'

export interface IntelligenceProvider {
  analyze(input: {
    transcript: string
    visitId: string
    customerId: string
  }): Promise<Omit<VoiceIntelligence, 'id' | 'processedAt'>>
}