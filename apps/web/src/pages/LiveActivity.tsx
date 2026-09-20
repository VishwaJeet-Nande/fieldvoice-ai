import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { Link } from 'react-router-dom'

import { getActivity } from '../lib/api/activity'

type ApiActivity = {
  id: string
  type: string
  title: string
  description: string
  customerId: string | null
  alertId: string | null
  createdAt: string
  metadata: Record<string, unknown> | null

  actor: {
    id: string
    name: string
    email: string
    role: string
  } | null

  customer: {
    id: string
    name: string
    health: string
  } | null

  voiceRecord: {
    id: string
    status: string
    durationSeconds: number | null
  } | null

  alert: {
    id: string
    type: string
    severity: string
    status: string
    title: string
  } | null
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
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

export function LiveActivity() {
  const [activities, setActivities] = useState<
    ApiActivity[]
  >([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(
    null,
  )

  const [filter, setFilter] = useState<
    'all' | 'alerts' | 'voice' | 'visits'
  >('all')

  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadActivity() {
      try {
        const response =
          await getActivity<ApiActivity[]>(50)

        if (!cancelled) {
          setActivities(response.data)
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load activity.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadActivity()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_SOCKET_URL ??
        'http://localhost:4001',
    )

    socket.on('connect', () => {
      setConnected(true)
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on(
      'activity:new',
      (event: ApiActivity) => {
        setActivities((current) => [
          event,
          ...current.filter(
            (item) => item.id !== event.id,
          ),
        ])
      },
    )

    return () => {
      socket.disconnect()
    }
  }, [])

  const filteredActivities = useMemo(() => {
    if (filter === 'all') {
      return activities
    }

    return activities.filter((activity) => {
      const type = activity.type.toLowerCase()

      if (filter === 'alerts') {
        return type.includes('alert')
      }

      if (filter === 'voice') {
        return type.includes('voice')
      }

      if (filter === 'visits') {
        return type.includes('visit')
      }

      return true
    })
  }, [activities, filter])

  const alertCount = activities.filter((activity) =>
    activity.type.toLowerCase().includes('alert'),
  ).length

  const voiceCount = activities.filter((activity) =>
    activity.type.toLowerCase().includes('voice'),
  ).length

  const visitCount = activities.filter((activity) =>
    activity.type.toLowerCase().includes('visit'),
  ).length

  if (loading) {
    return (
      <div className="fv-page">
        <div className="fv-page-header">
          <div>
            <p className="fv-eyebrow">
              LIVE OPERATIONS
            </p>
            <h1>Live Activity</h1>
            <p>
              Loading the latest field activity...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fv-page">
      <div className="fv-page-header activity-page-header">
        <div>
          <p className="fv-eyebrow">
            LIVE OPERATIONS
          </p>

          <h1>Live Activity</h1>

          <p>
            Real-time business events from field
            activity and customer intelligence.
          </p>
        </div>

        <div className="activity-live-indicator">
          <span
            className={`activity-live-dot ${
              connected ? 'connected' : ''
            }`}
          />

          <span>
            {connected
              ? 'Live connection'
              : 'Connecting...'}
          </span>
        </div>
      </div>

      {error && (
        <div className="activity-empty">
          <strong>Unable to load activity</strong>
          <span>{error}</span>
        </div>
      )}

      <div className="activity-summary-grid">
        <button
          className={
            filter === 'all'
              ? 'activity-summary-card selected'
              : 'activity-summary-card'
          }
          onClick={() => setFilter('all')}
        >
          <span>Total Events</span>
          <strong>{activities.length}</strong>
          <small>Latest field activity</small>
        </button>

        <button
          className={
            filter === 'alerts'
              ? 'activity-summary-card selected'
              : 'activity-summary-card'
          }
          onClick={() => setFilter('alerts')}
        >
          <span>Alerts</span>
          <strong>{alertCount}</strong>
          <small>Business signals</small>
        </button>

        <button
          className={
            filter === 'voice'
              ? 'activity-summary-card selected'
              : 'activity-summary-card'
          }
          onClick={() => setFilter('voice')}
        >
          <span>Voice Intelligence</span>
          <strong>{voiceCount}</strong>
          <small>AI processing events</small>
        </button>

        <button
          className={
            filter === 'visits'
              ? 'activity-summary-card selected'
              : 'activity-summary-card'
          }
          onClick={() => setFilter('visits')}
        >
          <span>Visits</span>
          <strong>{visitCount}</strong>
          <small>Field activity</small>
        </button>
      </div>

      <div className="activity-toolbar">
        <div>
          <span className="activity-toolbar-label">
            EVENT STREAM
          </span>

          <strong>
            {filteredActivities.length} events
          </strong>
        </div>

        <div className="activity-filter-group">
          {(
            [
              ['all', 'All'],
              ['alerts', 'Alerts'],
              ['voice', 'Voice'],
              ['visits', 'Visits'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              className={
                filter === value ? 'active' : ''
              }
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="activity-stream">
        {filteredActivities.map((activity) => (
          <article
            className="activity-event"
            key={activity.id}
          >
            <div className="activity-event-marker">
              <span />
            </div>

            <div className="activity-event-content">
              <div className="activity-event-top">
                <div className="activity-event-type-row">
                  <span className="activity-event-type">
                    {formatType(activity.type)}
                  </span>

                  {activity.alert && (
                    <span className="activity-severity">
                      {activity.alert.severity}
                    </span>
                  )}
                </div>

                <time>
                  {formatTime(activity.createdAt)}
                </time>
              </div>

              <h2>{activity.title}</h2>

              <p>{activity.description}</p>

              <div className="activity-event-meta">
                {activity.customer && (
                  <Link
                    to={`/customers/${activity.customer.id}`}
                  >
                    {activity.customer.name}
                  </Link>
                )}

                {activity.actor && (
                  <span>
                    by {activity.actor.name}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}