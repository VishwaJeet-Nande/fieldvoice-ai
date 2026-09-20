import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import {
  getCustomer,
  getCustomerIntelligence,
} from '../lib/api/customers'

type ApiOwner = {
  id: string
  name: string
  email: string
  role: string
}

type ApiVisit = {
  id: string
  scheduledAt: string
  startedAt: string | null
  endedAt: string | null
  rep: {
    id: string
    name: string
    email: string
  }
}

type ApiAlert = {
  id: string
  severity: string
  status: string
  type: string
  title: string
  description: string
  createdAt: string
  assignedTo: string | null
}

type ApiCustomer = {
  id: string
  name: string
  industry: string
  city: string
  state: string
  health: string
  annualValue: number | null
  ownerId: string
  owner: ApiOwner | null
  visits: ApiVisit[]
  alerts: ApiAlert[]
}

type ApiRisk = {
  id: string
  title: string
  description: string
  severity: string
  createdAt: string
}

type ApiOpportunity = {
  id: string
  title: string
  description: string
  value?: number
  probability?: number
  createdAt: string
}

type ApiActionItem = {
  id: string
  title: string
  description?: string
  priority: string
  assignee: string
  dueDate: string
  completed: boolean
}

type ApiIntelligence = {
  id: string
  visitId: string
  customerId: string
  transcript: string
  summary: string
  oneLiner: string
  sentiment: 'positive' | 'neutral' | 'negative'
  sentimentScore: number
  sentimentTrend: 'improving' | 'stable' | 'declining'
  aspects: Array<{
    name: string
    sentiment: 'positive' | 'neutral' | 'negative'
    score: number
    evidence?: string
  }>
  topics: string[]
  competitors: string[]
  risks: ApiRisk[]
  opportunities: ApiOpportunity[]
  actionItems: ApiActionItem[]
  followUpRequired: boolean
  suggestedFollowUpDate?: string
  confidence: number
  processedAt: string
  voiceRecord?: {
    id: string
    visitId: string
    durationSeconds: number | null
    status: string
    createdAt: string
  }
  visit?: {
    id: string
    scheduledAt: string
    startedAt: string | null
    endedAt: string | null
    rep: {
      id: string
      name: string
    }
  }
}

type CustomerResponse = {
  data: ApiCustomer
}

type IntelligenceResponse = {
  data: ApiIntelligence[]
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) return '—'

  return `₹${value.toLocaleString('en-IN')}`
}

function mapCustomerType(industry: string) {
  const value = industry.toLowerCase()

  if (value.includes('distributor') || value.includes('distribution')) {
    return 'distributor'
  }

  if (value.includes('wholesale')) {
    return 'wholesaler'
  }

  if (value.includes('retail')) {
    return 'retailer'
  }

  return 'institutional'
}

function mapHealth(health: string) {
  switch (health.toUpperCase()) {
    case 'HEALTHY':
      return 'healthy'
    case 'WATCH':
      return 'watch'
    case 'AT_RISK':
      return 'at-risk'
    case 'CRITICAL':
      return 'critical'
    default:
      return 'watch'
  }
}

function getHealthStatus(health: string) {
  const normalized = mapHealth(health)

  if (normalized === 'critical' || normalized === 'at-risk') {
    return 'at-risk'
  }

  return 'active'
}

function getSeverityVariant(severity: string) {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
    case 'HIGH':
      return 'danger'
    case 'WARNING':
    case 'MEDIUM':
      return 'warning'
    default:
      return 'neutral'
  }
}

function getSentimentVariant(sentiment: string) {
  switch (sentiment) {
    case 'positive':
      return 'success'
    case 'negative':
      return 'danger'
    default:
      return 'warning'
  }
}

function getVisitDuration(
  startedAt: string | null,
  endedAt: string | null,
) {
  if (!startedAt || !endedAt) return null

  const durationMs =
    new Date(endedAt).getTime() - new Date(startedAt).getTime()

  if (durationMs <= 0) return null

  return Math.round(durationMs / 60000)
}

