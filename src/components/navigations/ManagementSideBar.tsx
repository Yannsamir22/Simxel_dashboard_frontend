import {
  HeartHandshake,
  Package,
  Receipt,
  ShoppingBag,
  UserCog2Icon,
} from "lucide-react";
import React from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ManagementSidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const menu = [
    { name: "Packages", icon: Package },
    { name: "Services", icon: HeartHandshake },
    { name: "Products", icon: ShoppingBag },
    { name: "Employees", icon: UserCog2Icon },
    { name: "Expenses", icon: Receipt },
  ];

  return (
    <aside
      className="
        /* Mobile: Floating rounded card above bottom navbar */
        fixed bottom-22 left-0 right-0 z-40
        flex flex-col items-center
        bg-base-100/95 backdrop-blur-md overflow-hidden
        border border-base-300/85 shadow-[0_8px_30px_rgb(0,0,0,0.42)]
        py-2 px-3
        
        /* Desktop: Vertical fixed panel */
        md:fixed md:right-0 md:top-1/2 md:-translate-y-1/2 md:z-40
        md:bottom-auto md:left-auto md:w-auto md:border-l md:border-y md:border-base-300
        md:rounded-l-3xl md:shadow-2xl
        md:py-6 md:px-2 md:space-y-6 md:mb-0 md:border-t-0 md:border-x-0 md:rounded-r-none md:shadow-none
        transition-all duration-300 ease-in-out
      "
    >
      {/* Tunnel Connector to Bottom Navbar (Mobile Only) */}
      <div className="absolute top-[calc(100%-1.5px)] left-1/2 -translate-x-1/2 w-[120px] h-[24px] pointer-events-none md:hidden z-[-1]">
        <svg
          width="120"
          height="24"
          viewBox="0 0 120 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Seamless Tunnel Body */}
          <path
            d="M 0,0 H 120 C 105,0 100,24 85,24 H 35 C 20,24 15,0 0,0 Z"
            fill="var(--color-base-100)"
            fillOpacity="0.95"
          />
          {/* Left Curve Border */}
          <path
            d="M 0,0 C 15,0 20,24 35,24"
            stroke="var(--color-base-300)"
            strokeWidth="1"
            strokeOpacity="0.85"
            fill="none"
          />
          {/* Right Curve Border */}
          <path
            d="M 120,0 C 105,0 100,24 85,24"
            stroke="var(--color-base-300)"
            strokeWidth="1"
            strokeOpacity="0.85"
            fill="none"
          />
        </svg>
      </div>

      <nav className="flex flex-row md:flex-col items-center justify-around gap-0.5 md:gap-4 w-full md:w-auto overflow-x-auto scrollbar-none ">
        {menu.map(({ name, icon: Icon }) => {
          const active = activeTab === name;

          return (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={`
                relative flex flex-col items-center gap-1 outline-none transition-all duration-300 rounded-xl px-3 py-1.5 shrink-0
                ${
                  active
                    ? "bg-primary text-primary-content shadow-lg shadow-primary/20 scale-105"
                    : "text-base-content/60 hover:text-primary hover:bg-base-200/50"
                }
                md:flex-row md:gap-2 md:bg-transparent md:text-inherit md:shadow-none md:scale-100 md:p-2 md:relative md:group md:rounded-none
              `}
              aria-label={name}
            >
              {/* Background Glow/Pill (Desktop only) */}
              <div
                className={`
                  absolute inset-0 transition-all duration-300 rounded-xl
                  ${
                    active
                      ? "bg-primary/10 scale-110 opacity-100"
                      : "bg-base-content/5 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                  }
                  hidden md:block
                `}
              />

              {/* Icon */}
              <div
                className={`
                  relative z-10 transition-all duration-300 active:scale-90
                  ${
                    active
                      ? "text-primary-content md:text-primary drop-shadow-[0_0_5px_rgba(var(--p),0.4)]"
                      : "text-base-content/50 group-hover:text-primary"
                  }
                `}
              >
                <Icon
                  size={16}
                  strokeWidth={active ? 2.5 : 2}
                  className="md:w-[22px] md:h-[22px]"
                />
              </div>

              {/* Text label below icon (Mobile only) */}
              <span className="text-[9px] font-black uppercase tracking-wider md:hidden relative z-10">
                {name}
              </span>

              {/* Modern Tooltip (Appears to the left - Desktop only) */}
              <span
                className="
                  absolute right-full mr-4 px-3 py-1.5
                  bg-neutral text-neutral-content text-xs font-bold rounded-xl
                  opacity-0 -translate-x-2 pointer-events-none transition-all duration-300
                  group-hover:opacity-100 group-hover:translate-x-0
                  shadow-xl whitespace-nowrap
                  hidden md:block
                "
              >
                {name}
              </span>

              {/* Active Indicator Dot (Desktop only) */}
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-l-full hidden md:block" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default ManagementSidebar;
