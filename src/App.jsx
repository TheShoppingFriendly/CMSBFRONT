import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Campaigns from "./pages/Campaigns";
import StoreCampaign from "./pages/StoreCampaign";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
// Accounting
import FinancialOverview from "./pages/accounting/FinancialOverview";
import GlobalLedger from "./pages/accounting/GlobalLedger";
import RevenueAnalysis from "./pages/accounting/RevenueAnalysis";
import AdminAuditTrail from "./pages/accounting/AdminAuditTrail";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
    <Routes>
  <Route path="/" element={<Login />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route path="/campaigns" element={<Campaigns />} />
  <Route path="/campaigns/:storeSlug" element={<StoreCampaign />} />

  <Route
    path="/users"
    element={
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    }
  />

  <Route
    path="/users/:wp_user_id"
    element={
      <ProtectedRoute>
        <UserDetails />
      </ProtectedRoute>
    }
  />

  {/* ===================== */}
  {/* ACCOUNTING ROUTES */}
  {/* ===================== */}

  <Route
    path="/accounting/overview"
    element={
      <ProtectedRoute>
        <FinancialOverview />
      </ProtectedRoute>
    }
  />

  <Route
    path="/accounting/ledger"
    element={
      <ProtectedRoute>
        <GlobalLedger />
      </ProtectedRoute>
    }
  />

  <Route
    path="/accounting/revenue"
    element={
      <ProtectedRoute>
        <RevenueAnalysis />
      </ProtectedRoute>
    }
  />

  <Route
    path="/accounting/audit"
    element={
      <ProtectedRoute>
        <AdminAuditTrail />
      </ProtectedRoute>
    }
  />
</Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
