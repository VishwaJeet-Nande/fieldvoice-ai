import type { Customer } from '@fieldvoice/types'
import { CustomerHealthBadge } from './CustomerHealthBadge'
import { SentimentIndicator } from './SentimentIndicator'

interface CustomerTableProps {
  customers: Customer[]
  onCustomerClick: (customerId: string) => void
}

const formatCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`
  }

  return `₹${value.toLocaleString('en-IN')}`
}

export function CustomerTable({
  customers,
  onCustomerClick,
}: CustomerTableProps) {
  return (
    <div className="customer-table-wrapper">
      <table className="customer-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Health</th>
            <th>Territory</th>
            <th>Owner</th>
            <th>Revenue</th>
            <th>Sentiment</th>
            <th>Risk</th>
            <th>Pipeline</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              onClick={() => onCustomerClick(customer.id)}
              className="customer-table-row"
            >
              <td>
                <div className="customer-name-cell">
                  <div className="customer-avatar">
                    {customer.name.charAt(0)}
                  </div>

                  <div>
                    <div className="customer-name">
                      {customer.name}
                    </div>

                    <div className="customer-type">
                      {customer.type}
                    </div>
                  </div>
                </div>
              </td>

              <td>
                <CustomerHealthBadge health={customer.health} />
              </td>

              <td>
                <span className="customer-territory">
                  {customer.territory}
                </span>
              </td>

              <td>
                <span className="customer-owner">
                  {customer.ownerName}
                </span>
              </td>

              <td>
                <strong>{formatCurrency(customer.revenue)}</strong>
              </td>

              <td>
                <SentimentIndicator
                  score={customer.sentimentScore}
                  trend={customer.sentimentTrend}
                  showTrend={false}
                />
              </td>

              <td>
                {customer.riskCount > 0 ? (
                  <span className="risk-count">
                    {customer.riskCount}
                  </span>
                ) : (
                  <span className="risk-none">—</span>
                )}
              </td>

              <td>
                <strong className="pipeline-value">
                  {formatCurrency(customer.pipelineValue)}
                </strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {customers.length === 0 && (
        <div className="customer-empty">
          <strong>No customers found</strong>
          <span>Try changing your search or filters.</span>
        </div>
      )}
    </div>
  )
}