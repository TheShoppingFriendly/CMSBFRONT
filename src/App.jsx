import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useOutletContext, useParams } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import StoreCampaign from "./pages/StoreCampaign";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import Clicks from "./pages/Clicks";
import Conversions from "./pages/Conversions";
import FinancialOverview from "./pages/accounting/FinancialOverview";
import GlobalLedger from "./pages/accounting/GlobalLedger";
import RevenueAnalysis from "./pages/accounting/RevenueAnalysis";
import AdminAuditTrail from "./pages/accounting/AdminAuditTrail";
import Cashbacks from "./pages/Cashbacks";
import AdminProfile from "./pages/AdminProfile";

import ProtectedRoute from "./routes/ProtectedRoute";
import AccountingDashboard from "./pages/accounting/AccountingDashboard";
import CashbackHome from "./pages/CashbackHome";
import CashbackUserDetails from "./pages/CashbackUserDetails";

const UsersManager = () => {
  // Access the state shared from Dashboard's <Outlet context={...} />
  const { activeTab, setActiveTab, selectedUserId } = useOutletContext();

  // Determine which component to show based on the active tab
  if (activeTab === "user-details") {
    return (
      <UserDetails wp_user_id={selectedUserId} setActiveTab={setActiveTab} />
    );
  }

  return <Users />;
};

const CampaignsManager = () => {
  const { activeTab } = useOutletContext();
  const { storeSlug } = useParams();

  // If there is a storeSlug in the URL, we show the detail page
  if (storeSlug) {
    return <StoreCampaign />;
  }

  // Otherwise, show the main Campaigns list/add view
  return <Campaigns activeTab={activeTab} />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHomeRedirect />} />

            {/* 1. CUSTOMERS SECTION (General View Only) */}
            <Route path="users" element={<Users isSettlementMode={false} />} />
            {/* <Route path="users/:wp_user_id" element={<UserDetails isSettlementMode={false} />} /> */}
            <Route
              path="/dashboard/users/:wp_user_id"
              element={<UserDetails />}
            />

            {/* 2. CASHBACKS SECTION (Settlement & Accounting) */}
            {/* Cashback Module */}
            <Route path="cashbacks" element={<Cashbacks />}>
              {/* The default view: /dashboard/cashbacks */}
              <Route index element={<CashbackHome />} />

              {/* The User Management tab: /dashboard/cashbacks/users */}
              <Route path="users" element={<Users isSettlementMode={true} />} />

              {/* Unique User Detail: /dashboard/cashbacks/users/:wp_user_id */}
              <Route
                path="users/:wp_user_id"
                element={<CashbackUserDetails />}
              />

              {/* The Accounting tab: /dashboard/cashbacks/accounting */}
              <Route path="accounting" element={<AccountingDashboard />} />
            </Route>
            {/* Admin Modules */}
            <Route path="clicks" element={<Clicks />} />
            <Route path="conversions" element={<Conversions />} />
            <Route path="campaigns" element={<CampaignsManager />}>
              <Route path=":storeSlug" element={<StoreCampaign />} />
            </Route>

            {/* Accounting Direct Routes */}
            <Route path="accounting/audit" element={<AdminAuditTrail />} />
            <Route
              path="accounting/financial"
              element={<FinancialOverview />}
            />
            <Route path="accounting/ledger" element={<GlobalLedger />} />
            <Route path="accounting/revenue" element={<RevenueAnalysis />} />

            <Route path="admin-profile" element={<AdminProfile />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
/* Prevent blank render on /dashboard */
const DashboardHomeRedirect = () => {
  return null; // Dashboard already renders homepage internally
};

export default App;
