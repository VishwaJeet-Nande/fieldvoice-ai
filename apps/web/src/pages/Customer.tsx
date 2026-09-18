import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CustomerHealth } from '@fieldvoice/types'
import { CustomerTable } from '../components/customers/CustomerTable'
import { customers } from '../data/demo-data'

type HealthFilter = 'all' | CustomerHealth

export default function Customers() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [healthFilter, setHealthFilter] =
    useState<HealthFilter>('all')

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
  }, [search, healthFilter])

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