import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getCustomers,
  getCustomerIntelligence,
} from '../lib/api/customers'

type SentimentFilter =
  | 'all'
  | 'positive'
  | 'neutral'
  | 'negative'

type Customer = {
  id: string
  name: string
}

type VoiceIntelligence = {
  id: string
  visitId: string
  customerId: string
  transcript: string
  summary: string
  oneLiner: string
  sentiment: 'positive' | 'neutral' | 'negative'
  sentimentScore: number
  sentimentTrend:
    | 'improving'
    | 'stable'
    | 'declining'
  aspects: {
    name: string
    sentiment: 'positive' | 'neutral' | 'negative'
    score: number
    evidence?: string
  }[]
  topics: string[]
  competitors: string[]
  risks: {
    id: string
    title: string
    description: string
    severity:
      | 'low'
      | 'medium'
      | 'high'
      | 'critical'
    createdAt: string
  }[]
  opportunities: {
    id: string
    title: string
    description: string
    value?: number
    probability?: number
    createdAt: string
  }[]
  actionItems: {
    id: string
    title: string
    description?: string
    priority:
      | 'low'
      | 'medium'
      | 'high'
      | 'critical'
    assignee: string
    dueDate: string
    completed: boolean
  }[]
  followUpRequired: boolean
  suggestedFollowUpDate?: string
  confidence: number
  processedAt: string
}

type IntelligenceResponse = {
  data: VoiceIntelligence[]
}

type CustomerResponse = {
  data: Customer[]
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))

const formatTime = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

const sentimentLabel = (sentiment: string) => {
  if (sentiment === 'positive') return 'Positive'
  if (sentiment === 'negative') return 'Negative'
  return 'Neutral'
}

const sentimentClass = (sentiment: string) => {
  if (sentiment === 'positive') {
    return 'voice-sentiment-positive'
  }

  if (sentiment === 'negative') {
    return 'voice-sentiment-negative'
  }

  return 'voice-sentiment-neutral'
}

const scoreLabel = (score: number) =>
  `${score > 0 ? '+' : ''}${score.toFixed(2)}`

