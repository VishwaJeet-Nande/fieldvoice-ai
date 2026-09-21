import { Link, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Today', path: '/rep' },
  { label: 'My Visits', path: '/rep/visits' },
]

export function RepLayout() {
  const location = useLocation()

  return (
    <div className="fv-app-shell fv-rep-shell">
      <aside className="fv-sidebar">
        <div className="fv-sidebar-brand">
          <div className="fv-brand-mark">F</div>
          <div>
            <div className="fv-brand-name">FieldVoice</div>
            <div className="fv-brand-role">FIELD REPRESENTATIVE</div>
          </div>
        </div>

        <nav className="fv-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`fv-sidebar-link ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="fv-sidebar-footer">
          <div className="fv-user-card">
            <div className="fv-user-avatar">RM</div>
            <div>
              <strong>Ravi Mehta</strong>
              <span>Field Representative</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="fv-main-content">
        <header className="fv-topbar">
          <div>
            <span className="fv-topbar-eyebrow">FIELD OPERATIONS</span>
            <h1>FieldVoice AI</h1>
          </div>

          <div className="fv-topbar-status">
            <span className="fv-status-dot" />
            Online
          </div>
        </header>

        <div className="fv-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
