import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function ManagerLogin() {
  const navigate = useNavigate()

  function handleLogin() {
    navigate('/manager', { replace: true })
  }

  return (
    <main className="fv-login-page">
      <section className="fv-login-card">
        <div className="fv-login-brand">
          <div className="fv-brand-mark">F</div>
          <div>
            <strong>FieldVoice AI</strong>
            <span>Manager Console</span>
          </div>
        </div>

        <div className="fv-login-copy">
          <span className="fv-topbar-eyebrow">MANAGEMENT</span>
          <h1>Welcome back, Ananya</h1>
          <p>
            Monitor field activity, customer sentiment, risks, opportunities,
            and follow-ups across your team.
          </p>
        </div>

        <div className="fv-login-profile">
          <div className="fv-user-avatar">AS</div>
          <div>
            <strong>Ananya Sharma</strong>
            <span>Sales Manager</span>
          </div>
        </div>

        <Button type="button" onClick={handleLogin}>
          Enter Manager Console
        </Button>
      </section>
    </main>
  )
}
