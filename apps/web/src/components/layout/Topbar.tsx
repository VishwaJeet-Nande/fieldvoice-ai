interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="fv-topbar">
      <button
        className="fv-mobile-menu"
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        ☰
      </button>

      <div className="fv-topbar-context">
        <span className="fv-topbar-org">Apex Consumer Products</span>
        <span className="fv-topbar-divider">/</span>
        <span>West Region</span>
      </div>

      <div className="fv-topbar-actions">
        <button className="fv-topbar-search" type="button">
          <span>⌕</span>
          <span>Search</span>
          <kbd>⌘ K</kbd>
        </button>

        <button
          className="fv-icon-button"
          type="button"
          aria-label="Notifications"
        >
          ◔
          <span className="fv-notification-dot" />
        </button>

        <button className="fv-user-menu" type="button">
          <span className="fv-avatar">VN</span>

          <span className="fv-user-info">
            <strong>Vishwajeet</strong>
            <small>Administrator</small>
          </span>

          <span className="fv-chevron">⌄</span>
        </button>
      </div>
    </header>
  );
}