export function CustomerDetails() {
  const { customerId } = useParams()

  const [customer, setCustomer] = useState<ApiCustomer | null>(null)
  const [intelligence, setIntelligence] = useState<ApiIntelligence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!customerId) {
      setError('Customer ID is missing.')
      setLoading(false)
      return
    }

    const id = customerId
    let cancelled = false

    async function loadCustomer() {
      setLoading(true)
      setError(null)

      try {
        const [customerResponse, intelligenceResponse] =
          await Promise.all([
            getCustomer<CustomerResponse['data']>(id),
            getCustomerIntelligence<IntelligenceResponse['data']>(id),
          ])

        if (cancelled) return

        setCustomer(customerResponse.data)
        setIntelligence(intelligenceResponse.data)
      } catch (requestError) {
        if (cancelled) return

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load customer intelligence.',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadCustomer()

    return () => {
      cancelled = true
    }
  }, [customerId])

  const latestIntelligence = intelligence[0]

  const sentimentHistory = useMemo(
    () =>
      intelligence
        .slice()
        .sort(
          (a, b) =>
            new Date(a.processedAt).getTime() -
            new Date(b.processedAt).getTime(),
        ),
    [intelligence],
  )

  const allRisks = useMemo(
    () => intelligence.flatMap((item) => item.risks),
    [intelligence],
  )

  const allOpportunities = useMemo(
    () => intelligence.flatMap((item) => item.opportunities),
    [intelligence],
  )

  const allActionItems = useMemo(
    () => intelligence.flatMap((item) => item.actionItems),
    [intelligence],
  )

  const allTopics = useMemo(
    () =>
      Array.from(
        new Set(intelligence.flatMap((item) => item.topics)),
      ),
    [intelligence],
  )

  const allCompetitors = useMemo(
    () =>
      Array.from(
        new Set(intelligence.flatMap((item) => item.competitors)),
      ),
    [intelligence],
  )

  const pipelineValue = useMemo(
    () =>
      allOpportunities.reduce(
        (total, opportunity) => total + (opportunity.value ?? 0),
        0,
      ),
    [allOpportunities],
  )

  const latestVisit = customer?.visits[0]

  const nextVisit = useMemo(() => {
    if (!customer) return null

    const now = Date.now()

    return (
      customer.visits
        .filter(
          (visit) => new Date(visit.scheduledAt).getTime() >= now,
        )
        .sort(
          (a, b) =>
            new Date(a.scheduledAt).getTime() -
            new Date(b.scheduledAt).getTime(),
        )[0] ?? null
    )
  }, [customer])

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <span className="page-eyebrow">
              CUSTOMER INTELLIGENCE
            </span>

            <h1 className="page-title">Loading customer...</h1>

            <p className="page-description">
              Fetching customer profile and field intelligence.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <span className="page-eyebrow">
              CUSTOMER INTELLIGENCE
            </span>

            <h1 className="page-title">
              {error ? 'Unable to load customer' : 'Customer not found'}
            </h1>

            <p className="page-description">
              {error ??
                'The requested customer could not be found.'}
            </p>
          </div>
        </div>

        <Link to="/customers">
          <Button variant="secondary">Back to Customers</Button>
        </Link>
      </div>
    )
  }

  const health = mapHealth(customer.health)
  const status = getHealthStatus(customer.health)

  const latestSentimentScore =
    latestIntelligence?.sentimentScore ?? 0

  return (
    <div className="page customer-details-page">
      <div className="page-header">
        <div>
          <div className="customer-details-breadcrumb">
            <Link to="/customers">Customers</Link>

            <span>/</span>

            <span>{customer.name}</span>
          </div>

          <span className="page-eyebrow">CUSTOMER INTELLIGENCE</span>

          <div className="customer-title-row">
            <div>
              <h1 className="page-title">{customer.name}</h1>

              <p className="page-description">
                {mapCustomerType(customer.industry)} ·{' '}
                {customer.city}, {customer.state}
              </p>
            </div>

            <div className="customer-title-actions">
              <Badge
                variant={
                  status === 'active' ? 'success' : 'warning'
                }
              >
                {status.replace('-', ' ')}
              </Badge>

              <Link to="/customers">
                <Button variant="secondary">
                  Back to Customers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="customer-summary-grid">
        <article className="customer-summary-card">
          <span className="customer-summary-label">
            Customer Health
          </span>

          <strong className={`customer-health-value health-${health}`}>
            {health.replace('-', ' ')}
          </strong>

          <span className="customer-summary-meta">
            Based on current account intelligence
          </span>
        </article>

        <article className="customer-summary-card">
          <span className="customer-summary-label">Sentiment</span>

          <strong>
            {latestSentimentScore >= 0 ? '+' : ''}
            {latestSentimentScore.toFixed(2)}
          </strong>

          <span className="customer-summary-meta">
            {latestIntelligence?.sentimentTrend ??
              'No intelligence yet'}
          </span>
        </article>

        <article className="customer-summary-card">
          <span className="customer-summary-label">
            Intelligence Value
          </span>

          <strong>{formatCurrency(pipelineValue)}</strong>

          <span className="customer-summary-meta">
            Identified opportunities
          </span>
        </article>

        <article className="customer-summary-card">
          <span className="customer-summary-label">
            Total Visits
          </span>

          <strong>{customer.visits.length}</strong>

          <span className="customer-summary-meta">
            Latest: {formatDateTime(latestVisit?.scheduledAt)}
          </span>
        </article>
      </section>

      <div className="customer-details-grid">
        <section className="customer-main-column">
          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">
                  LATEST INTELLIGENCE
                </span>

                <h2 className="panel-title">
                  Voice Intelligence
                </h2>
              </div>

              {latestIntelligence && (
                <Badge
                  variant={getSentimentVariant(
                    latestIntelligence.sentiment,
                  )}
                >
                  {latestIntelligence.sentiment}
                </Badge>
              )}
            </div>

            {latestIntelligence ? (
              <div className="intelligence-content">
                <div className="intelligence-summary">
                  <span className="intelligence-label">
                    Summary
                  </span>

                  <p>{latestIntelligence.summary}</p>
                </div>

                <div className="intelligence-grid">
                  <div>
                    <span className="intelligence-label">
                      One-liner
                    </span>

                    <p>{latestIntelligence.oneLiner}</p>
                  </div>

                  <div>
                    <span className="intelligence-label">
                      Sentiment Score
                    </span>

                    <p>
                      {latestIntelligence.sentimentScore >= 0
                        ? '+'
                        : ''}
                      {latestIntelligence.sentimentScore.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <span className="intelligence-label">
                      Follow-up
                    </span>

                    <p>
                      {latestIntelligence.followUpRequired
                        ? latestIntelligence.suggestedFollowUpDate ??
                          'Required'
                        : 'Not required'}
                    </p>
                  </div>

                  <div>
                    <span className="intelligence-label">
                      Confidence
                    </span>

                    <p>
                      {Math.round(
                        latestIntelligence.confidence * 100,
                      )}
                      %
                    </p>
                  </div>
                </div>

                {latestIntelligence.transcript && (
                  <div className="intelligence-summary">
                    <span className="intelligence-label">
                      Transcript
                    </span>

                    <p>{latestIntelligence.transcript}</p>
                  </div>
                )}

                {allTopics.length > 0 && (
                  <div className="intelligence-tags">
                    <span className="intelligence-label">
                      Topics
                    </span>

                    <div className="tag-list">
                      {allTopics.map((topic) => (
                        <span className="data-tag" key={topic}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {allCompetitors.length > 0 && (
                  <div className="intelligence-tags">
                    <span className="intelligence-label">
                      Competitors
                    </span>

                    <div className="tag-list">
                      {allCompetitors.map((competitor) => (
                        <span
                          className="data-tag"
                          key={competitor}
                        >
                          {competitor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                No voice intelligence available for this
                customer yet.
              </div>
            )}
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">
                  FIELD HISTORY
                </span>

                <h2 className="panel-title">Recent Visits</h2>
              </div>

              <span className="panel-count">
                {customer.visits.length}
              </span>
            </div>

            <div className="visit-list">
              {customer.visits.length > 0 ? (
                customer.visits.map((visit) => {
                  const duration = getVisitDuration(
                    visit.startedAt,
                    visit.endedAt,
                  )

                  return (
                    <div className="visit-row" key={visit.id}>
                      <div className="visit-date">
                        <strong>
                          {formatDateTime(visit.scheduledAt)}
                        </strong>

                        <span>
                          {duration ? `${duration} min` : '—'}
                        </span>
                      </div>

                      <div className="visit-main">
                        <strong>{visit.rep.name}</strong>

                        <span>Field visit</span>

                        {latestIntelligence?.visitId ===
                          visit.id && (
                          <p>
                            Latest voice intelligence is
                            available for this visit.
                          </p>
                        )}
                      </div>

                      <Badge variant="success">Completed</Badge>
                    </div>
                  )
                })
              ) : (
                <div className="empty-state">
                  No visits recorded for this customer yet.
                </div>
              )}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">SENTIMENT</span>

                <h2 className="panel-title">
                  Customer Sentiment History
                </h2>
              </div>
            </div>

            {sentimentHistory.length > 0 ? (
              <div className="sentiment-history">
                {sentimentHistory.map((item) => (
                  <div
                    className="sentiment-history-row"
                    key={item.id}
                  >
                    <span>{formatDate(item.processedAt)}</span>

                    <strong>
                      {item.sentimentScore >= 0 ? '+' : ''}
                      {item.sentimentScore.toFixed(2)}
                    </strong>

                    <span>
                      {item.sentiment
                        .charAt(0)
                        .toUpperCase() +
                        item.sentiment.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                No sentiment history is available yet.
              </div>
            )}
          </article>

          {allActionItems.length > 0 && (
            <article className="panel">
              <div className="panel-header">
                <div>
                  <span className="panel-eyebrow">
                    FOLLOW-UP
                  </span>

                  <h2 className="panel-title">Action Items</h2>
                </div>

                <span className="panel-count">
                  {
                    allActionItems.filter(
                      (item) => !item.completed,
                    ).length
                  }
                </span>
              </div>

              <div className="signal-list">
                {allActionItems.map((item) => (
                  <div
                    className="signal-item"
                    key={item.id}
                  >
                    <div>
                      <strong>{item.title}</strong>

                      <span>
                        {item.assignee} · Due{' '}
                        {formatDate(item.dueDate)}
                      </span>
                    </div>

                    <Badge
                      variant={
                        item.completed
                          ? 'success'
                          : getSeverityVariant(item.priority)
                      }
                    >
                      {item.completed
                        ? 'completed'
                        : item.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </article>
          )}
        </section>

        <aside className="customer-side-column">
          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">ACCOUNT</span>

                <h2 className="panel-title">
                  Customer Profile
                </h2>
              </div>
            </div>

            <div className="profile-list">
              <div>
                <span>Account Owner</span>

                <strong>
                  {customer.owner?.name ?? 'Unassigned'}
                </strong>
              </div>

              <div>
                <span>Contact</span>

                <strong>Not available</strong>
              </div>

              <div>
                <span>Phone</span>

                <strong>Not available</strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {customer.owner?.email ?? 'Not available'}
                </strong>
              </div>

              <div>
                <span>Annual Revenue</span>

                <strong>
                  {formatCurrency(customer.annualValue)}
                </strong>
              </div>

              <div>
                <span>Annual Order Volume</span>

                <strong>Not available</strong>
              </div>

              {nextVisit && (
                <div>
                  <span>Next Visit</span>

                  <strong>
                    {formatDateTime(nextVisit.scheduledAt)}
                  </strong>
                </div>
              )}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">
                  BUSINESS SIGNALS
                </span>

                <h2 className="panel-title">
                  Risks & Opportunities
                </h2>
              </div>
            </div>

            <div className="signal-list">
              <div className="signal-item signal-risk">
                <span>Active Risks</span>

                <strong>{allRisks.length}</strong>
              </div>

              <div className="signal-item signal-opportunity">
                <span>Opportunities</span>

                <strong>{allOpportunities.length}</strong>
              </div>
            </div>

            {allRisks.length > 0 && (
              <div className="customer-alert-summary">
                <span className="intelligence-label">
                  Latest Risks
                </span>

                <div className="signal-list">
                  {allRisks.slice(0, 3).map((risk) => (
                    <div
                      className="signal-item"
                      key={risk.id}
                    >
                      <div>
                        <strong>{risk.title}</strong>

                        <span>{risk.description}</span>
                      </div>

                      <Badge
                        variant={getSeverityVariant(
                          risk.severity,
                        )}
                      >
                        {risk.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">
                  PIPELINE
                </span>

                <h2 className="panel-title">Opportunities</h2>
              </div>
            </div>

            <div className="pipeline-list">
              {allOpportunities.length > 0 ? (
                allOpportunities.map((opportunity) => (
                  <div
                    className="pipeline-row"
                    key={opportunity.id}
                  >
                    <div>
                      <strong>{opportunity.title}</strong>

                      <span>
                        {opportunity.probability !== undefined
                          ? `${opportunity.probability}% probability`
                          : 'Opportunity identified'}
                      </span>
                    </div>

                    <strong>
                      {formatCurrency(opportunity.value)}
                    </strong>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  No opportunities identified yet.
                </div>
              )}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">ALERTS</span>

                <h2 className="panel-title">
                  Customer Alerts
                </h2>
              </div>

              <span className="panel-count">
                {customer.alerts.length}
              </span>
            </div>

            {customer.alerts.length > 0 ? (
              <div className="signal-list">
                {customer.alerts.map((alert) => (
                  <div
                    className="signal-item"
                    key={alert.id}
                  >
                    <div>
                      <strong>{alert.title}</strong>

                      <span>
                        {formatDateTime(alert.createdAt)}
                      </span>
                    </div>

                    <Badge
                      variant={getSeverityVariant(
                        alert.severity,
                      )}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                No alerts for this customer.
              </div>
            )}
          </article>
        </aside>
      </div>
    </div>
  )
}