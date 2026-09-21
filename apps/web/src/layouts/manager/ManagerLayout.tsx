import { Link, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Overview', path: '/manager' },
  { label: 'Customers', path: '/manager/customers' },
  { label: 'Live Activity', path: '/manager/activity' },
  { label: 'Alerts', path: '/manager/alerts' },
]

export function ManagerLayout() {
  const location = useLocation()

  return (
    <div className="fv-app-shell fv-manager-shell">
      <aside className="fv-sidebar">
        <div className="fv-sidebar-brand">
          <div className="fv-brand-mark">F</div>
          <div>
            <div className="fv-brand-name">FieldVoice</div>
            <div className="fv-brand-role">MANAGER CONSOLE</div>
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
            <div className="fv-user-avatar">AS</div>
            <div>
              <strong>Ananya Sharma</strong>
              <span>Sales Manager</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="fv-main-content">
        <header className="fv-topbar">
          <div>
            <span className="fv-topbar-eyebrow">MANAGEMENT</span>
            <h1>FieldVoice AI</h1>
          </div>

          <div className="fv-topbar-status">
            <span className="fv-status-dot" />
            Live
          </div>
        </header>

        <div className="fv-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
