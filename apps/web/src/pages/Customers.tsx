import { Link, useNavigate } from 'react-router-dom'
import { CustomerTable } from '../components/customers/CustomerTable'
import { customers } from '../data/demo-data'

export function Customers() {
  const navigate = useNavigate()

  const activeCustomers = customers.filter(
    (customer) => customer.status === 'active',
  )

  const atRiskCustomers = customers.filter(
    (customer) =>
      customer.health === 'at-risk' || customer.health === 'critical',
  )

  const totalPipeline = customers.reduce(
    (total, customer) => total + customer.pipelineValue,
    0,
  )

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`)
  }

  return (
    <div className="page customers-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">CUSTOMER INTELLIGENCE</span>

          <h1 className="page-title">Customers</h1>

          <p className="page-description">
            Monitor customer health, sentiment, field activity, and business
            opportunities from one intelligence layer.
          </p>
        </div>
      </div>

      <section className="customer-summary-grid">
        <article className="customer-summary-card">
          <span className="customer-summary-label">Total Customers</span>

          <strong>{customers.length}</strong>

          <span className="customer-summary-meta">
            Across the West Region
          </span>
        </article>

        <article className="customer-summary-card">
          <span className="customer-summary-label">Active Accounts</span>

          <strong>{activeCustomers.length}</strong>

          <span className="customer-summary-meta">
            Currently managed accounts
          </span>
        </article>

        <article className="customer-summary-card">
          <span className="customer-summary-label">At-Risk Accounts</span>

          <strong>{atRiskCustomers.length}</strong>

          <span className="customer-summary-meta">
            Requiring field attention
          </span>
        </article>

        <article className="customer-summary-card">
          <span className="customer-summary-label">Pipeline Value</span>

          <strong>₹{totalPipeline.toLocaleString('en-IN')}</strong>

          <span className="customer-summary-meta">
            Combined active opportunity value
          </span>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">ACCOUNT DIRECTORY</span>

            <h2 className="panel-title">Customer Accounts</h2>
          </div>

          <span className="panel-count">{customers.length}</span>
        </div>

        <CustomerTable
          customers={customers}
          onCustomerClick={handleCustomerClick}
        />
      </section>

      <section className="customer-quick-links">
        <Link to="/intelligence" className="customer-quick-link">
          <span>
            <strong>Voice Intelligence</strong>
            <small>Explore AI-generated customer signals</small>
          </span>

          <span>→</span>
        </Link>

        <Link to="/alerts" className="customer-quick-link">
          <span>
            <strong>Alerts Center</strong>
            <small>Review customer risks and opportunities</small>
          </span>

          <span>→</span>
        </Link>

        <Link to="/pipeline" className="customer-quick-link">
          <span>
            <strong>Lead Pipeline</strong>
            <small>Track revenue opportunities</small>
          </span>

          <span>→</span>
        </Link>
      </section>
    </div>
  )
}