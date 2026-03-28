// src/pages/LoginPage.tsx
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import { useBusinessStore } from "../stores/businessStore";
import simxelDark from "../assets/simxel_dark.svg";
import simxelLight from "../assets/simxel_light.svg";
import ToggleTheme from "../components/toggles/ToggleTheme";
import ToggleLanguage from "../components/toggles/ToggleLanguage";
import { useT } from "../hooks/useT";

const LoginPage = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  // ✅ select the ACTION (function), not the state (object)
  const selectBusiness = useBusinessStore((s) => s.selectBusiness);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await AuthService.login(email.trim(), password);

      if (!res.ok) {
        setError(res.error ?? "Login failed.");
        return;
      }

      setAuth(res.token, res.owner, res.businesses);

      const activated = res.businesses.filter(
        (b: { isActivated: boolean }) => b.isActivated
      );

      if (activated.length === 0) {
        // M2: No activated businesses — navigate to selector which shows the activation notice
        navigate("/select-business");
      } else if (activated.length === 1) {
        // Only one activated business — skip selector
        selectBusiness(activated[0]);
        navigate("/dashboard");
      } else {
        // Multiple activated businesses — let user pick
        navigate("/select-business");
      }
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Top bar */}
      <div className="flex justify-end items-center gap-2 p-4">
        <ToggleLanguage />
        <ToggleTheme />
      </div>

      {/* Center card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={simxelLight} alt="Simxel" className="h-10 block dark:hidden" />
            <img src={simxelDark}  alt="Simxel" className="h-10 hidden dark:block" />
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-black tracking-tight">
              {t("auth.welcomeBack")}
            </h1>
            <p className="text-sm opacity-50 mt-1">
              {t("auth.loginSubtitle")}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error mb-4 text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs font-bold uppercase tracking-widest opacity-60">
                  {t("auth.email")}
                </span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="owner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs font-bold uppercase tracking-widest opacity-60">
                  {t("auth.password")}
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                t("auth.login")
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs opacity-30 pb-6">
        Simxel Cloud Dashboard
      </p>
    </div>
  );
};

export default LoginPage;