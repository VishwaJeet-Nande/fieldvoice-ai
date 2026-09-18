import "./App.css";

import { Badge } from "./components/ui/Badge";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { StatusDot } from "./components/ui/StatusDot";

function App() {
  return (
    <main className="fv-showcase">
      <div className="fv-showcase-inner">
        <header>
          <p className="fv-eyebrow">FieldVoice AI</p>

          <h1>Enterprise field intelligence.</h1>

          <p className="fv-showcase-intro">
            A disciplined design foundation for turning field conversations
            into actionable business intelligence.
          </p>
        </header>

        <section className="fv-showcase-section">
          <h2>Buttons</h2>

          <div className="fv-showcase-row">
            <Button>View intelligence</Button>
            <Button variant="secondary">Secondary action</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="danger">Critical action</Button>
          </div>
        </section>

        <section className="fv-showcase-section">
          <h2>Business states</h2>

          <div className="fv-showcase-row">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="info">Processing</Badge>
            <Badge variant="success">Positive</Badge>
            <Badge variant="warning">Attention</Badge>
            <Badge variant="danger">Critical</Badge>
          </div>
        </section>

        <section className="fv-showcase-section">
          <h2>Activity status</h2>

          <div className="fv-showcase-row">
            <StatusDot status="success" label="Visit completed" />
            <StatusDot status="info" label="AI processing" />
            <StatusDot status="warning" label="Action required" />
            <StatusDot status="danger" label="Critical alert" />
          </div>
        </section>

        <section className="fv-showcase-section">
          <h2>Intelligence cards</h2>

          <div className="fv-showcase-grid">
            <Card>
              <p className="fv-card-title">Customer sentiment</p>
              <p className="fv-card-value">-0.45</p>
              <p className="fv-card-description">
                Declining over the last three visits
              </p>
            </Card>

            <Card>
              <p className="fv-card-title">At-risk customers</p>
              <p className="fv-card-value">12</p>
              <p className="fv-card-description">
                Requiring manager attention
              </p>
            </Card>

            <Card>
              <p className="fv-card-title">Competitive signals</p>
              <p className="fv-card-value">08</p>
              <p className="fv-card-description">
                Detected across today's visits
              </p>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
