import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import {
  getAlertsByCustomerId,
  getCustomerById,
  getPipelineByCustomerId,
  getSentimentHistoryByCustomerId,
  getVisitsByCustomerId,
  getVoiceIntelligenceByCustomerId,
} from '../data/demo-data'

export function CustomerDetails() {
  const { customerId } = useParams()

  const customer = customerId ? getCustomerById(customerId) : undefined

  if (!customer) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <span className="page-eyebrow">CUSTOMER INTELLIGENCE</span>

            <h1 className="page-title">Customer not found</h1>

            <p className="page-description">
              The requested customer could not be found in the current demo
              dataset.
            </p>
          </div>
        </div>

        <Link to="/customers">
          <Button variant="secondary">Back to Customers</Button>
        </Link>
      </div>
    )
  }

  const visits = getVisitsByCustomerId(customer.id)
  const intelligence = getVoiceIntelligenceByCustomerId(customer.id)
  const alerts = getAlertsByCustomerId(customer.id)
  const pipeline = getPipelineByCustomerId(customer.id)
  const sentimentHistory = getSentimentHistoryByCustomerId(customer.id)

  const latestIntelligence = intelligence[0]

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
                {customer.type} · {customer.city}, {customer.state} ·{' '}
                {customer.territory}
              </p>
            </div>

            <div className="customer-title-actions">
              <Badge
                variant={
                  customer.status === 'active' ? 'success' : 'warning'
                }
              >
                {customer.status.replace('-', ' ')}
              </Badge>

              <Link to="/customers">
                <Button variant="secondary">Back to Customers</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="customer-summary-grid">
        <article className="customer-summary-card">
          <span className="customer-summary-label">Customer Health</span>

          <strong className={`customer-health-value health-${customer.health}`}>
            {customer.health.replace('-', ' ')}
          </strong>

          <span className="customer-summary-meta">
            Based on recent field intelligence
          </span>
        </article>

        <article className="customer-summary-card">
          <span className="customer-summary-label">Sentiment</span>

          <strong>
            {customer.sentimentScore >= 0 ? '+' : ''}
            {customer.sentimentScore.toFixed(2)}
          </strong>

          <span className="customer-summary-meta">
            {customer.sentimentTrend}
          </span>
        </article>

        <article className="customer-summary-card">
          <span className="customer-summary-label">Pipeline Value</span>

          <strong>
            ₹{customer.pipelineValue.toLocaleString('en-IN')}
          </strong>

          <span className="customer-summary-meta">
            Active opportunity value
          </span>
        </article>

        <article className="customer-summary-card">
          <span className="customer-summary-label">Total Visits</span>

          <strong>{customer.totalVisits}</strong>

          <span className="customer-summary-meta">
            Latest: {customer.lastVisitAt}
          </span>
        </article>
      </section>

      <div className="customer-details-grid">
        <section className="customer-main-column">
          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">LATEST INTELLIGENCE</span>

                <h2 className="panel-title">Voice Intelligence</h2>
              </div>

              {latestIntelligence && (
                <Badge
                  variant={
                    latestIntelligence.sentiment === 'positive'
                      ? 'success'
                      : latestIntelligence.sentiment === 'negative'
                        ? 'danger'
                        : 'warning'
                  }
                >
                  {latestIntelligence.sentiment}
                </Badge>
              )}
            </div>

            {latestIntelligence ? (
              <div className="intelligence-content">
                <div className="intelligence-summary">
                  <span className="intelligence-label">Summary</span>

                  <p>{latestIntelligence.summary}</p>
                </div>

                <div className="intelligence-grid">
                  <div>
                    <span className="intelligence-label">One-liner</span>

                    <p>{latestIntelligence.oneLiner}</p>
                  </div>

                  <div>
                    <span className="intelligence-label">
                      Sentiment Score
                    </span>

                    <p>
                      {latestIntelligence.sentimentScore >= 0 ? '+' : ''}
                      {latestIntelligence.sentimentScore.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <span className="intelligence-label">Follow-up</span>

                    <p>
                      {latestIntelligence.followUpRequired
                        ? latestIntelligence.suggestedFollowUpDate ??
                          'Required'
                        : 'Not required'}
                    </p>
                  </div>

                  <div>
                    <span className="intelligence-label">Confidence</span>

                    <p>
                      {Math.round(latestIntelligence.confidence * 100)}%
                    </p>
                  </div>
                </div>

                <div className="intelligence-tags">
                  <span className="intelligence-label">Topics</span>

                  <div className="tag-list">
                    {latestIntelligence.topics.map((topic) => (
                      <span className="data-tag" key={topic}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {latestIntelligence.competitors.length > 0 && (
                  <div className="intelligence-tags">
                    <span className="intelligence-label">Competitors</span>

                    <div className="tag-list">
                      {latestIntelligence.competitors.map((competitor) => (
                        <span className="data-tag" key={competitor}>
                          {competitor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                No voice intelligence available for this customer yet.
              </div>
            )}
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">FIELD HISTORY</span>

                <h2 className="panel-title">Recent Visits</h2>
              </div>

              <span className="panel-count">{visits.length}</span>
            </div>

            <div className="visit-list">
              {visits.map((visit) => (
                <div className="visit-row" key={visit.id}>
                  <div className="visit-date">
                    <strong>{visit.scheduledAt}</strong>

                    <span>{visit.durationMinutes ?? '—'} min</span>
                  </div>

                  <div className="visit-main">
                    <strong>{visit.repName}</strong>

                    <span>{visit.purpose}</span>

                    {visit.summary && <p>{visit.summary}</p>}
                  </div>

                  <Badge
                    variant={
                      visit.status === 'completed'
                        ? 'success'
                        : visit.status === 'in-progress'
                          ? 'warning'
                          : 'neutral'
                    }
                  >
                    {visit.status}
                  </Badge>
                </div>
              ))}
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

            <div className="sentiment-history">
              {sentimentHistory.map((point) => (
                <div className="sentiment-history-row" key={point.date}>
                  <span>{point.date}</span>

                  <strong>
                    {point.score >= 0 ? '+' : ''}
                    {point.score.toFixed(2)}
                  </strong>

                  <span>
                    {point.score >= 0.2
                      ? 'Positive'
                      : point.score <= -0.2
                        ? 'Negative'
                        : 'Neutral'}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <aside className="customer-side-column">
          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">ACCOUNT</span>

                <h2 className="panel-title">Customer Profile</h2>
              </div>
            </div>

            <div className="profile-list">
              <div>
                <span>Account Owner</span>

                <strong>{customer.ownerName}</strong>
              </div>

              <div>
                <span>Contact</span>

                <strong>{customer.contact.name}</strong>
              </div>

              <div>
                <span>Phone</span>

                <strong>{customer.contact.phone}</strong>
              </div>

              <div>
                <span>Email</span>

                <strong>{customer.contact.email}</strong>
              </div>

              <div>
                <span>Annual Revenue</span>

                <strong>
                  ₹{customer.revenue.toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <span>Annual Order Volume</span>

                <strong>
                  {customer.annualOrderVolume.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">BUSINESS SIGNALS</span>

                <h2 className="panel-title">Risks & Opportunities</h2>
              </div>
            </div>

            <div className="signal-list">
              <div className="signal-item signal-risk">
                <span>Active Risks</span>

                <strong>{customer.riskCount}</strong>
              </div>

              <div className="signal-item signal-opportunity">
                <span>Opportunities</span>

                <strong>{customer.opportunityCount}</strong>
              </div>
            </div>

            {alerts.length > 0 && (
              <div className="customer-alert-summary">
                <span className="intelligence-label">Open Alerts</span>

                <strong>
                  {
                    alerts.filter(
                      (alert) => alert.status !== 'resolved',
                    ).length
                  }
                </strong>
              </div>
            )}
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">PIPELINE</span>

                <h2 className="panel-title">Opportunities</h2>
              </div>
            </div>

            <div className="pipeline-list">
              {pipeline.length > 0 ? (
                pipeline.map((opportunity) => (
                  <div className="pipeline-row" key={opportunity.id}>
                    <div>
                      <strong>{opportunity.title}</strong>

                      <span>{opportunity.stage}</span>
                    </div>

                    <strong>
                      ₹{opportunity.value.toLocaleString('en-IN')}
                    </strong>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  No active opportunities.
                </div>
              )}
            </div>
          </article>
        </aside>
      </div>
    </div>
  )
}