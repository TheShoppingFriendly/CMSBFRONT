import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Campaigns from "./pages/Campaigns";
import StoreCampaign from "./pages/StoreCampaign";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";

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

<Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
  <Route path="/users/:wp_user_id" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
