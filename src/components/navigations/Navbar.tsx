// src/components/navigations/Navbar.tsx
import { ChevronRight, LogOut, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../hooks/useT";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../stores/authStore";
import { useBusinessStore } from "../../stores/businessStore";
import { SyncStatusBadge } from "../SyncStatusBadge";
import ToggleLanguage from "../toggles/ToggleLanguage";
import ToggleTheme from "../toggles/ToggleTheme";

// @ts-ignore
import logoLight from "../../assets/simxel_light.svg";
// @ts-ignore
import logoDark from "../../assets/simxel_dark.svg";
import { NotificationCenter } from "../NotificationCenter";

const Navbar: React.FC = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Logic to determine which logo to show
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const logo = isDark ? logoDark : logoLight;

  const [isOpen, setIsOpen] = useState(false);
  const { owner, logout } = useAuthStore();
  const { selectedBusiness, clearBusiness } = useBusinessStore();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    clearBusiness();
    navigate("/login");
  };

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <header className="fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 border-b border-base-200">
        <div className="container mx-auto h-16 w-full flex items-center justify-between px-4">
          {/* Left Side: Logo + Business Name */}
          <div className="flex items-center gap-3">
            <figure className="w-10 h-10 flex items-center justify-center">
              <img
                src={logo}
                alt="Simxel"
                className="object-contain max-h-full"
              />
            </figure>
            <span className="text-sm tracking-tighter uppercase font-black text-primary hidden xs:block">
              Simxel
            </span>

            {selectedBusiness && (
              <>
                <span className="opacity-20 text-lg font-thin hidden sm:block">
                  /
                </span>
                <span className="hidden sm:block text-xs font-black uppercase tracking-widest opacity-60 truncate max-w-[140px]">
                  {selectedBusiness.name}
                </span>
                <SyncStatusBadge businessId={String(selectedBusiness.id)} />
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {owner && (
              <div className="flex items-center gap-2 text-sm opacity-80 mr-2">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-8 h-8 items-center flex justify-center shadow-sm">
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
              {selectedBusiness && (
                <NotificationCenter businessId={String(selectedBusiness.id)} />
              )}
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm flex items-center gap-2 hover:bg-error/10 hover:text-error transition-all"
            >
              <LogOut size={15} />
              <span className="text-xs font-bold">{t("auth.logout")}</span>
            </button>
          </div>

          {/* Mobile Toggle Group */}
          <div className="md:hidden flex items-center gap-1">
            <ToggleTheme />
            {selectedBusiness && (
              <NotificationCenter businessId={String(selectedBusiness.id)} />
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-base-content hover:bg-base-200 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER - Placed outside header for correct Z-indexing */}
      <div
        className={`fixed inset-0 z-[9999] md:hidden transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop with Blur */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Aside Content */}
        <aside
          className={`absolute right-0 top-0 h-full w-[280px] sm:w-[320px] 
            bg-base-200 shadow-2xl flex flex-col
            transition-transform duration-300 ease-in-out transform
            ${isOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Header/Close in Drawer */}
          <div className="p-6 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-base-300 text-base-content/50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col h-full px-6 pb-8 gap-4 overflow-y-auto">
            {/* User Profile Card */}
            {owner && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-base-100 border border-primary/5 shadow-sm">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-sm font-black">
                      {(owner.name ?? owner.email)[0].toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-base-content truncate">
                    {owner.name ?? "—"}
                  </p>
                  <p className="text-xs text-base-content/40 truncate">
                    {owner.email}
                  </p>
                </div>
              </div>
            )}

            {/* Business Status Card */}
            {selectedBusiness && (
              <div className="p-4 rounded-2xl bg-base-100 border border-primary/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40">
                    Active Business
                  </span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/select-business");
                    }}
                    className="text-[10px] text-primary font-black uppercase tracking-wider hover:underline"
                  >
                    {t("settings.switchBusiness")}
                  </button>
                </div>
                <p className="text-sm font-bold truncate text-base-content italic">
                  {selectedBusiness.name}
                </p>
              </div>
            )}

            {/* Interface Settings */}
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-base-100 border border-primary/5">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40">
                  Language
                </span>
                <ToggleLanguage />
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-4 p-4 rounded-2xl bg-error/5 hover:bg-error/10 text-error transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-error/10 group-hover:bg-error/20">
                <LogOut size={18} />
              </div>
              <span className="font-bold text-sm">{t("auth.logout")}</span>
              <ChevronRight
                size={16}
                className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
