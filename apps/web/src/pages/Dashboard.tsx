import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { StatusDot } from '../components/ui/StatusDot'

import { getCustomers } from '../lib/api/customers'
import { getAlerts } from '../lib/api/alerts'
import { getActivity } from '../lib/api/activity'
import { getCustomerIntelligence } from '../lib/api/customers'

type Customer = {
  id: string
  name: string
  health: string
  annualValue?: number | null
  _count?: {
    visits: number
    alerts: number
    intelligence: number
  }
}

type Alert = {
  id: string
  type: string
  severity: string
  status: string
  title: string
  description: string
  createdAt: string
  customer?: {
    id: string
    name: string
    health: string
  } | null
}

type Activity = {
  id: string
  type: string
  title: string
  description: string
  createdAt: string
  customer?: {
    id: string
    name: string
    health: string
  } | null
  actor?: {
    id: string
    name: string
    email: string
    role: string
  } | null
  alert?: {
    id: string
    type: string
    severity: string
    status: string
    title: string
  } | null
}

type Intelligence = {
  id: string
  sentiment: string
  sentimentScore: number
  sentimentTrend: string
  competitors: string[]
  opportunities: Array<{
    id: string
    title: string
    description: string
    value?: number
    probability?: number
  }>
  risks: Array<{
    id: string
    title: string
    description: string
    severity: string
  }>
  processedAt: string
}

function formatRelativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime()

  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) {
    return 'just now'
  }

  if (minutes < 60) {
    return `${minutes} min ago`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)

  return `${days}d ago`
}

function formatType(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\./g, ' ')
    .split(' ')
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase(),
    )
    .join(' ')
}

function getActivityStatus(type: string) {
  const normalized = type.toLowerCase()

  if (normalized.includes('alert')) {
    return 'danger'
  }

  if (normalized.includes('voice')) {
    return 'info'
  }

  if (normalized.includes('visit')) {
    return 'success'
  }

  return 'warning'
}

function getBadgeVariant(severity: string) {
  const value = severity.toLowerCase()

  if (value === 'critical') {
    return 'danger' as const
  }

  if (value === 'high') {
    return 'warning' as const
  }

  if (value === 'opportunity') {
    return 'info' as const
  }

  return 'info' as const
}

