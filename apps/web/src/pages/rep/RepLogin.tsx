import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function RepLogin() {
  const navigate = useNavigate()

  function handleLogin() {
    navigate('/rep', { replace: true })
  }

  return (
    <main className="fv-login-page">
      <section className="fv-login-card">
        <div className="fv-login-brand">
          <div className="fv-brand-mark">F</div>
          <div>
            <strong>FieldVoice AI</strong>
            <span>Field Representative</span>
          </div>
        </div>

        <div className="fv-login-copy">
          <span className="fv-topbar-eyebrow">FIELD OPERATIONS</span>
          <h1>Welcome back, Ravi</h1>
          <p>
            Capture every field conversation and turn it into actionable
            customer intelligence.
          </p>
        </div>

        <div className="fv-login-profile">
          <div className="fv-user-avatar">RM</div>
          <div>
            <strong>Ravi Mehta</strong>
            <span>Field Representative</span>
          </div>
        </div>

        <Button type="button" onClick={handleLogin}>
          Enter FieldVoice
        </Button>
      </section>
    </main>
  )
}
