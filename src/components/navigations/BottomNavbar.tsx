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

  const menu = [
    { key: "Dashboard", label: t("navbar.dashboard"), icon: LayoutDashboard },
    { key: "Sales", label: t("navbar.sales"), icon: CircleDollarSign },
    { key: "New", label: t("navbar.new"), icon: PlusSquare, isCentered: true },
    { key: "Report", label: t("navbar.report"), icon: Sheet },
    { key: "Settings", label: t("navbar.settings"), icon: Settings },
  ];

  return (
    <header>
      {/* Conteneur principal : 
          - Mobile : Fixé en bas, pleine largeur.
          - PC (lg) : Fixé à gauche, vertical, flottant.
      */}
      <nav
        className="
          fixed z-50
          /* Mobile Design */
          bottom-0 left-0 w-full 
          bg-base-100/80 backdrop-blur-xl border-t border-base-300
          flex justify-around items-center px-2 py-3
          
          /* Tablet/Desktop Design (Responsive) */
          lg:top-1/2 lg:-translate-y-1/2 lg:left-6 lg:bottom-auto
          lg:w-20 lg:h-auto lg:flex-col lg:gap-4 lg:py-8
          lg:rounded-3xl lg:border lg:shadow-2xl lg:bg-base-100
        "
      >
        {menu.map(({ key, label, icon: Icon, isCentered }) => {
          const active = activeTab === key;
          
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              aria-current={active ? "page" : undefined}
              className={`
                relative group flex flex-col lg:flex-row items-center justify-center
                transition-all duration-300 ease-in-out
                ${isCentered 
                    ? "lg:mb-4" // Espace supplémentaire pour le bouton 'New' sur PC
                    : "flex-1 lg:flex-none w-full"
                }
              `}
            >
              {/* Fond indicateur pour l'élément actif */}
              <div
                className={`
                  absolute inset-0 transition-opacity duration-300 rounded-2xl
                  ${active ? "bg-primary/10 opacity-100" : "opacity-0 group-hover:bg-base-200 group-hover:opacity-100"}
                  hidden lg:block lg:mx-2
                `}
              />

              <div className={`
                flex flex-col items-center z-10 p-2 rounded-xl
                transition-transform duration-200 active:scale-90
                ${active ? "text-primary" : "text-base-content/60 group-hover:text-primary"}
              `}>
                
                {/* Style spécifique pour le bouton central 'New' */}
                <div className={`
                    ${isCentered ? "bg-primary text-primary-content p-3 rounded-2xl shadow-lg -mt-8 lg:mt-0 lg:p-4 hover:rotate-90 transition-transform" : ""}
                `}>
                  <Icon 
                    size={isCentered ? 28 : 24} 
                    strokeWidth={active ? 2.5 : 2} 
                  />
                </div>

                {/* Label : Masqué sur PC pour un look minimaliste, ou affiché au survol */}
                <span className={`
                  text-[10px] lg:text-xs font-bold mt-1 tracking-tight
                  lg:absolute lg:left-20 lg:bg-base-800 lg:text-white lg:px-2 lg:py-1 
                  lg:rounded lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:pointer-events-none
                  lg:whitespace-nowrap lg:shadow-md
                `}>
                  {label}
                </span>

                {/* Petit point indicateur sous l'icône (Mobile seulement) */}
                {active && !isCentered && (
                  <span className="h-1 w-1 bg-primary rounded-full absolute bottom-0 lg:hidden" />
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default BottomNavbar;