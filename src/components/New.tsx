import { useState } from "react";
import EmployeeManagement from "./Management/EmployeeManagement";
import ExpenseManagement from "./Management/ExpenseManagement";
import PackManagement from "./Management/PackManagement";
import ProductManagement from "./Management/ProductManagement";
import ServiceManagement from "./Management/ServiceManagement";
import ManagementSidebar from "./navigations/ManagementSideBar";

export type ManagementTab =
  | "Employees"
  | "Products"
  | "Services"
  | "Packages"
  | "Expenses";

const New: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ManagementTab>("Employees");
  return (
    <div className="flex min-h-screen w-full">
      <ManagementSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as ManagementTab)}
      />

      <main className="w-full pt-2">
        {activeTab === "Packages" && <PackManagement />}
        {activeTab === "Services" && <ServiceManagement />}
        {activeTab === "Products" && <ProductManagement />}
        {activeTab === "Employees" && <EmployeeManagement />}
        {activeTab === "Expenses" && <ExpenseManagement />}
      </main>
    </div>
  );
};

export default New;
