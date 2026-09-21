import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function ExecutiveLogin() {
  const navigate = useNavigate()

  function handleLogin() {
    navigate('/executive', { replace: true })
  }

  return (
    <main className="fv-login-page">
      <section className="fv-login-card">
        <div className="fv-login-brand">
          <div className="fv-brand-mark">F</div>
          <div>
            <strong>FieldVoice AI</strong>
            <span>Executive Intelligence</span>
          </div>
        </div>

        <div className="fv-login-copy">
          <span className="fv-topbar-eyebrow">EXECUTIVE INTELLIGENCE</span>
          <h1>Business intelligence, from the field.</h1>
          <p>
            See customer health, revenue opportunities, competitive pressure,
            and field intelligence across the organization.
          </p>
        </div>

        <div className="fv-login-profile">
          <div className="fv-user-avatar">VN</div>
          <div>
            <strong>Vishwajeet Nande</strong>
            <span>Executive</span>
          </div>
        </div>

        <Button type="button" onClick={handleLogin}>
          Enter Executive Intelligence
        </Button>
      </section>
    </main>
  )
}
