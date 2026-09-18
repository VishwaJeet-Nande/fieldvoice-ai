import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { Dashboard } from "../pages/Dashboard";
import { PlaceholderPage } from "../pages/PlaceholderPage";

const pages = [
  {
    path: "/activity",
    eyebrow: "Operations",
    title: "Live Activity",
    description: "Follow field activity and intelligence as it happens.",
  },
  {
    path: "/team",
    eyebrow: "Field Operations",
    title: "Field Team",
    description: "Monitor representatives, visits and territory coverage.",
  },
  {
    path: "/map",
    eyebrow: "Field Operations",
    title: "Live Map",
    description: "Explore representatives, customers and field activity geographically.",
  },
  {
    path: "/customers",
    eyebrow: "Field Operations",
    title: "Customers",
    description: "Explore customer relationships and intelligence profiles.",
  },
  {
    path: "/intelligence",
    eyebrow: "Intelligence",
    title: "Voice Intelligence",
    description: "Turn field conversations into structured business signals.",
  },
  {
    path: "/sentiment",
    eyebrow: "Intelligence",
    title: "Sentiment",
    description: "Understand how customer sentiment changes across visits.",
  },
  {
    path: "/competitors",
    eyebrow: "Intelligence",
    title: "Competitor Intelligence",
    description: "Track competitor mentions, pricing pressure and market signals.",
  },
  {
    path: "/alerts",
    eyebrow: "Management",
    title: "Alerts",
    description: "Review risks, opportunities and signals requiring action.",
  },
  {
    path: "/pipeline",
    eyebrow: "Management",
    title: "Lead Pipeline",
    description: "Track opportunities generated from field intelligence.",
  },
  {
    path: "/analytics",
    eyebrow: "Management",
    title: "Analytics",
    description: "Analyze field performance, customer trends and business signals.",
  },
  {
    path: "/settings",
    eyebrow: "System",
    title: "Settings",
    description: "Manage your FieldVoice workspace configuration.",
  },
];

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {pages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={<PlaceholderPage {...page} />}
          />
        ))}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
