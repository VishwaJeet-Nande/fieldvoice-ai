import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { voiceIntelligence, customers, visits } from '../data/demo-data'

type SentimentFilter = 'all' | 'positive' | 'neutral' | 'negative'

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
  if (sentiment === 'positive') return 'voice-sentiment-positive'
  if (sentiment === 'negative') return 'voice-sentiment-negative'
  return 'voice-sentiment-neutral'
}

const scoreLabel = (score: number) =>
  `${score > 0 ? '+' : ''}${score.toFixed(2)}`

export function VoiceIntelligence() {
  const [search, setSearch] = useState('')
  const [sentimentFilter, setSentimentFilter] =
    useState<SentimentFilter>('all')

  const filteredIntelligence = useMemo(() => {
    const query = search.trim().toLowerCase()

    return voiceIntelligence.filter((item) => {
      const customer = customers.find(
        (customerItem) => customerItem.id === item.customerId,
      )

      const matchesSearch =
        !query ||
        customer?.name.toLowerCase().includes(query) ||
        item.oneLiner.toLowerCase().includes(query) ||
        item.topics.some((topic) => topic.toLowerCase().includes(query)) ||
        item.competitors.some((competitor) =>
          competitor.toLowerCase().includes(query),
        )

      const matchesSentiment =
        sentimentFilter === 'all' ||
        item.sentiment === sentimentFilter

      return matchesSearch && matchesSentiment
    })
  }, [search, sentimentFilter])

  const totalInsights = voiceIntelligence.length
  const negativeInsights = voiceIntelligence.filter(
    (item) => item.sentiment === 'negative',
  ).length
  const positiveInsights = voiceIntelligence.filter(
    (item) => item.sentiment === 'positive',
  ).length
  const followUps = voiceIntelligence.filter(
    (item) => item.followUpRequired,
  ).length

  return (
    <div className="fv-page voice-intelligence-page">
      <div className="fv-page-header">
        <div>
          <p className="fv-eyebrow">INTELLIGENCE</p>
          <h1>Voice Intelligence</h1>
          <p>
            Structured business intelligence generated from field
            conversations.
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
            sentimentFilter === 'all' ? 'selected' : ''
          }`}
          onClick={() => setSentimentFilter('all')}
        >
          <span>Total Insights</span>
          <strong>{totalInsights}</strong>
          <small>AI-processed conversations</small>
        </button>

        <button
          type="button"
          className={`voice-summary-card ${
            sentimentFilter === 'negative' ? 'selected' : ''
          }`}
          onClick={() => setSentimentFilter('negative')}
        >
          <span>Negative</span>
          <strong>{negativeInsights}</strong>
          <small>Requires attention</small>
        </button>

        <button
          type="button"
          className={`voice-summary-card ${
            sentimentFilter === 'positive' ? 'selected' : ''
          }`}
          onClick={() => setSentimentFilter('positive')}
        >
          <span>Positive</span>
          <strong>{positiveInsights}</strong>
          <small>Expansion signals</small>
        </button>

        <button
          type="button"
          className="voice-summary-card"
          onClick={() => setSentimentFilter('all')}
        >
          <span>Follow-ups</span>
          <strong>{followUps}</strong>
          <small>Actions identified by AI</small>
        </button>
      </div>

      <div className="voice-toolbar">
        <label className="voice-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers, topics, competitors..."
          />
        </label>

        <div className="voice-filter-group">
          <span>Sentiment</span>

          <button
            type="button"
            className={sentimentFilter === 'all' ? 'active' : ''}
            onClick={() => setSentimentFilter('all')}
          >
            All
          </button>

          <button
            type="button"
            className={sentimentFilter === 'positive' ? 'active' : ''}
            onClick={() => setSentimentFilter('positive')}
          >
            Positive
          </button>

          <button
            type="button"
            className={sentimentFilter === 'neutral' ? 'active' : ''}
            onClick={() => setSentimentFilter('neutral')}
          >
            Neutral
          </button>

          <button
            type="button"
            className={sentimentFilter === 'negative' ? 'active' : ''}
            onClick={() => setSentimentFilter('negative')}
          >
            Negative
          </button>
        </div>
      </div>

      <div className="voice-list">
        {filteredIntelligence.map((intelligence) => {
          const customer = customers.find(
            (customerItem) => customerItem.id === intelligence.customerId,
          )

          const visit = visits.find(
            (visitItem) => visitItem.id === intelligence.visitId,
          )

          return (
            <article className="voice-card" key={intelligence.id}>
              <div className="voice-card-header">
                <div>
                  <div className="voice-customer-row">
                    <Link
                      to={`/customers/${intelligence.customerId}`}
                      className="voice-customer-name"
                    >
                      {customer?.name ?? 'Unknown customer'}
                    </Link>

                    <span
                      className={`voice-sentiment ${sentimentClass(
                        intelligence.sentiment,
                      )}`}
                    >
                      <span className="voice-sentiment-dot" />
                      {sentimentLabel(intelligence.sentiment)}
                    </span>
                  </div>

                  <p className="voice-card-meta">
                    {visit?.repName ?? 'Field representative'} ·{' '}
                    {formatDate(intelligence.processedAt)} ·{' '}
                    {formatTime(intelligence.processedAt)}
                  </p>
                </div>

                <div className="voice-confidence">
                  <span>AI confidence</span>
                  <strong>
                    {Math.round(intelligence.confidence * 100)}%
                  </strong>
                </div>
              </div>

              <div className="voice-card-body">
                <div className="voice-main-insight">
                  <span className="voice-label">KEY INSIGHT</span>
                  <h2>{intelligence.oneLiner}</h2>
                  <p>{intelligence.summary}</p>
                </div>

                <div className="voice-score-block">
                  <span className="voice-label">SENTIMENT SCORE</span>
                  <strong
                    className={sentimentClass(intelligence.sentiment)}
                  >
                    {scoreLabel(intelligence.sentimentScore)}
                  </strong>
                  <span>{intelligence.sentimentTrend}</span>
                </div>
              </div>

              <div className="voice-card-details">
                <div>
                  <span className="voice-label">TOPICS</span>
                  <div className="voice-tags">
                    {intelligence.topics.map((topic) => (
                      <span key={topic}>{topic}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="voice-label">COMPETITORS</span>

                  {intelligence.competitors.length > 0 ? (
                    <div className="voice-tags">
                      {intelligence.competitors.map((competitor) => (
                        <span key={competitor} className="competitor-tag">
                          {competitor}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="voice-muted">None detected</span>
                  )}
                </div>

                <div>
                  <span className="voice-label">SIGNALS</span>

                  <div className="voice-signal-counts">
                    <span>
                      <strong>{intelligence.risks.length}</strong> risks
                    </span>
                    <span>
                      <strong>{intelligence.opportunities.length}</strong>{' '}
                      opportunities
                    </span>
                    <span>
                      <strong>{intelligence.actionItems.length}</strong>{' '}
                      actions
                    </span>
                  </div>
                </div>
              </div>

              <div className="voice-card-footer">
                <span>
                  {intelligence.followUpRequired
                    ? `Follow-up required · ${formatDate(
                        intelligence.suggestedFollowUpDate ??
                          intelligence.processedAt,
                      )}`
                    : 'No follow-up required'}
                </span>

                <Link
                  to={`/customers/${intelligence.customerId}`}
                  className="voice-view-link"
                >
                  View customer intelligence →
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      {filteredIntelligence.length === 0 && (
        <div className="customer-empty">
          <strong>No voice intelligence found</strong>
          <span>
            Try changing the search term or sentiment filter.
          </span>
        </div>
      )}
    </div>
  )
}