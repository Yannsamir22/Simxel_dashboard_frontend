// src/components/auth/ProtectedRoute.tsx
// SECURITY: Added token expiry check — expired sessions redirect to login
// SECURITY: Both isAuthenticated AND selectedBusinessId required for dashboard access

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useBusinessStore } from "../../stores/businessStore";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
    const { isAuthenticated, isTokenExpired } = useAuthStore();
    const { selectedBusinessId } = useBusinessStore();

    // Not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Token has expired (only relevant if backend returned expiresIn)
    // The axios interceptor handles the refresh attempt — if that failed,
    // the store will already be cleared. This is an additional local guard.
    if (isTokenExpired()) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but no business selected
    if (!selectedBusinessId) {
        return <Navigate to="/select-business" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;