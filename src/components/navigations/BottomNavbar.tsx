import {
  CircleDollarSign,
  LayoutDashboard,
  PlusSquare,
  Settings,
  Sheet,
} from "lucide-react";
import React from "react";
import { useT } from "../../hooks/useT";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNavbar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useT();

  // Keys match src/locales/*/translation.json -> "navbar.*"
  const menu = [
    { key: "Dashboard", label: t("navbar.dashboard"), icon: LayoutDashboard },
    { key: "Sales", label: t("navbar.sales"), icon: CircleDollarSign },
    { key: "New", label: t("navbar.new"), icon: PlusSquare, isCentered: true },
    { key: "Report", label: t("navbar.report"), icon: Sheet },
    { key: "Settings", label: t("navbar.settings"), icon: Settings },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50">
      <nav
        className="
          flex justify-between items-center
          px-6 py-2
          bg-base-100 border-t border-base-300
          w-full rounded-none
          sm:max-w-md sm:mx-auto
          sm:mb-4 sm:rounded-2xl sm:border sm:shadow-lg
        "
      >
        {menu.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                flex flex-col items-center justify-center
                flex-1 rounded-xl
                transition-all duration-200
                ${active ? "scale-105 text-primary font-semibold bg-primary/5" : "hover:text-primary hover:bg-base-200"}
              `}
            >
              {key === "New" ? (
                <Icon size={28} strokeWidth={2.5} />
              ) : (
                <Icon size={22} />
              )}
              <span className="text-xs font-semibold mt-1">{label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default BottomNavbar;
