import { Link, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Executive Overview', path: '/executive' },
  { label: 'Intelligence', path: '/executive/intelligence' },
  { label: 'Analytics', path: '/executive/analytics' },
]

export function ExecutiveLayout() {
  const location = useLocation()

  return (
    <div className="fv-app-shell fv-executive-shell">
      <aside className="fv-sidebar">
        <div className="fv-sidebar-brand">
          <div className="fv-brand-mark">F</div>
          <div>
            <div className="fv-brand-name">FieldVoice</div>
            <div className="fv-brand-role">EXECUTIVE INTELLIGENCE</div>
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
            <div className="fv-user-avatar">VN</div>
            <div>
              <strong>Vishwajeet Nande</strong>
              <span>Executive</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="fv-main-content">
        <header className="fv-topbar">
          <div>
            <span className="fv-topbar-eyebrow">EXECUTIVE INTELLIGENCE</span>
            <h1>FieldVoice AI</h1>
          </div>

          <div className="fv-topbar-status">
            <span className="fv-status-dot" />
            Live Intelligence
          </div>
        </header>

        <div className="fv-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
