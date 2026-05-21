import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "../../hooks/useT";
import { type Employee, useEmployeeStore } from "../../stores/employeeStore";
import { useToastStore } from "../../stores/toastStore";
import ManagementModal, {
  EMPLOYEE_FIELDS,
  type ModalMode,
} from "./ManagementModal";
import EmployeeSkeleton from "./skeleton/EmployeeSkeleton";

const EmployeeManagement = () => {
  const { t } = useT();
  const addToast = useToastStore((s: any) => s.addToast);

  const {
    loading,
    employees,
    loadEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
  } = useEmployeeStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [target, setTarget] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const openCreate = () => {
    setTarget(null);
    setMode("create");
    setModalOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setTarget(emp);
    setMode("edit");
    setModalOpen(true);
  };

  const handleCreate = async (data: any) => {
    const result = await addEmployee(data);
    if (result.success) addToast(t("employees.addEmployee") + " success");
    return result;
  };
  const handleEdit = async (data: any) => {
    const result = await editEmployee(target!.id, data);
    if (result.success) addToast(t("common.save") + " success");
    return result;
  };
  const handleDelete = async () => {
    const result = await removeEmployee(target!.id);
    if (result.success) addToast(t("employees.deleted"), "success");
    return result;
  };

  const openDelete = (emp: Employee) => {
    setTarget(emp);
    setMode("delete");
    setModalOpen(true);
  };
  if (loading) return <EmployeeSkeleton />;

  return (
    <div className="pb-36 md:pb-6 space-y-6 animate-in fade-in duration-300 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-base-200 rounded-md shadow-xl border border-base-300 overflow-hidden relative">
        <div className="p-6 border-b border-base-300 flex justify-between items-center relative">
          <div className="absolute left-4 top-8 bottom-8 w-px bg-primary" />
          <div className="pl-6">
            <h3 className="text-xl font-black uppercase tracking-tighter">
              {t("employees.title")}
            </h3>
            <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em]">
              {t("employees.subtitle")}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="btn btn-primary btn-sm rounded-sm font-bold uppercase text-[10px] tracking-widest"
          >
            <Plus size={16} />
            {t("employees.addEmployee")}
          </button>
        </div>

        {/* MOBILE LIST (CARDS) */}
        <div className="block md:hidden space-y-3 p-4">
          {employees.length === 0 ? (
            <p className="text-center opacity-30 text-sm font-bold py-6 uppercase tracking-wider">
              {t("employees.noEmployees")}
            </p>
          ) : (
            employees.map((emp) => (
              <div
                key={emp.id}
                className="bg-base-100 border border-base-300 rounded-xl p-4 space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-tight text-base-content">
                      {emp.name}
                    </h4>
                    <p className="text-[10px] opacity-40 font-bold uppercase tracking-wider mt-1">
                      {t("employees.dob")}:{" "}
                      {(emp.dateOfBirth &&
                        new Date(emp.dateOfBirth).toLocaleDateString()) ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase opacity-40 tracking-wider block">
                      {t("employees.commission")}
                    </span>
                    {emp.commissionRate ? (
                      <span className="font-mono font-bold text-sm text-success">
                        {Math.round((emp.commissionRate ?? 0) * 100)}%
                      </span>
                    ) : (
                      <span className="font-mono font-bold text-sm text-error">
                        0%
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-base-300/40 pt-2">
                  <button
                    onClick={() => openEdit(emp)}
                    className="btn btn-xs btn-ghost hover:text-primary transition-colors gap-1 uppercase text-[10px]"
                  >
                    <Edit2 size={12} /> {t("common.edit")}
                  </button>

                  <button
                    onClick={() => openDelete(emp)}
                    className="btn btn-xs btn-ghost text-error hover:bg-error/10 hover:text-error transition-all gap-1 uppercase text-[10px]"
                  >
                    <Trash2 size={12} /> {t("common.delete")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-300/50 border-b border-base-300">
                <th className="text-[10px] uppercase tracking-widest opacity-50 pl-10">
                  {t("employees.title")}{" "}
                </th>
                <th className="text-right text-[10px] uppercase tracking-widest opacity-50 pr-6">
                  {t("employees.commission")}
                </th>
                <th className="text-right text-[10px] uppercase tracking-widest opacity-50 pr-6">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>

            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-12 opacity-20 font-black uppercase tracking-widest text-sm"
                  >
                    {t("employees.noEmployees")}
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-base-300/30 border-b border-base-300/50 group"
                  >
                    <td className="pl-10 mb-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm uppercase tracking-tight">
                          {emp.name}
                        </span>

                        <span className="text-[9px] opacity-40 font-bold uppercase italic">
                          {t("employees.dob")}:{" "}
                          {(emp.dateOfBirth &&
                            new Date(emp.dateOfBirth).toLocaleDateString()) ||
                            "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="text-right pr-6 space-x-2">
                      {emp.commissionRate ? (
                        <span
                          className={`font-mono font-bold text-green-500 ${(emp.commissionRate ?? 0) > 0 ? "text-success" : "text-error"}`}
                        >
                          {Math.round((emp.commissionRate ?? 0) * 100)}%
                        </span>
                      ) : (
                        <span className="font-mono font-bold text-red-500">
                          0%
                        </span>
                      )}
                    </td>
                    <td className="text-right pr-6 space-x-2">
                      <button
                        onClick={() => openEdit(emp)}
                        className="btn btn-ghost btn-xs rounded-4xl p-1 hover:text-primary transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => openDelete(emp)}
                        className="btn btn-ghost btn-xs rounded-4xl p-1 hover:text-error transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ManagementModal
        open={modalOpen}
        mode={mode}
        onClose={() => setModalOpen(false)}
        fields={EMPLOYEE_FIELDS}
        entityName="Employee"
        accentColor="primary"
        initial={target ?? undefined}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EmployeeManagement;
