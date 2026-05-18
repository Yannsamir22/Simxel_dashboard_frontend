// src/App.tsx
// FIX: Integrated UpdateBannerHost so UPDATE_BANNER notifications display inline
// FIX: useLogout hook used everywhere for atomic logout (clears both stores)
// SECURITY: Session check on mount now also clears businessStore on failure

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./components/Management/Dashboard";
import BottomNavbar from "./components/navigations/BottomNavbar";
import Navbar from "./components/navigations/Navbar";
import New from "./components/New";
import Report from "./components/Report";
import Sales from "./components/Sales";
import Settings from "./components/Settings";
import { UpdateBannerHost } from "./components/NotificationCenter";
import BusinessSelectorPage from "./pages/BusinessSelectorPage";
import LoginPage from "./pages/LoginPage";
import { AuthService } from "./services/authService";
import { useAuthStore } from "./stores/authStore";
import { useBusinessStore } from "./stores/businessStore";

export type TabKey = "Dashboard" | "Sales" | "New" | "Report" | "Settings";

import PendingActivationPage from "./pages/PendingActivationPage";
import SubscriptionGate from "./components/SubscriptionGate";

// Guard: requires login but does NOT require a selected business
const AuthOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// The main app shell
const AppShell = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("Dashboard");
  const { selectedBusiness, isDashboardExpired } = useBusinessStore();

  // INTERCEPT 1: If business is PENDING, show activation page instead of normal dashboard
  if (selectedBusiness && !selectedBusiness.isActivated && selectedBusiness.planType === "PENDING") {
    return <PendingActivationPage />;
  }

  // INTERCEPT 2: If dashboard is expired (via API 403 or local date check)
  const isLocallyExpired = selectedBusiness?.dashboardExpiresAt 
    ? new Date(selectedBusiness.dashboardExpiresAt).getTime() < Date.now()
    : false;

  if (isDashboardExpired || (selectedBusiness?.planType === "POS_DASHBOARD" && isLocallyExpired)) {
    return <SubscriptionGate />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": return <Dashboard />;
      case "Sales": return <Sales />;
      case "New": return <New />;
      case "Report": return <Report />;
      case "Settings": return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content">
      <Navbar />

      {/* FIX: Renders UPDATE_BANNER notifications as a dismissible banner below navbar */}
      {selectedBusiness && (
        <UpdateBannerHost businessId={String(selectedBusiness.id)} />
      )}

      <div className="mt-16 pb-20">{renderContent()}</div>

      <BottomNavbar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as TabKey)}
      />
    </div>
  );
};

function App() {
  const { isAuthenticated, logout } = useAuthStore();
  const { clearBusiness } = useBusinessStore();

  // Session check: verify stored token is still valid on every app load
  // SECURITY: also clears businessStore so no stale tenant data remains
  useEffect(() => {
    if (!isAuthenticated) return;
    AuthService.getMe().catch(() => {
      logout();
      clearBusiness();
      window.location.href = "/login";
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/select-business"
            element={
              <AuthOnlyRoute>
                <BusinessSelectorPage />
              </AuthOnlyRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;