import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { Alerts } from '../pages/Alerts'
import { Customers } from '../pages/Customers'
import { CustomerDetails } from '../pages/CustomerDetails'
import { Dashboard } from '../pages/Dashboard'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { VoiceIntelligence } from '../pages/VoiceIntelligence'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/customers" element={<Customers />} />

        <Route
          path="/customers/:customerId"
          element={<CustomerDetails />}
        />

        <Route
          path="/activity"
          element={
            <PlaceholderPage
              eyebrow="FIELD OPERATIONS"
              title="Live Activity"
              description="Monitor field visits, voice submissions, and real-time team activity."
            />
          }
        />

        <Route
          path="/team"
          element={
            <PlaceholderPage
              eyebrow="FIELD OPERATIONS"
              title="Field Team"
              description="Track field representatives, visit coverage, and team performance."
            />
          }
        />

        <Route
          path="/map"
          element={
            <PlaceholderPage
              eyebrow="FIELD OPERATIONS"
              title="Live Map"
              description="View field activity and customer coverage across the territory."
            />
          }
        />

        <Route
          path="/intelligence"
          element={<VoiceIntelligence />}
        />

        <Route
          path="/sentiment"
          element={
            <PlaceholderPage
              eyebrow="INTELLIGENCE"
              title="Sentiment Analytics"
              description="Analyze customer sentiment trends across visits and territories."
            />
          }
        />

        <Route
          path="/competitors"
          element={
            <PlaceholderPage
              eyebrow="INTELLIGENCE"
              title="Competitor Intelligence"
              description="Track competitor mentions, pricing pressure, and competitive threats."
            />
          }
        />

        <Route path="/alerts" element={<Alerts />} />

        <Route
          path="/pipeline"
          element={
            <PlaceholderPage
              eyebrow="MANAGEMENT"
              title="Lead Pipeline"
              description="Track opportunities, follow-ups, and revenue potential across customers."
            />
          }
        />

        <Route
          path="/analytics"
          element={
            <PlaceholderPage
              eyebrow="MANAGEMENT"
              title="Reports & Analytics"
              description="Review performance trends and business intelligence across the field."
            />
          }
        />

        <Route
          path="/settings"
          element={
            <PlaceholderPage
              eyebrow="SYSTEM"
              title="Settings"
              description="Configure FieldVoice AI workspace preferences and system settings."
            />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Route>
    </Routes>
  )
}