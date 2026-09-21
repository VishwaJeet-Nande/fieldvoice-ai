import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '../layouts/AppLayout'
import { RepLayout } from '../layouts/rep/RepLayout'
import { ManagerLayout } from '../layouts/manager/ManagerLayout'
import { ExecutiveLayout } from '../layouts/executive/ExecutiveLayout'

import { Alerts } from '../pages/Alerts'
import { CustomerDetails } from '../pages/CustomerDetails'
import Customers from '../pages/Customers'
import { Dashboard } from '../pages/Dashboard'
import { LiveActivity } from '../pages/LiveActivity'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { VoiceCapture } from '../pages/VoiceCapture'
import { VoiceIntelligence } from '../pages/VoiceIntelligence'

import { RepLogin } from '../pages/rep/RepLogin'
import { ManagerLogin } from '../pages/manager/ManagerLogin'
import { ExecutiveLogin } from '../pages/executive/ExecutiveLogin'

function RepHome() {
  return (
    <PlaceholderPage
      eyebrow="FIELD OPERATIONS"
      title="Today's Visits"
      description="Your customer visits, field activities, and follow-ups for today."
    />
  )
}

function RepVisits() {
  return (
    <PlaceholderPage
      eyebrow="FIELD OPERATIONS"
      title="My Visits"
      description="View scheduled customer visits and capture field intelligence."
    />
  )
}

function RepCustomer() {
  return (
    <PlaceholderPage
      eyebrow="CUSTOMER"
      title="Customer Visit"
      description="Review customer information, check in, and capture the conversation."
    />
  )
}

function ManagerHome() {
  return <Dashboard />
}

function ManagerCustomers() {
  return <Customers />
}

function ManagerCustomerDetails() {
  return <CustomerDetails />
}

function ManagerActivity() {
  return <LiveActivity />
}

function ManagerAlerts() {
  return <Alerts />
}

function ExecutiveHome() {
  return <Dashboard />
}

function ExecutiveIntelligence() {
  return <VoiceIntelligence />
}

function ExecutiveAnalytics() {
  return (
    <PlaceholderPage
      eyebrow="EXECUTIVE INTELLIGENCE"
      title="Business Analytics"
      description="Review organization-wide customer, sentiment, opportunity, and field performance."
    />
  )
}

export function AppRoutes() {
  return (
    <Routes>
      {/* -------------------------------------------------- */}
      {/* FIELD REPRESENTATIVE                               */}
      {/* -------------------------------------------------- */}

      <Route path="/rep/login" element={<RepLogin />} />

      <Route element={<RepLayout />}>
        <Route path="/rep" element={<RepHome />} />
        <Route path="/rep/visits" element={<RepVisits />} />
        <Route
          path="/rep/customers/:customerId"
          element={<RepCustomer />}
        />
        <Route
          path="/rep/visits/:visitId/voice"
          element={<VoiceCapture />}
        />
      </Route>

      {/* -------------------------------------------------- */}
      {/* MANAGER                                            */}
      {/* -------------------------------------------------- */}

      <Route path="/manager/login" element={<ManagerLogin />} />

      <Route element={<ManagerLayout />}>
        <Route path="/manager" element={<ManagerHome />} />
        <Route path="/manager/customers" element={<ManagerCustomers />} />
        <Route
          path="/manager/customers/:customerId"
          element={<ManagerCustomerDetails />}
        />
        <Route path="/manager/activity" element={<ManagerActivity />} />
        <Route path="/manager/alerts" element={<ManagerAlerts />} />
      </Route>

      {/* -------------------------------------------------- */}
      {/* EXECUTIVE                                          */}
      {/* -------------------------------------------------- */}

      <Route path="/executive/login" element={<ExecutiveLogin />} />

      <Route element={<ExecutiveLayout />}>
        <Route path="/executive" element={<ExecutiveHome />} />
        <Route
          path="/executive/intelligence"
          element={<ExecutiveIntelligence />}
        />
        <Route
          path="/executive/analytics"
          element={<ExecutiveAnalytics />}
        />
      </Route>

      {/* -------------------------------------------------- */}
      {/* EXISTING MANAGEMENT APP                            */}
      {/* -------------------------------------------------- */}

      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/manager" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route
          path="/customers/:customerId"
          element={<CustomerDetails />}
        />
        <Route path="/activity" element={<LiveActivity />} />
        <Route path="/team" element={<PlaceholderPage
          eyebrow="FIELD OPERATIONS"
          title="Field Team"
          description="Track field representatives, visit coverage, and team performance."
        />} />
        <Route path="/map" element={<PlaceholderPage
          eyebrow="FIELD OPERATIONS"
          title="Live Map"
          description="View field activity and customer coverage across the territory."
        />} />
        <Route path="/intelligence" element={<VoiceIntelligence />} />
        <Route path="/sentiment" element={<PlaceholderPage
          eyebrow="INTELLIGENCE"
          title="Sentiment Analytics"
          description="Analyze customer sentiment trends across visits and territories."
        />} />
        <Route path="/competitors" element={<PlaceholderPage
          eyebrow="INTELLIGENCE"
          title="Competitor Intelligence"
          description="Track competitor mentions, pricing pressure, and competitive threats."
        />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/pipeline" element={<PlaceholderPage
          eyebrow="MANAGEMENT"
          title="Lead Pipeline"
          description="Track opportunities, follow-ups, and revenue potential across customers."
        />} />
        <Route path="/analytics" element={<PlaceholderPage
          eyebrow="MANAGEMENT"
          title="Reports & Analytics"
          description="Review performance trends and business intelligence across the field."
        />} />
        <Route path="/settings" element={<PlaceholderPage
          eyebrow="SYSTEM"
          title="Settings"
          description="Configure FieldVoice AI workspace preferences and system settings."
        />} />

        <Route path="*" element={<Navigate to="/manager" replace />} />
      </Route>
    </Routes>
  )
}
