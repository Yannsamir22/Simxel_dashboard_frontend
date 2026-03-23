import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "../../hooks/useT";
import { useToastStore } from "../../stores/toastStore";
import type { Expense } from "../../stores/expenseStore";


interface ExpenseFormProps {
  open: boolean;
  initial?: Expense | null;
  onClose: () => void;
  onSubmit: (payload: {
    type: string;
    amount: number;
    note?: string;
    date: string;
  }) => Promise<{ success: boolean; error?: string } | void>;
}


const EXPENSE_TYPE_KEYS = [
  "Rent", "Electricity", "Water", "Supplies",
  "Salary", "Transport", "Maintenance", "Marketing", "Other",
] as const;

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  open,
  onClose,
  onSubmit,
  initial,
}) => {
  const { t } = useT();
  const addToast = useToastStore((s: any) => s.addToast);

  const [type,    setType]    = useState(initial?.type ?? "");
  const [amount,  setAmount]  = useState<string>(initial?.amount?.toString() ?? "");
  const [note,    setNote]    = useState(initial?.note ?? "");
  const [date,    setDate]    = useState(
    initial?.date
      ? new Date(initial.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [loading, setLoading] = useState(false);

  const [error,   setError]   = useState<string | null>(null);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setType(initial?.type ?? "");
      setAmount(initial?.amount?.toString() ?? "");
      setNote(initial?.note ?? "");
      setDate(
        initial?.date
          ? new Date(initial.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      );
      setError(null);
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (!type.trim())                       return setError("Please select an expense type.");
    if (isNaN(parsedAmount) || parsedAmount <= 0) return setError("Please enter a valid amount.");

    setLoading(true);
    try {
      const result = await onSubmit({
        type: type.trim(),
        amount: parsedAmount,
        note: note.trim() || undefined,
        date,
      });

      if (result && !result.success) {
        setError(result.error ?? "Failed to save expense.");
        return;
      }

      addToast(
        initial ? "Expense updated" : "Expense added",
        "success",
      );
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.message ?? "Failed to save expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-md mx-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — fix: hardcoded English, now uses t() */}
        <div className="flex items-center justify-between p-5 border-b border-base-300 bg-base-200">
          <div className="border-l-4 border-error pl-4">
            <h3 className="font-black uppercase text-sm tracking-tight">
              {initial ? t("common.edit") : t("expenses.addExpense")}
            </h3>
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
              {t("expenses.subtitle")}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type — fix: option value was translated text, now stable English key */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">
                {t("expenses.type")} *
              </span>
            </label>
            <select
              className={`select select-bordered w-full ${error && !type ? "select-error" : ""}`}
              value={type}
              onChange={(e) => { setType(e.target.value); setError(null); }}
              required
            >
              <option value="">Select a type…</option>
              {EXPENSE_TYPE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`expenses.types.${key}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">
                {t("common.amount")} (FCFA) *
              </span>
            </label>
            <input
              type="number"
              min={1}
              step={1}
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(null); }}
              className={`input input-bordered w-full font-black text-lg ${error && !amount ? "input-error" : ""}`}
              required
            />
          </div>

          {/* Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">
                {t("common.date")} *
              </span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Note */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">
                {t("common.note")}
              </span>
            </label>
            <input
              type="text"
              placeholder="Add a description…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input input-bordered w-full"
              maxLength={200}
            />
          </div>

          {error && <p className="text-error font-bold text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1 rounded-lg uppercase font-bold text-xs"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-error flex-1 rounded-lg uppercase font-bold text-xs shadow-lg shadow-error/20"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : initial ? (
                t("common.save")
              ) : (
                t("expenses.addExpense")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;