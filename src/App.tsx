
import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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

export type TabKey = "Dashboard" | "Sales" | "New" | "Report" | "Settings";

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
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Auth required, no business selection needed yet */}
        <Route path="/select-business" element={<BusinessSelectorPage />} />

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
  );
}

export default App;