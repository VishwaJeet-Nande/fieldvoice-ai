import type {
  SpeechProvider,
  SpeechTranscriptionResult,
} from './speech.provider.js'

const MOCK_TRANSCRIPT =
  'Rajesh said Nova Consumer is offering approximately 15% lower pricing. They could move close to half their monthly order volume. He wants a volume discount proposal within the next two weeks. He also raised concerns about product quality consistency.'

export class MockSpeechProvider implements SpeechProvider {
  async transcribe(
    _input: {
      voiceRecordId: string
      storageKey?: string | null
    },
  ): Promise<SpeechTranscriptionResult> {
    return {
      transcript: MOCK_TRANSCRIPT,
      confidence: 0.97,
    }
  }
}