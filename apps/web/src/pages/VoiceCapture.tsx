import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { api } from '../lib/api/client'

type VoiceRecordResponse = {
  data: {
    id: string
    status: string
    durationSeconds: number | null
  }
}

type ProcessResponse = {
  data: {
    voiceRecord: {
      id: string
      status: string
    }
    intelligence: {
      id: string
      sentiment: string
      sentimentScore: number
      oneLiner: string
      confidence: number
    }
    alerts: unknown[]
  }
}

type CustomerResponse = {
  data: {
    id: string
    name: string
    city: string
    state: string
  }
}

type VisitResponse = {
  data: {
    id: string
    customerId: string
    scheduledAt: string
  }
}

type Stage =
  | 'ready'
  | 'recording'
  | 'uploading'
  | 'transcribing'
  | 'analyzing'
  | 'extracting'
  | 'complete'
  | 'error'

const stages: Array<{
  key: Exclude<Stage, 'ready' | 'recording' | 'error'>
  label: string
}> = [
  { key: 'uploading', label: 'Uploading voice note' },
  { key: 'transcribing', label: 'Transcribing conversation' },
  { key: 'analyzing', label: 'Analyzing customer signals' },
  { key: 'extracting', label: 'Extracting risks & opportunities' },
  { key: 'complete', label: 'Intelligence ready' },
]

