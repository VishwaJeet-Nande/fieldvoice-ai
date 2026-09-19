import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  Customer,
  CustomerHealth,
  CustomerStatus,
  CustomerType,
} from '@fieldvoice/types'
import { CustomerTable } from '../components/customers/CustomerTable'
import { getCustomers } from '../lib/api/customers'

type HealthFilter = 'all' | CustomerHealth

interface ApiCustomer {
  id: string
  organizationId: string
  ownerId: string
  name: string
  externalCode: string
  industry: string
  segment: string
  city: string
  state: string
  country: string
  health: string
  annualValue: number
  createdAt: string
  updatedAt: string

  owner?: {
    id: string
    name: string
    email: string
    role: string
  } | null

  _count?: {
    visits: number
    alerts: number
    intelligence: number
  }
}

function mapHealth(health: string): CustomerHealth {
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

function mapStatus(health: CustomerHealth): CustomerStatus {
  switch (health) {
    case 'critical':
    case 'at-risk':
      return 'at-risk'
    case 'healthy':
    case 'watch':
      return 'active'
    default:
      return 'active'
  }
}

function mapCustomerType(industry: string): CustomerType {
  const value = industry.toLowerCase()

  if (
    value.includes('distributor') ||
    value.includes('distribution')
  ) {
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

function mapCustomer(customer: ApiCustomer): Customer {
  const health = mapHealth(customer.health)

  return {
    id: customer.id,
    name: customer.name,
    type: mapCustomerType(customer.industry),

    status: mapStatus(health),
    health,

    territory: `${customer.city}, ${customer.state}`,
    city: customer.city,
    state: customer.state,

    ownerId: customer.ownerId,
    ownerName: customer.owner?.name ?? 'Unassigned',

    contact: {
      name: '',
      role: '',
      phone: '',
      email: '',
    },

    revenue: customer.annualValue ?? 0,
    annualOrderVolume: 0,
    pipelineValue: 0,

    sentimentScore: 0,
    sentimentTrend: 'stable',
    topics: [],
    competitors: [],

    riskCount: customer._count?.alerts ?? 0,
    opportunityCount: 0,

    lastVisitAt: '',
    nextVisitAt: undefined,
    totalVisits: customer._count?.visits ?? 0,
  }
}

export default function Customers() {
  const navigate = useNavigate()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [healthFilter, setHealthFilter] =
    useState<HealthFilter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadCustomers() {
      try {
        setLoading(true)
        setError(null)

        const response = await getCustomers<ApiCustomer[]>()

        if (!cancelled) {
          setCustomers(response.data.map(mapCustomer))
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load customers.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadCustomers()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.city.toLowerCase().includes(query) ||
        customer.ownerName.toLowerCase().includes(query) ||
        customer.territory.toLowerCase().includes(query)

      const matchesHealth =
        healthFilter === 'all' ||
        customer.health === healthFilter

      return matchesSearch && matchesHealth
    })
  }, [customers, search, healthFilter])

  const healthCounts = {
    all: customers.length,

    healthy: customers.filter(
      (customer) => customer.health === 'healthy',
    ).length,

    watch: customers.filter(
      (customer) => customer.health === 'watch',
    ).length,

    'at-risk': customers.filter(
      (customer) => customer.health === 'at-risk',
    ).length,

    critical: customers.filter(
      (customer) => customer.health === 'critical',
    ).length,
  }

  if (loading) {
    return (
      <div className="page customers-page">
        <div className="page-header">
          <div>
            <div className="eyebrow">FIELD OPERATIONS</div>
            <h1>Customers</h1>
            <p>
              Monitor customer health, relationship signals and
              commercial opportunities.
            </p>
          </div>
        </div>

        <div className="panel">
          <div className="customer-empty">
            <strong>Loading customer accounts...</strong>
            <span>
              Fetching the latest data from FieldVoice.
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page customers-page">
        <div className="page-header">
          <div>
            <div className="eyebrow">FIELD OPERATIONS</div>
            <h1>Customers</h1>
            <p>
              Monitor customer health, relationship signals and
              commercial opportunities.
            </p>
          </div>
        </div>

        <div className="panel">
          <div className="customer-empty">
            <strong>Unable to load customers</strong>
            <span>{error}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page customers-page">
      <div className="page-header">
        <div>
          <div className="eyebrow">FIELD OPERATIONS</div>
          <h1>Customers</h1>
          <p>
            Monitor customer health, relationship signals and
            commercial opportunities.
          </p>
        </div>

        <div className="page-header-meta">
          <strong>{customers.length}</strong>
          <span>accounts</span>
        </div>
      </div>

      <div className="customer-summary-grid">
        <button
          className={`customer-summary-card ${
            healthFilter === 'all' ? 'selected' : ''
          }`}
          onClick={() => setHealthFilter('all')}
        >
          <span>Total Customers</span>
          <strong>{healthCounts.all}</strong>
          <small>Active account base</small>
        </button>

        <button
          className={`customer-summary-card ${
            healthFilter === 'healthy' ? 'selected' : ''
          }`}
          onClick={() => setHealthFilter('healthy')}
        >
          <span>Healthy</span>
          <strong>{healthCounts.healthy}</strong>
          <small>Positive relationship</small>
        </button>

        <button
          className={`customer-summary-card ${
            healthFilter === 'watch' ? 'selected' : ''
          }`}
          onClick={() => setHealthFilter('watch')}
        >
          <span>Watch</span>
          <strong>{healthCounts.watch}</strong>
          <small>Needs attention</small>
        </button>

        <button
          className={`customer-summary-card ${
            healthFilter === 'at-risk' ? 'selected' : ''
          }`}
          onClick={() => setHealthFilter('at-risk')}
        >
          <span>At Risk</span>
          <strong>{healthCounts['at-risk']}</strong>
          <small>Commercial risk</small>
        </button>

        <button
          className={`customer-summary-card ${
            healthFilter === 'critical' ? 'selected' : ''
          }`}
          onClick={() => setHealthFilter('critical')}
        >
          <span>Critical</span>
          <strong>{healthCounts.critical}</strong>
          <small>Immediate action</small>
        </button>
      </div>

      <div className="customer-toolbar">
        <div className="customer-search">
          <span className="search-icon">⌕</span>

          <input
            type="search"
            placeholder="Search customers, territory or owner..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="customer-filter-label">
          Showing <strong>{filteredCustomers.length}</strong> of{' '}
          {customers.length}
        </div>
      </div>

      <CustomerTable
        customers={filteredCustomers}
        onCustomerClick={(customerId) =>
          navigate(`/customers/${customerId}`)
        }
      />
    </div>
  )
}
