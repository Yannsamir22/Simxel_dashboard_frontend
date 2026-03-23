// src/components/navigations/Navbar.tsx
import { ChevronRight, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useBusinessStore } from "../../stores/businessStore";
import { useT } from "../../hooks/useT";
import ToggleLanguage from "../toggles/ToggleLanguage";
import ToggleTheme from "../toggles/ToggleTheme";
// @ts-ignore
import logoLight from "../../assets/simxel_light.svg";
// @ts-ignore
import logoDark from "../../assets/simxel_dark.svg";

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute("data-theme") === "simxel-dark"
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(
        document.documentElement.getAttribute("data-theme") === "simxel-dark"
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

const Navbar: React.FC = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const isDark = useIsDark();
  const logo = isDark ? logoDark : logoLight;

  const [isOpen, setIsOpen] = useState(false);

  const { owner, logout } = useAuthStore();
  const { selectedBusiness, clearBusiness } = useBusinessStore();

  const handleLogout = () => {
    logout();
    clearBusiness();
    navigate("/login");
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  return (
    <header className="fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 border-b border-base-200">
      <div className="container mx-auto h-16 w-full flex items-center justify-between px-4">

        {/* Logo + business name */}
        <div className="flex items-center gap-3">
          <figure className="w-30 flex items-center">
            <img src={logo} alt="Simxel" className="h-7 object-contain" />
          </figure>
          {selectedBusiness && (
            <>
              <span className="opacity-20 text-lg font-thin hidden sm:block">/</span>
              <span className="hidden sm:block text-xs font-black uppercase tracking-widest opacity-60 truncate max-w-[140px]">
                {selectedBusiness.name}
              </span>
            </>
          )}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {owner && (
            <div className="flex items-center gap-2 text-sm opacity-60 mr-1">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-7">
                  <span className="text-xs font-black">
                    {(owner.name ?? owner.email)[0].toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="font-bold hidden lg:block">
                {owner.name ?? owner.email}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 border-l pl-3 border-base-300">
            <ToggleLanguage />
            <ToggleTheme />
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm flex items-center gap-2 hover:bg-error/10 hover:text-error transition-all"
          >
            <LogOut size={15} />
            <span className="text-xs">{t("auth.logout")}</span>
          </button>
        </div>

        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-1">
          <ToggleTheme />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 transition-all"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <aside
            className={`absolute right-0 top-0 h-full w-[230px] bg-base-200 shadow-2xl p-4 pt-6 transition-transform duration-300 ease-in-out transform ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full mt-10 gap-2">
              {/* Owner info */}
              {owner && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-base-300 mb-2">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-9">
                      <span className="text-sm font-black">
                        {(owner.name ?? owner.email)[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm truncate">
                      {owner.name ?? "—"}
                    </p>
                    <p className="text-xs opacity-40 truncate">{owner.email}</p>
                  </div>
                </div>
              )}

              {/* Business name */}
              {selectedBusiness && (
                <div className="px-3 py-2 rounded-xl bg-base-300 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-50">
                    {selectedBusiness.name}
                  </span>
                  <button
                    onClick={() => { setIsOpen(false); navigate("/select-business"); }}
                    className="text-xs text-primary font-bold"
                  >
                    {t("settings.switchBusiness")}
                  </button>
                </div>
              )}

              {/* Language */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-base-300">
                <span className="text-xs font-bold uppercase tracking-widest opacity-50">
                  Language
                </span>
                <ToggleLanguage />
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 p-3 rounded-xl hover:bg-error/10 text-error transition-colors"
              >
                <LogOut size={18} />
                <span className="font-bold text-sm">{t("auth.logout")}</span>
                <ChevronRight size={16} className="ml-auto opacity-30" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
};

export default Navbar;