export function VoiceCapture() {
  const { visitId } = useParams()
  const navigate = useNavigate()

  const [stage, setStage] = useState<Stage>('ready')
  const [seconds, setSeconds] = useState(0)
  const [customerName, setCustomerName] = useState('Customer')
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] =
    useState<ProcessResponse['data'] | null>(null)

  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!visitId) {
      setError('Visit ID is missing.')
      setStage('error')
      return
    }

    async function loadVisit() {
      try {
        const visitResponse =
          await api.get<VisitResponse>(
            `/api/visits/${visitId}`,
          )

        const id = visitResponse.data.customerId

        setCustomerId(id)

        const customerResponse =
          await api.get<CustomerResponse>(
            `/api/customers/${id}`,
          )

        setCustomerName(
          customerResponse.data.name,
        )
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load visit.',
        )
        setStage('error')
      }
    }

    void loadVisit()
  }, [visitId])

  useEffect(() => {
    if (stage !== 'recording') {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }

      return
    }

    timerRef.current = window.setInterval(() => {
      setSeconds((current) => {
        if (current >= 30) {
          return 30
        }

        return current + 1
      })
    }, 1000)

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [stage])

  async function startRecording() {
    setError(null)
    setSeconds(0)
    setStage('recording')
  }

  async function finishRecording() {
    if (!visitId) return

    setStage('uploading')

    try {
      const voiceResponse =
        await api.post<VoiceRecordResponse>(
          `/api/visits/${visitId}/voice`,
          {
            recordedById: 'user-ravi',
            fileName: 'field-voice-note.webm',
            mimeType: 'audio/webm',
            storageKey: `demo/${visitId}/voice-note.webm`,
            durationSeconds: Math.max(
              seconds,
              1,
            ),
          },
        )

      const voiceRecordId =
        voiceResponse.data.id

      setStage('transcribing')

      await new Promise((resolve) =>
        window.setTimeout(resolve, 700),
      )

      setStage('analyzing')

      const processPromise =
        api.post<ProcessResponse>(
          `/api/voice/${voiceRecordId}/process`,
        )

      await new Promise((resolve) =>
        window.setTimeout(resolve, 900),
      )

      setStage('extracting')

      const processResponse =
        await processPromise

      await new Promise((resolve) =>
        window.setTimeout(resolve, 700),
      )

      setResult(processResponse.data)
      setStage('complete')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Voice processing failed.',
      )
      setStage('error')
    }
  }

  function reset() {
    setSeconds(0)
    setResult(null)
    setError(null)
    setStage('ready')
  }

  const isProcessing = [
    'uploading',
    'transcribing',
    'analyzing',
    'extracting',
  ].includes(stage)

  return (
    <div className="page voice-capture-page">
      <div className="page-header">
        <div>
          <div className="customer-details-breadcrumb">
            <Link
              to={
                customerId
                  ? `/customers/${customerId}`
                  : '/customers'
              }
            >
              Customers
            </Link>

            <span>/</span>

            <span>{customerName}</span>

            <span>/</span>

            <span>Voice Capture</span>
          </div>

          <span className="page-eyebrow">
            FIELD VOICE
          </span>

          <h1 className="page-title">
            Capture field intelligence
          </h1>

          <p className="page-description">
            Record a short voice note after the
            customer visit. FieldVoice AI turns the
            conversation into structured business
            intelligence.
          </p>
        </div>

        <Link
          to={
            customerId
              ? `/customers/${customerId}`
              : '/customers'
          }
        >
          <Button variant="secondary">
            Back to Customer
          </Button>
        </Link>
      </div>

      <div className="voice-capture-shell">
        <section className="voice-recorder-panel">
          <div className="voice-recorder-context">
            <span className="panel-eyebrow">
              CURRENT VISIT
            </span>

            <strong>{customerName}</strong>

            <span>
              Field representative · Ravi Mehta
            </span>
          </div>

          <div
            className={`voice-record-orb voice-record-orb-${stage}`}
          >
            {stage === 'recording' ? (
              <span className="voice-record-pulse" />
            ) : isProcessing ? (
              <span className="voice-processing-ring" />
            ) : stage === 'complete' ? (
              <span className="voice-complete-mark">
                ✓
              </span>
            ) : (
              <span className="voice-mic-mark">
                MIC
              </span>
            )}
          </div>

          <div className="voice-recorder-status">
            {stage === 'ready' && (
              <>
                <strong>
                  Ready to capture
                </strong>

                <span>
                  Speak naturally about what happened
                  during the customer visit.
                </span>
              </>
            )}

            {stage === 'recording' && (
              <>
                <strong>
                  Recording field note
                </strong>

                <span>
                  {seconds}s / 30s
                </span>
              </>
            )}

            {stage === 'uploading' && (
              <>
                <strong>
                  Uploading voice note
                </strong>

                <span>
                  Preparing the conversation for AI
                  processing.
                </span>
              </>
            )}

            {stage === 'transcribing' && (
              <>
                <strong>
                  Transcribing conversation
                </strong>

                <span>
                  Converting speech into searchable
                  text.
                </span>
              </>
            )}

            {stage === 'analyzing' && (
              <>
                <strong>
                  Understanding conversation
                </strong>

                <span>
                  Detecting sentiment, topics and
                  business signals.
                </span>
              </>
            )}

            {stage === 'extracting' && (
              <>
                <strong>
                  Building intelligence
                </strong>

                <span>
                  Extracting risks, opportunities,
                  actions and alerts.
                </span>
              </>
            )}

            {stage === 'complete' && (
              <>
                <strong>
                  Intelligence ready
                </strong>

                <span>
                  The customer conversation has been
                  converted into business intelligence.
                </span>
              </>
            )}

            {stage === 'error' && (
              <>
                <strong>
                  Processing failed
                </strong>

                <span>{error}</span>
              </>
            )}
          </div>

          {stage === 'ready' && (
            <Button
              type="button"
              variant="primary"
              className="voice-record-button"
              onClick={() => void startRecording()}
            >
              Start recording
            </Button>
          )}

          {stage === 'recording' && (
            <Button
              type="button"
              variant="danger"
              className="voice-record-button"
              onClick={() =>
                void finishRecording()
              }
            >
              Stop & process
            </Button>
          )}

          {stage === 'complete' &&
            result && (
              <div className="voice-result-actions">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() =>
                    customerId &&
                    navigate(
                      `/customers/${customerId}`,
                    )
                  }
                >
                  View AI intelligence
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={reset}
                >
                  Record another note
                </Button>
              </div>
            )}

          {stage === 'error' && (
            <Button
              type="button"
              variant="secondary"
              onClick={reset}
            >
              Try again
            </Button>
          )}
        </section>

        <aside className="voice-processing-panel">
          <span className="panel-eyebrow">
            VOICE → INTELLIGENCE
          </span>

          <h2>
            From conversation to business signal.
          </h2>

          <p>
            FieldVoice processes the field note
            through transcription and AI analysis
            before updating customer intelligence.
          </p>

          <div className="voice-processing-steps">
            {stages.map((item, index) => {
              const currentIndex =
                stages.findIndex(
                  (stageItem) =>
                    stageItem.key === stage,
                )

              const completed =
                stage === 'complete' ||
                (currentIndex >= 0 &&
                  index < currentIndex)

              const active =
                stage === item.key

              return (
                <div
                  className={`voice-processing-step ${
                    completed
                      ? 'is-complete'
                      : ''
                  } ${active ? 'is-active' : ''}`}
                  key={item.key}
                >
                  <span>
                    {completed
                      ? '✓'
                      : index + 1}
                  </span>

                  <div>
                    <strong>
                      {item.label}
                    </strong>

                    {active && (
                      <small>
                        Processing...
                      </small>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {result && (
            <div className="voice-result-preview">
              <span className="intelligence-label">
                AI RESULT
              </span>

              <strong>
                {result.intelligence.oneLiner}
              </strong>

              <div>
                <span>
                  Sentiment
                </span>

                <strong>
                  {result.intelligence.sentiment}{' '}
                  {result.intelligence.sentimentScore >=
                  0
                    ? '+'
                    : ''}
                  {result.intelligence.sentimentScore.toFixed(
                    2,
                  )}
                </strong>
              </div>

              <div>
                <span>AI confidence</span>

                <strong>
                  {Math.round(
                    result.intelligence
                      .confidence * 100,
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>Alerts generated</span>

                <strong>
                  {result.alerts.length}
                </strong>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
