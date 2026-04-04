
import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BottomNavbar from "./components/navigations/BottomNavbar";
import Navbar from "./components/navigations/Navbar";
import Dashboard from "./components/Management/Dashboard";
import New from "./components/New";
import Report from "./components/Report";
import Sales from "./components/Sales";
import Settings from "./components/Settings";
import LoginPage from "./pages/LoginPage";
import BusinessSelectorPage from "./pages/BusinessSelectorPage";
import { useAuthStore } from "./stores/authStore";
import { AuthService } from "./services/authService";

export type TabKey = "Dashboard" | "Sales" | "New" | "Report" | "Settings";

// Guard: requires login but does NOT require a selected business
// (used for the business selector page itself — M5 fix)
const AuthOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// The main app shell — wraps all authenticated content
const AppShell = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": return <Dashboard />;
      case "Sales":     return <Sales />;
      case "New":       return <New />;
      case "Report":    return <Report />;
      case "Settings":  return <Settings />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content">
      <Navbar />
      <div className="mt-16 pb-20">
        {renderContent()}
      </div>
      <BottomNavbar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as TabKey)}
      />
    </div>
  );
};

function App() {
  const { isAuthenticated, logout } = useAuthStore();

  // M6 — Session check: verify stored token is still valid on every app load
  useEffect(() => {
    if (!isAuthenticated) return;
    AuthService.getMe().catch(() => {
      // Token is expired or invalid — clear session and redirect to login
      logout();
      window.location.href = "/login";
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Auth required, but no business selection needed yet — M5 fix */}
          <Route
            path="/select-business"
            element={
              <AuthOnlyRoute>
                <BusinessSelectorPage />
              </AuthOnlyRoute>
            }
          />

          {/* Fully protected — needs auth + selected business */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />

          {/* Catch-all → dashboard (ProtectedRoute will redirect to login if needed) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