export function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>(
    [],
  )

  const [alerts, setAlerts] = useState<Alert[]>([])

  const [activities, setActivities] = useState<Activity[]>(
    [],
  )

  const [intelligence, setIntelligence] = useState<
    Intelligence[]
  >([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      try {
        setLoading(true)
        setError(null)

        const [
          customerResponse,
          alertResponse,
          activityResponse,
        ] = await Promise.all([
          getCustomers<Customer[]>(),
          getAlerts<Alert[]>(),
          getActivity<Activity[]>(20),
        ])

        if (cancelled) {
          return
        }

        setCustomers(customerResponse.data)
        setAlerts(alertResponse.data)
        setActivities(activityResponse.data)

        const intelligenceResponses =
          await Promise.all(
            customerResponse.data.map((customer) =>
              getCustomerIntelligence<Intelligence[]>(
                customer.id,
              ).catch(() => ({
                data: [],
              })),
            ),
          )

        if (cancelled) {
          return
        }

        setIntelligence(
          intelligenceResponses.flatMap(
            (response) => response.data,
          ),
        )
      } catch (requestError) {
        if (cancelled) {
          return
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load executive intelligence.',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  const metrics = useMemo(() => {
    const completedVisits = activities.filter((activity) =>
      activity.type
        .toLowerCase()
        .includes('visit'),
    ).length

    const voiceEvents = activities.filter((activity) =>
      activity.type
        .toLowerCase()
        .includes('voice'),
    ).length

    const scores = intelligence
      .map((item) => item.sentimentScore)
      .filter((score) => Number.isFinite(score))

    const averageSentiment =
      scores.length > 0
        ? scores.reduce(
            (sum, score) => sum + score,
            0,
          ) / scores.length
        : 0

    const criticalAlerts = alerts.filter(
      (alert) =>
        alert.severity === 'CRITICAL' &&
        alert.status !== 'RESOLVED',
    ).length

    return {
      visits: completedVisits,
      voice: voiceEvents,
      averageSentiment,
      criticalAlerts,
    }
  }, [activities, alerts, intelligence])

  const sentimentTrend = useMemo(() => {
    const declining = intelligence.filter(
      (item) =>
        item.sentimentTrend === 'DECLINING',
    ).length

    const improving = intelligence.filter(
      (item) =>
        item.sentimentTrend === 'IMPROVING',
    ).length

    if (improving > declining) {
      return 'Improving'
    }

    if (declining > improving) {
      return 'Declining'
    }

    return 'Stable'
  }, [intelligence])

  const opportunityValue = useMemo(
    () =>
      intelligence.reduce(
        (total, item) =>
          total +
          item.opportunities.reduce(
            (sum, opportunity) =>
              sum + (opportunity.value ?? 0),
            0,
          ),
        0,
      ),
    [intelligence],
  )

  const competitiveMentions = useMemo(() => {
    const counts = new Map<string, number>()

    intelligence.forEach((item) => {
      item.competitors.forEach((competitor) => {
        counts.set(
          competitor,
          (counts.get(competitor) ?? 0) + 1,
        )
      })
    })

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
  }, [intelligence])

  const priorityAlerts = alerts
    .filter((alert) => alert.status !== 'RESOLVED')
    .slice(0, 5)

  if (loading) {
    return (
      <div className="fv-page">
        <div className="fv-page-header">
          <div>
            <p className="fv-eyebrow">
              EXECUTIVE OVERVIEW
            </p>

            <h1>Field intelligence at a glance.</h1>

            <p>
              Loading current intelligence from the field...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fv-page">
        <div className="fv-page-header">
          <div>
            <p className="fv-eyebrow">
              EXECUTIVE OVERVIEW
            </p>

            <h1>Field intelligence at a glance.</h1>

            <p>{error}</p>
          </div>

          <Badge variant="danger">Data unavailable</Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="fv-page">
      <div className="fv-page-header">
        <div>
          <p className="fv-eyebrow">
            EXECUTIVE OVERVIEW
          </p>

          <h1>Field intelligence at a glance.</h1>

          <p>
            Monitor customer sentiment, field activity,
            risks and opportunities across your
            organization.
          </p>
        </div>

        <Badge variant="success">Live data</Badge>
      </div>

      <section className="fv-metric-grid">
        <Card>
          <div className="fv-metric-label">
            Customer visits
          </div>

          <div className="fv-metric-main">
            <strong>{metrics.visits}</strong>
          </div>

          <div className="fv-metric-description">
            Activity events captured
          </div>
        </Card>

        <Card>
          <div className="fv-metric-label">
            Voice intelligence
          </div>

          <div className="fv-metric-main">
            <strong>{metrics.voice}</strong>
          </div>

          <div className="fv-metric-description">
            Voice events processed
          </div>
        </Card>

        <Card>
          <div className="fv-metric-label">
            Average sentiment
          </div>

          <div className="fv-metric-main">
            <strong>
              {metrics.averageSentiment >= 0
                ? '+'
                : ''}
              {metrics.averageSentiment.toFixed(2)}
            </strong>

            <Badge
              variant={
                sentimentTrend === 'Declining'
                  ? 'warning'
                  : 'success'
              }
            >
              {sentimentTrend}
            </Badge>
          </div>

          <div className="fv-metric-description">
            Across analyzed conversations
          </div>
        </Card>

        <Card>
          <div className="fv-metric-label">
            Critical alerts
          </div>

          <div className="fv-metric-main">
            <strong>
              {String(metrics.criticalAlerts).padStart(
                2,
                '0',
              )}
            </strong>

            <Badge variant="danger">
              Attention
            </Badge>
          </div>

          <div className="fv-metric-description">
            Unresolved critical signals
          </div>
        </Card>
      </section>

      <section className="fv-dashboard-grid">
        <Card className="fv-dashboard-card">
          <div className="fv-section-heading">
            <div>
              <h2>Live activity</h2>

              <p>
                What is happening across the field right
                now.
              </p>
            </div>

            <Link to="/activity">
              <Badge variant="info">View stream</Badge>
            </Link>
          </div>

          <div className="fv-activity-list">
            {activities.slice(0, 6).map((activity) => (
              <div
                className="fv-activity-item"
                key={activity.id}
              >
                <StatusDot
                  status={getActivityStatus(
                    activity.type,
                  )}
                />

                <div className="fv-activity-copy">
                  <p>
                    <strong>
                      {activity.actor?.name ??
                        'FieldVoice AI'}
                    </strong>{' '}
                    {activity.title}
                  </p>

                  <span>
                    {activity.customer?.name ??
                      formatType(activity.type)}
                  </span>
                </div>

                <time>
                  {formatRelativeTime(
                    activity.createdAt,
                  )}
                </time>
              </div>
            ))}
          </div>
        </Card>

        <Card className="fv-dashboard-card">
          <div className="fv-section-heading">
            <div>
              <h2>Customer sentiment</h2>

              <p>
                Current organization-wide intelligence.
              </p>
            </div>

            <Badge
              variant={
                sentimentTrend === 'Declining'
                  ? 'warning'
                  : 'success'
              }
            >
              {sentimentTrend}
            </Badge>
          </div>

          <div className="fv-sentiment-placeholder">
            <div className="fv-sentiment-score">
              {metrics.averageSentiment >= 0
                ? '+'
                : ''}
              {metrics.averageSentiment.toFixed(2)}
            </div>

            <Badge
              variant={
                sentimentTrend === 'Declining'
                  ? 'warning'
                  : 'success'
              }
            >
              {intelligence.length} conversations
            </Badge>

            <div className="fv-chart-lines">
              {intelligence
                .slice(0, 7)
                .map((item) => (
                  <span
                    key={item.id}
                    style={{
                      height: `${Math.max(
                        18,
                        Math.min(
                          90,
                          ((item.sentimentScore + 1) /
                            2) *
                            100,
                        ),
                      )}%`,
                    }}
                  />
                ))}
            </div>

            <div className="fv-chart-labels">
              <span>Negative</span>
              <span>Neutral</span>
              <span>Positive</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="fv-dashboard-grid">
        <Card className="fv-dashboard-card">
          <div className="fv-section-heading">
            <div>
              <h2>Priority alerts</h2>

              <p>
                Signals requiring management attention.
              </p>
            </div>

            <Link to="/alerts">
              <Badge variant="info">View all</Badge>
            </Link>
          </div>

          <div className="fv-alert-list">
            {priorityAlerts.length === 0 ? (
              <div className="fv-empty-state">
                No unresolved alerts.
              </div>
            ) : (
              priorityAlerts.map((alert) => (
                <div
                  className="fv-alert-item"
                  key={alert.id}
                >
                  <Badge
                    variant={getBadgeVariant(
                      alert.severity,
                    )}
                  >
                    {formatType(alert.severity)}
                  </Badge>

                  <div>
                    <strong>{alert.title}</strong>

                    <span>
                      {alert.customer?.name ??
                        'Organization-wide'}{' '}
                      ·{' '}
                      {formatRelativeTime(
                        alert.createdAt,
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="fv-dashboard-card">
          <div className="fv-section-heading">
            <div>
              <h2>Commercial intelligence</h2>

              <p>
                Opportunities and competitive signals
                extracted from field conversations.
              </p>
            </div>
          </div>

          <div className="fv-coverage">
            <div>
              <strong>
                ₹
                {opportunityValue.toLocaleString(
                  'en-IN',
                )}
              </strong>

              <span>
                identified opportunity value
              </span>
            </div>

            <div className="fv-coverage-meta">
              <span>
                {competitiveMentions.length}{' '}
                competitors detected
              </span>

              <span>
                {customers.length} customers monitored
              </span>
            </div>
          </div>

          {competitiveMentions.length > 0 && (
            <div className="fv-competitor-list">
              {competitiveMentions.map(
                ([name, count]) => (
                  <div
                    className="fv-alert-item"
                    key={name}
                  >
                    <Badge variant="warning">
                      {count} mention
                      {count === 1 ? '' : 's'}
                    </Badge>

                    <div>
                      <strong>{name}</strong>

                      <span>
                        Competitive intelligence
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}