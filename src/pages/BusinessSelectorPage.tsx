// src/pages/BusinessSelectorPage.tsx
import { Building2, CheckCircle2, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useBusinessStore } from "../stores/businessStore";
import { useT } from "../hooks/useT";
import simxelDark from "../assets/simxel_dark.svg";
import simxelLight from "../assets/simxel_light.svg";

const BusinessSelectorPage = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { owner, businesses, logout } = useAuthStore();
  const { selectBusiness, selectedBusinessId } = useBusinessStore();

  const handleSelect = (business: (typeof businesses)[0]) => {
    if (!business.isActivated) return;
    selectBusiness(business);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-base-300">
        <img src={simxelLight} alt="Simxel" className="h-7 block dark:hidden" />
        <img src={simxelDark} alt="Simxel" className="h-7 hidden dark:block" />
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm gap-2 opacity-60 hover:opacity-100"
        >
          <LogOut size={15} />
          {t("auth.logout")}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Greeting */}
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">
              {t("business.welcome")}
            </p>
            <h1 className="text-2xl font-black">
              {owner?.name ?? owner?.email}
            </h1>
            <p className="text-sm opacity-50 mt-1">
              {t("business.selectPrompt")}
            </p>
          </div>

          {/* Business list */}
          <div className="space-y-3">
            {businesses.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <p className="text-sm">No businesses found.</p>
              </div>
            ) : (
              businesses.map((business) => {
                const isSelected = business.id === selectedBusinessId;
                const isDisabled = !business.isActivated;

                return (
                  <button
                    key={business.id}
                    onClick={() => handleSelect(business)}
                    disabled={isDisabled}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left
                      ${isDisabled
                        ? "opacity-40 cursor-not-allowed border-base-300 bg-base-200"
                        : isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-base-300 bg-base-200 hover:border-primary/50 hover:bg-base-300/50"
                      }
                    `}
                  >
                    {/* Icon */}
                    <div className={`p-2.5 rounded-lg ${isSelected ? "bg-primary text-primary-content" : "bg-base-300"}`}>
                      <Building2 size={20} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-black truncate">{business.name}</p>
                      <p className="text-xs opacity-50 mt-0.5">
                        {business.type ?? "—"} · {business.currency}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isDisabled ? (
                        <span className="badge badge-warning badge-sm font-bold p-2 text-[10px]">
                          {t("business.notActivated")}
                        </span>
                      ) : isSelected ? (
                        <CheckCircle2 size={18} className="text-primary" />
                      ) : (
                        <ChevronRight size={18} className="opacity-30" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* M1 — Pending activation notice: shown when all businesses are not activated */}
          {businesses.length > 0 && businesses.every((b) => !b.isActivated) && (
            <div className="mt-6 p-4 rounded-xl border border-warning/30 bg-warning/5 text-center">
              <p className="text-sm font-bold opacity-70 mb-1">POS Not Activated Yet</p>
              <p className="text-xs opacity-50 leading-relaxed">
                Enter your Simxel License Key in the POS client to activate your business.
                Once activated, you can log in here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessSelectorPage;