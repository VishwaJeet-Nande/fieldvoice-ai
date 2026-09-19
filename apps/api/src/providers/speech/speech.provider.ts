export interface SpeechTranscriptionResult {
  transcript: string
  confidence: number
}

export interface SpeechProvider {
  transcribe(input: {
    voiceRecordId: string
    storageKey?: string | null
  }): Promise<SpeechTranscriptionResult>
}