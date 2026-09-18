import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="fv-app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="fv-main">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="fv-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
