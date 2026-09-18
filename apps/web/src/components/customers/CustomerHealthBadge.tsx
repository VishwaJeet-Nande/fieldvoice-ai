import type { CustomerHealth } from '@fieldvoice/types'

interface CustomerHealthBadgeProps {
  health: CustomerHealth
}

const labels: Record<CustomerHealth, string> = {
  healthy: 'Healthy',
  watch: 'Watch',
  'at-risk': 'At Risk',
  critical: 'Critical',
}

export function CustomerHealthBadge({
  health,
}: CustomerHealthBadgeProps) {
  return (
    <span className={`customer-health customer-health-${health}`}>
      <span className="customer-health-dot" />
      {labels[health]}
    </span>
  )
}