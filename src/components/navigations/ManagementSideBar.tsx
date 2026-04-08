
import {
  HeartHandshake,
  Package,
  Receipt,
  ShoppingBag,
  UserCog2Icon,
} from "lucide-react";
import BottomNavbar from "./BottomNavbar";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ManagementSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menu = [
    { name: "Packages", icon: Package },
    { name: "Services", icon: HeartHandshake },
    { name: "Products", icon: ShoppingBag },
    { name: "Employees", icon: UserCog2Icon }, // ← was "Employee", now matches New.tsx
    { name: "Expenses", icon: Receipt },
  ];

  return (
    <aside className="max-h-screen w-10 flex flex-col bg-base-100 border border-base-300 shrink-0 justify-center top-50 md:top-30 rounded-l-2xl fixed right-0 z-10">
      <nav className="flex-1 px-1 py-6 space-y-5 flex-col flex items-center justify-center">
        {menu.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => setActiveTab(name)}
            className={`flex items-center rounded-md p-1 hover:text-accent ${activeTab === name ? "text-primary scale-105" : ""}`}
          >
            <Icon size={20} />
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default ManagementSidebar;