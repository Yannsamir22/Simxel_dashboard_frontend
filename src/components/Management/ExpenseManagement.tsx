import { Calendar, Edit2, Plus, Receipt, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useT } from "../../hooks/useT";
import type { Expense } from "../../stores/expenseStore";
import { useExpenseStore } from "../../stores/expenseStore";
import { useToastStore } from "../../stores/toastStore";
import ExpenseForm from "./ExpenseForm";
import ExpenseSkeleton from "./skeleton/ExpenseSkeleton";

const ExpenseManagement: React.FC = () => {
  const { t } = useT();
  const addToast = useToastStore((s: any) => s.addToast);

  const {
    expenses,
    fetchExpenses,
    addExpense,
    editExpense,
    removeExpense,
    loading,
  } = useExpenseStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const totalAll = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  const totalThisMonth = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((e) => {
        const d = new Date(e.date);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((s, e) => s + e.amount, 0);
  }, [expenses]);

  if (loading) return <ExpenseSkeleton />;

  const handleSubmit = async (data: {
    type: string;
    amount: number;
    note?: string;
    date: string;
  }) => {
    if (editTarget) return await editExpense(editTarget.id, data);
    return await addExpense(data);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    const result = await removeExpense(deleteTarget.id);

    setDeleting(false);

    if (result.success) {
      addToast(t("expenses.deleted"), "success");
      setDeleteTarget(null);
    } else {
      addToast(result.error ?? t("common.deleteError"), "error");
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-base-200 p-4 sm:p-6 rounded-xl border border-base-300 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-error/10 rounded-xl text-error border border-error/20">
            <Receipt size={24} />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em]">
              {t("expenses.totalExpenses")}
            </p>

            <p className="text-2xl sm:text-3xl font-black text-error">
              {totalAll.toLocaleString()}{" "}
              <span className="text-xs">FCFA</span>
            </p>
          </div>
        </div>

        <div className="bg-base-200 p-4 sm:p-6 rounded-xl border border-base-300 flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-xl text-primary border border-primary/20">
            <Calendar size={24} />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em]">
              {t("expenses.thisMonth")}
            </p>

            <p className="text-2xl font-black">
              {totalThisMonth.toLocaleString()}{" "}
              <span className="text-xs">FCFA</span>
            </p>
          </div>
        </div>
      </div>

      {/* JOURNAL */}
      <div className="bg-base-200 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
        {/* HEADER */}
        <div className="p-4 sm:p-6 border-b border-base-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="border-l-4 border-error pl-4">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              {t("expenses.title")}
            </h3>

            <p className="text-[10px] uppercase tracking-widest opacity-60">
              {t("expenses.subtitle")}
            </p>
          </div>

          <button
            onClick={() => {
              setEditTarget(null);
              setFormOpen(true);
            }}
            className="btn btn-error w-full sm:w-auto btn-sm sm:btn-md rounded-lg font-black gap-2 uppercase text-xs tracking-widest"
          >
            <Plus size={18} /> {t("expenses.addExpense")}
          </button>
        </div>

        {/* MOBILE LIST */}
        <div className="block md:hidden space-y-3 p-4">
          {expenses.length === 0 && (
            <p className="text-center opacity-30 text-sm font-bold">
              {t("expenses.noExpenses")}
            </p>
          )}

          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-base-100 border border-base-300 rounded-xl p-4 space-y-2"
            >
              <div className="flex justify-between text-xs">
                <span className="font-bold">
                  {new Date(expense.date).toLocaleDateString("fr-FR")}
                </span>

                <span className="text-error font-black">
                  {expense.amount.toLocaleString()} FCFA
                </span>
              </div>

              <div className="text-sm font-bold uppercase">
                {String(
                  t(`expenses.types.${expense.type}`, {
                    defaultValue: expense.type,
                  } as any)
                )}
              </div>

              <div className="text-xs opacity-60">
                {expense.note || "—"}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setEditTarget(expense);
                    setFormOpen(true);
                  }}
                  className="btn btn-xs btn-ghost"
                >
                  <Edit2 size={14} />
                </button>

                <button
                  onClick={() => setDeleteTarget(expense)}
                  className="btn btn-xs btn-ghost text-error"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-300/30">
              <tr className="text-[10px] uppercase tracking-widest opacity-60">
                <th className="py-4 pl-8">{t("common.date")}</th>
                <th>{t("common.type")}</th>
                <th>{t("common.note")}</th>
                <th className="text-right">{t("common.amount")}</th>
                <th className="text-right pr-6">{t("common.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-base-300/20">
                  <td className="pl-8 text-xs font-mono">
                    {new Date(expense.date).toLocaleDateString("fr-FR")}
                  </td>

                  <td className="font-bold uppercase text-sm">
                    {String(
                      t(`expenses.types.${expense.type}`, {
                        defaultValue: expense.type,
                      } as any)
                    )}
                  </td>

                  <td>
                    <span className="badge badge-outline text-[10px] uppercase">
                      {expense.note || "—"}
                    </span>
                  </td>

                  <td className="text-right font-black text-error">
                    {expense.amount.toLocaleString()} FCFA
                  </td>

                  <td className="text-right pr-6 space-x-1">
                    <button
                      onClick={() => {
                        setEditTarget(expense);
                        setFormOpen(true);
                      }}
                      className="btn btn-ghost btn-xs"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(expense)}
                      className="btn btn-ghost btn-xs text-error"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL */}
      <ExpenseForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleSubmit}
        initial={editTarget}
      />

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-base-100 rounded-2xl shadow-xl border border-base-300 w-full max-w-sm sm:max-w-md mx-4 p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-full bg-error/10 text-error">
                <Trash2 size={26} />
              </div>

              <div>
                <p className="font-black uppercase">{t("common.delete")}?</p>

                <p className="text-sm opacity-60">
                  {deleteTarget.amount.toLocaleString()} FCFA
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="btn btn-ghost flex-1"
                >
                  {t("common.cancel")}
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn btn-error flex-1"
                >
                  {deleting ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <>
                      <Trash2 size={14} /> {t("common.delete")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;