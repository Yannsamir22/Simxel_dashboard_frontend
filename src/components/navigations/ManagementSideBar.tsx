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

const ManagementSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
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
        fixed right-0 top-1/2 -translate-y-1/2 z-40
        flex flex-col items-center
        bg-base-100/70 backdrop-blur-lg
        border-l border-y border-base-300
        rounded-l-3xl shadow-2xl
        py-6 px-2 space-y-6
        transition-all duration-300 ease-in-out
      "
    >
      <nav className="flex flex-col items-center gap-4">
        {menu.map(({ name, icon: Icon }) => {
          const active = activeTab === name;

          return (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className="relative group p-2 outline-none"
              aria-label={name}
            >
              {/* Background Glow/Pill */}
              <div
                className={`
                  absolute inset-0 transition-all duration-300 rounded-xl
                  ${active 
                    ? "bg-primary/10 scale-110 opacity-100" 
                    : "bg-base-content/5 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                  }
                `}
              />

              {/* Icon */}
              <div
                className={`
                  relative z-10 transition-all duration-300 active:scale-90
                  ${active 
                    ? "text-primary drop-shadow-[0_0_5px_rgba(var(--p),0.4)]" 
                    : "text-base-content/50 group-hover:text-primary"
                  }
                `}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              </div>

              {/* Modern Tooltip (Appears to the left) */}
              <span 
                className="
                  absolute right-full mr-4 px-3 py-1.5
                  bg-neutral text-neutral-content text-xs font-bold rounded-xl
                  opacity-0 -translate-x-2 pointer-events-none transition-all duration-300
                  group-hover:opacity-100 group-hover:translate-x-0
                  shadow-xl whitespace-nowrap
                "
              >
                {name}
              </span>
              
              {/* Active Indicator Dot */}
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-l-full" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default ManagementSidebar;