import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { StatusDot } from "../components/ui/StatusDot";

const metrics = [
  ["Customer visits", "127", "+12.4%", "vs. previous period"],
  ["Voice intelligence", "98", "+18.2%", "notes captured today"],
  ["Average sentiment", "+0.31", "+0.08", "across active customers"],
  ["Critical alerts", "03", "2 new", "require attention"],
];

const activities = [
  ["Ravi Kulkarni", "completed a customer visit", "Sharma Enterprises", "2 min ago", "success"],
  ["Priya Shah", "submitted a voice note", "Metro Distributors", "6 min ago", "info"],
  ["FieldVoice AI", "detected competitive pricing pressure", "Sharma Enterprises", "8 min ago", "danger"],
  ["Arjun Mehta", "started a customer visit", "Patil Wholesale", "12 min ago", "warning"],
] as const;

export function Dashboard() {
  return (
    <div className="fv-page">
      <div className="fv-page-header">
        <div>
          <p className="fv-eyebrow">Executive overview</p>

          <h1>Field intelligence at a glance.</h1>

          <p>
            Monitor customer sentiment, field activity, risks and
            opportunities across your organization.
          </p>
        </div>

        <Badge variant="success">Live data</Badge>
      </div>

      <section className="fv-metric-grid">
        {metrics.map(([label, value, change, description]) => (
          <Card key={label}>
            <div className="fv-metric-label">{label}</div>

            <div className="fv-metric-main">
              <strong>{value}</strong>
              <Badge variant={label === "Critical alerts" ? "danger" : "success"}>
                {change}
              </Badge>
            </div>

            <div className="fv-metric-description">{description}</div>
          </Card>
        ))}
      </section>

      <section className="fv-dashboard-grid">
        <Card className="fv-dashboard-card">
          <div className="fv-section-heading">
            <div>
              <h2>Live activity</h2>
              <p>What is happening across the field right now.</p>
            </div>

            <Badge variant="info">Live</Badge>
          </div>

          <div className="fv-activity-list">
            {activities.map(([person, action, customer, time, status]) => (
              <div className="fv-activity-item" key={`${person}-${time}`}>
                <StatusDot status={status} />

                <div className="fv-activity-copy">
                  <p>
                    <strong>{person}</strong> {action}
                  </p>
                  <span>{customer}</span>
                </div>

                <time>{time}</time>
              </div>
            ))}
          </div>
        </Card>

        <Card className="fv-dashboard-card">
          <div className="fv-section-heading">
            <div>
              <h2>Customer sentiment</h2>
              <p>Current organization-wide trend.</p>
            </div>
          </div>

          <div className="fv-sentiment-placeholder">
            <div className="fv-sentiment-score">+0.31</div>
            <Badge variant="success">Improving</Badge>

            <div className="fv-chart-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="fv-chart-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Today</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="fv-dashboard-grid">
        <Card className="fv-dashboard-card">
          <div className="fv-section-heading">
            <div>
              <h2>Priority alerts</h2>
              <p>Signals requiring management attention.</p>
            </div>
          </div>

          <div className="fv-alert-list">
            <div className="fv-alert-item">
              <Badge variant="danger">Critical</Badge>
              <div>
                <strong>Competitive pricing pressure</strong>
                <span>Sharma Enterprises · 8 min ago</span>
              </div>
            </div>

            <div className="fv-alert-item">
              <Badge variant="warning">High</Badge>
              <div>
                <strong>Customer sentiment declining</strong>
                <span>Metro Distributors · 24 min ago</span>
              </div>
            </div>

            <div className="fv-alert-item">
              <Badge variant="info">Opportunity</Badge>
              <div>
                <strong>Volume expansion opportunity</strong>
                <span>Patil Wholesale · 42 min ago</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="fv-dashboard-card">
          <div className="fv-section-heading">
            <div>
              <h2>Field coverage</h2>
              <p>Representative activity today.</p>
            </div>
          </div>

          <div className="fv-coverage">
            <div>
              <strong>82%</strong>
              <span>visit completion</span>
            </div>

            <div className="fv-progress">
              <span style={{ width: "82%" }} />
            </div>

            <div className="fv-coverage-meta">
              <span>104 completed</span>
              <span>23 remaining</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