export function VoiceIntelligence() {
  const [customers, setCustomers] = useState<
    Customer[]
  >([])
  const [intelligence, setIntelligence] = useState<
    VoiceIntelligence[]
  >([])
  const [search, setSearch] = useState('')
  const [sentimentFilter, setSentimentFilter] =
    useState<SentimentFilter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadIntelligence() {
      setLoading(true)
      setError(null)

      try {
        const customerResponse =
          await getCustomers<CustomerResponse['data']>()

        const customerList = customerResponse.data

        const intelligenceResponses =
          await Promise.all(
            customerList.map((customer) =>
              getCustomerIntelligence<
                IntelligenceResponse['data']
              >(customer.id),
            ),
          )

        if (cancelled) return

        const allIntelligence =
          intelligenceResponses.flatMap(
            (response) => response.data,
          )

        setCustomers(customerList)
        setIntelligence(allIntelligence)
      } catch (requestError) {
        if (cancelled) return

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load voice intelligence.',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadIntelligence()

    return () => {
      cancelled = true
    }
  }, [])

  const customerMap = useMemo(
    () =>
      new Map(
        customers.map((customer) => [
          customer.id,
          customer,
        ]),
      ),
    [customers],
  )

  const filteredIntelligence = useMemo(() => {
    const query = search.trim().toLowerCase()

    return intelligence
      .filter((item) => {
        const customer = customerMap.get(
          item.customerId,
        )

        const matchesSearch =
          !query ||
          customer?.name
            .toLowerCase()
            .includes(query) ||
          item.oneLiner
            .toLowerCase()
            .includes(query) ||
          item.summary
            .toLowerCase()
            .includes(query) ||
          item.topics.some((topic) =>
            topic.toLowerCase().includes(query),
          ) ||
          item.competitors.some((competitor) =>
            competitor
              .toLowerCase()
              .includes(query),
          )

        const matchesSentiment =
          sentimentFilter === 'all' ||
          item.sentiment === sentimentFilter

        return (
          matchesSearch && matchesSentiment
        )
      })
      .sort(
        (a, b) =>
          new Date(b.processedAt).getTime() -
          new Date(a.processedAt).getTime(),
      )
  }, [
    intelligence,
    customerMap,
    search,
    sentimentFilter,
  ])

  const totalInsights = intelligence.length

  const negativeInsights = intelligence.filter(
    (item) => item.sentiment === 'negative',
  ).length

  const positiveInsights = intelligence.filter(
    (item) => item.sentiment === 'positive',
  ).length

  const followUps = intelligence.filter(
    (item) => item.followUpRequired,
  ).length

  if (loading) {
    return (
      <div className="fv-page voice-intelligence-page">
        <div className="fv-page-header">
          <div>
            <p className="fv-eyebrow">
              INTELLIGENCE
            </p>
            <h1>Voice Intelligence</h1>
            <p>
              Loading structured intelligence from
              field conversations.
            </p>
          </div>
        </div>

        <div className="customer-empty">
          <strong>
            Loading voice intelligence...
          </strong>
          <span>
            Fetching AI-processed field conversations.
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fv-page voice-intelligence-page">
        <div className="fv-page-header">
          <div>
            <p className="fv-eyebrow">
              INTELLIGENCE
            </p>
            <h1>Voice Intelligence</h1>
            <p>
              Structured business intelligence
              generated from field conversations.
            </p>
          </div>
        </div>

        <div className="customer-empty">
          <strong>
            Unable to load voice intelligence
          </strong>
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fv-page voice-intelligence-page">
      <div className="fv-page-header">
        <div>
          <p className="fv-eyebrow">
            INTELLIGENCE
          </p>

          <h1>Voice Intelligence</h1>

          <p>
            Structured business intelligence generated
            from field conversations.
          </p>
        </div>

        <div className="page-header-meta">
          <strong>{totalInsights}</strong>
          <span>processed voice notes</span>
        </div>
      </div>

      <div className="voice-summary-grid">
        <button
          type="button"
          className={`voice-summary-card ${
            sentimentFilter === 'all'
              ? 'selected'
              : ''
          }`}
          onClick={() =>
            setSentimentFilter('all')
          }
        >
          <span>Total Insights</span>
          <strong>{totalInsights}</strong>
          <small>
            AI-processed conversations
          </small>
        </button>

        <button
          type="button"
          className={`voice-summary-card ${
            sentimentFilter === 'negative'
              ? 'selected'
              : ''
          }`}
          onClick={() =>
            setSentimentFilter('negative')
          }
        >
          <span>Negative</span>
          <strong>{negativeInsights}</strong>
          <small>Requires attention</small>
        </button>

        <button
          type="button"
          className={`voice-summary-card ${
            sentimentFilter === 'positive'
              ? 'selected'
              : ''
          }`}
          onClick={() =>
            setSentimentFilter('positive')
          }
        >
          <span>Positive</span>
          <strong>{positiveInsights}</strong>
          <small>Expansion signals</small>
        </button>

        <button
          type="button"
          className="voice-summary-card"
          onClick={() =>
            setSentimentFilter('all')
          }
        >
          <span>Follow-ups</span>
          <strong>{followUps}</strong>
          <small>
            Actions identified by AI
          </small>
        </button>
      </div>

      <div className="voice-toolbar">
        <label className="voice-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customers, topics, competitors..."
          />
        </label>

        <div className="voice-filter-group">
          <span>Sentiment</span>

          {(
            [
              ['all', 'All'],
              ['positive', 'Positive'],
              ['neutral', 'Neutral'],
              ['negative', 'Negative'],
            ] as [
              SentimentFilter,
              string,
            ][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={
                sentimentFilter === value
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setSentimentFilter(value)
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="voice-list">
        {filteredIntelligence.map(
          (item) => {
            const customer =
              customerMap.get(item.customerId)

            return (
              <article
                className="voice-card"
                key={item.id}
              >
                <div className="voice-card-header">
                  <div>
                    <div className="voice-customer-row">
                      <Link
                        to={`/customers/${item.customerId}`}
                        className="voice-customer-name"
                      >
                        {customer?.name ??
                          'Unknown customer'}
                      </Link>

                      <span
                        className={`voice-sentiment ${sentimentClass(
                          item.sentiment,
                        )}`}
                      >
                        <span className="voice-sentiment-dot" />

                        {sentimentLabel(
                          item.sentiment,
                        )}
                      </span>
                    </div>

                    <p className="voice-card-meta">
                      Field intelligence ·{' '}
                      {formatDate(
                        item.processedAt,
                      )}{' '}
                      ·{' '}
                      {formatTime(
                        item.processedAt,
                      )}
                    </p>
                  </div>

                  <div className="voice-confidence">
                    <span>AI confidence</span>

                    <strong>
                      {Math.round(
                        item.confidence * 100,
                      )}
                      %
                    </strong>
                  </div>
                </div>

                <div className="voice-card-body">
                  <div className="voice-main-insight">
                    <span className="voice-label">
                      KEY INSIGHT
                    </span>

                    <h2>
                      {item.oneLiner}
                    </h2>

                    <p>
                      {item.summary}
                    </p>
                  </div>

                  <div className="voice-score-block">
                    <span className="voice-label">
                      SENTIMENT SCORE
                    </span>

                    <strong
                      className={sentimentClass(
                        item.sentiment,
                      )}
                    >
                      {scoreLabel(
                        item.sentimentScore,
                      )}
                    </strong>

                    <span>
                      {item.sentimentTrend}
                    </span>
                  </div>
                </div>

                <div className="voice-card-details">
                  <div>
                    <span className="voice-label">
                      TOPICS
                    </span>

                    <div className="voice-tags">
                      {item.topics.map(
                        (topic) => (
                          <span key={topic}>
                            {topic}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="voice-label">
                      COMPETITORS
                    </span>

                    {item.competitors
                      .length > 0 ? (
                      <div className="voice-tags">
                        {item.competitors.map(
                          (competitor) => (
                            <span
                              key={competitor}
                              className="competitor-tag"
                            >
                              {competitor}
                            </span>
                          ),
                        )}
                      </div>
                    ) : (
                      <span className="voice-muted">
                        None detected
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="voice-label">
                      SIGNALS
                    </span>

                    <div className="voice-signal-counts">
                      <span>
                        <strong>
                          {item.risks.length}
                        </strong>{' '}
                        risks
                      </span>

                      <span>
                        <strong>
                          {
                            item
                              .opportunities
                              .length
                          }
                        </strong>{' '}
                        opportunities
                      </span>

                      <span>
                        <strong>
                          {
                            item
                              .actionItems
                              .length
                          }
                        </strong>{' '}
                        actions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="voice-card-footer">
                  <span>
                    {item.followUpRequired
                      ? `Follow-up required · ${formatDate(
                          item.suggestedFollowUpDate ??
                            item.processedAt,
                        )}`
                      : 'No follow-up required'}
                  </span>

                  <Link
                    to={`/customers/${item.customerId}`}
                    className="voice-view-link"
                  >
                    View customer intelligence →
                  </Link>
                </div>
              </article>
            )
          },
        )}
      </div>

      {filteredIntelligence.length ===
        0 && (
        <div className="customer-empty">
          <strong>
            No voice intelligence found
          </strong>

          <span>
            Try changing the search term or
            sentiment filter.
          </span>
        </div>
      )}
    </div>
  )
}