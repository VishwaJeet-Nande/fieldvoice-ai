import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { alerts } from '../data/demo-data'

type AlertFilter =
  | 'all'
  | 'critical'
  | 'high'
  | 'open'
  | 'acknowledged'
  | 'resolved'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function severityLabel(severity: string) {
  return severity.charAt(0).toUpperCase() + severity.slice(1)
}

function statusLabel(status: string) {
  return status
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function typeLabel(type: string) {
  return type
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function severityClass(severity: string) {
  return `alert-severity alert-severity-${severity}`
}

function statusClass(status: string) {
  return `alert-status alert-status-${status}`
}

export function Alerts() {
  const [filter, setFilter] = useState<AlertFilter>('all')
  const [search, setSearch] = useState('')

  const filteredAlerts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return alerts.filter((alert) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'critical' && alert.severity === 'critical') ||
        (filter === 'high' && alert.severity === 'high') ||
        (filter === 'open' && alert.status === 'open') ||
        (filter === 'acknowledged' && alert.status === 'acknowledged') ||
        (filter === 'resolved' && alert.status === 'resolved')

      const matchesSearch =
        !query ||
        alert.customerName.toLowerCase().includes(query) ||
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query) ||
        alert.type.toLowerCase().includes(query)

      return matchesFilter && matchesSearch
    })
  }, [filter, search])

  const criticalCount = alerts.filter(
    (alert) => alert.severity === 'critical',
  ).length

  const highCount = alerts.filter(
    (alert) => alert.severity === 'high',
  ).length

  const openCount = alerts.filter(
    (alert) => alert.status === 'open',
  ).length

  const resolvedCount = alerts.filter(
    (alert) => alert.status === 'resolved',
  ).length

  return (
    <div className="alerts-page">
      <div className="fv-page-header alerts-page-header">
        <div>
          <p className="fv-eyebrow">INTELLIGENCE</p>
          <h1>Alerts Center</h1>
          <p>
            Business-critical signals detected from field conversations and
            customer intelligence.
          </p>
        </div>

        <div className="alerts-header-count">
          <strong>{alerts.length}</strong>
          <span>active intelligence signals</span>
        </div>
      </div>

      <div className="alerts-summary-grid">
        <button
          className={`alerts-summary-card ${
            filter === 'critical' ? 'selected' : ''
          }`}
          onClick={() => setFilter('critical')}
        >
          <span>Critical</span>
          <strong>{criticalCount}</strong>
          <small>Immediate attention</small>
        </button>

        <button
          className={`alerts-summary-card ${
            filter === 'high' ? 'selected' : ''
          }`}
          onClick={() => setFilter('high')}
        >
          <span>High priority</span>
          <strong>{highCount}</strong>
          <small>Requires action</small>
        </button>

        <button
          className={`alerts-summary-card ${
            filter === 'open' ? 'selected' : ''
          }`}
          onClick={() => setFilter('open')}
        >
          <span>Open</span>
          <strong>{openCount}</strong>
          <small>Awaiting response</small>
        </button>

        <button
          className={`alerts-summary-card ${
            filter === 'resolved' ? 'selected' : ''
          }`}
          onClick={() => setFilter('resolved')}
        >
          <span>Resolved</span>
          <strong>{resolvedCount}</strong>
          <small>Closed signals</small>
        </button>
      </div>

      <div className="alerts-toolbar">
        <label className="alerts-search">
          <span>⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search alerts, customers, signals..."
          />
        </label>

        <div className="alerts-filter-group">
          <span>View</span>

          {(
            [
              ['all', 'All'],
              ['critical', 'Critical'],
              ['high', 'High'],
              ['open', 'Open'],
              ['acknowledged', 'Acknowledged'],
              ['resolved', 'Resolved'],
            ] as [AlertFilter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              className={filter === value ? 'active' : ''}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="alerts-empty">
            <strong>No alerts found</strong>
            <span>
              Try changing the current filter or search query.
            </span>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            

            return (
              <article
                className={`alert-card alert-card-${alert.severity}`}
                key={alert.id}
              >
                <div className="alert-card-accent" />

                <div className="alert-card-main">
                  <div className="alert-card-header">
                    <div>
                      <div className="alert-title-row">
                        <span className={severityClass(alert.severity)}>
                          <span className="alert-severity-dot" />
                          {severityLabel(alert.severity)}
                        </span>

                        <span className={statusClass(alert.status)}>
                          {statusLabel(alert.status)}
                        </span>

                        <span className="alert-type">
                          {typeLabel(alert.type)}
                        </span>
                      </div>

                      <h2>{alert.title}</h2>

                      <p className="alert-customer-meta">
                        {alert.customerName}
                        {' · '}
                        {formatDate(alert.createdAt)} ·{' '}
                        {formatTime(alert.createdAt)}
                      </p>
                    </div>

                    <div className="alert-time">
                      {formatTime(alert.createdAt)}
                    </div>
                  </div>

                  <div className="alert-description">
                    <span className="alert-label">AI SIGNAL</span>
                    <p>{alert.description}</p>
                  </div>

                  <div className="alert-card-footer">
                    <div className="alert-source">
                      {alert.sourceVoiceIntelligenceId ? (
                        <span>
                          <strong>Source:</strong> Voice intelligence
                        </span>
                      ) : (
                        <span>
                          <strong>Source:</strong> Field activity
                        </span>
                      )}

                      {alert.assignedTo && (
                        <span>
                          <strong>Assigned:</strong> {alert.assignedTo}
                        </span>
                      )}
                    </div>

                    <Link
                      className="alert-customer-link"
                      to={`/customers/${alert.customerId}`}
                    >
                      View customer intelligence →
                    </Link>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}