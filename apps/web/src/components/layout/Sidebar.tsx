import { NavLink } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const sections = [
  {
    label: "Overview",
    items: [
      ["Dashboard", "/dashboard", "▦"],
      ["Live Activity", "/activity", "◉"],
    ],
  },
  {
    label: "Field Operations",
    items: [
      ["Field Team", "/team", "◎"],
      ["Live Map", "/map", "⌖"],
      ["Customers", "/customers", "◌"],
    ],
  },
  {
    label: "Intelligence",
    items: [
      ["Voice Intelligence", "/intelligence", "◖"],
      ["Sentiment", "/sentiment", "◒"],
      ["Competitors", "/competitors", "◇"],
    ],
  },
  {
    label: "Management",
    items: [
      ["Alerts", "/alerts", "!"],
      ["Pipeline", "/pipeline", "↗"],
      ["Analytics", "/analytics", "▥"],
    ],
  },
  {
    label: "System",
    items: [["Settings", "/settings", "⚙"]],
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <button
          className="fv-sidebar-overlay"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside className={`fv-sidebar ${open ? "is-open" : ""}`}>
        <div className="fv-brand">
          <div className="fv-brand-mark">F</div>

          <div>
            <div className="fv-brand-name">FieldVoice</div>
            <div className="fv-brand-label">Field Intelligence</div>
          </div>
        </div>

        <nav className="fv-navigation">
          {sections.map((section) => (
            <div className="fv-nav-section" key={section.label}>
              <div className="fv-nav-section-label">{section.label}</div>

              {section.items.map(([label, path, icon]) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `fv-nav-item ${isActive ? "is-active" : ""}`
                  }
                >
                  <span className="fv-nav-icon">{icon}</span>
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="fv-sidebar-footer">
          <div className="fv-demo-indicator">
            <span className="fv-demo-dot" />

            <div>
              <strong>Demo workspace</strong>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
