

import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import { useBusinessStore } from "../stores/businessStore";

export function useLogout() {
    const navigate = useNavigate();
    const { refreshToken, logout } = useAuthStore();
    const { clearBusiness } = useBusinessStore();

    return async () => {
        // 1. Invalidate the refresh token server-side (best-effort)
        if (refreshToken) {
            await AuthService.logout(refreshToken).catch(() => {
                // Ignore — local logout proceeds regardless
            });
        }

        // 2. Clear local auth state
        logout();

        // 3. Clear selected business
        clearBusiness();

        // 4. Redirect to login
        navigate("/login", { replace: true });
    };
}