import { AlertTriangle, Check, Trash2, X } from "lucide-react";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useT } from "../../hooks/useT";
import { useServiceStore } from "../../stores/serviceStore";

// Field types

export type FieldType =
  | "text"
  | "number"
  | "price"
  | "percent"
  | "date"
  | "select"
  | "multiselect";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  options?: FieldOption[];
  optionsFrom?: "services";
  hint?: string;
}

// Entity field configs

export const PRODUCT_FIELDS: FieldDef[] = [
  {
    key: "name",
    label: "Product Name",
    type: "text",
    required: true,
    placeholder: "e.g. Mineral water 1L",
  },
  {
    key: "salePrice",
    label: "Selling Price",
    type: "price",
    required: true,
    min: 0,
    placeholder: "500",
  },
  {
    key: "unitCost",
    label: "Unit Cost",
    type: "price",
    min: 0,
    placeholder: "300",
    hint: "What you pay to produce it. Used for profit calculation.",
  },
  {
    key: "stock",
    label: "Initial Stock",
    type: "number",
    min: 0,
    placeholder: "0",
  },
  {
    key: "minStockAlert",
    label: "Low Stock Alert",
    type: "number",
    min: 0,
    placeholder: "5",
    hint: "Warning shown when stock falls below this number.",
  },
];

export const SERVICE_FIELDS: FieldDef[] = [
  {
    key: "name",
    label: "Service Name",
    type: "text",
    required: true,
    placeholder: "e.g. Haircut",
  },
  {
    key: "price",
    label: "Price",
    type: "price",
    required: true,
    min: 0,
    placeholder: "2000",
  },
];

export const PACKAGE_FIELDS: FieldDef[] = [
  {
    key: "name",
    label: "Package Name",
    type: "text",
    required: true,
    placeholder: "e.g. VIP Combo",
  },
  {
    key: "price",
    label: "Price",
    type: "price",
    required: true,
    min: 0,
    placeholder: "5000",
  },
  {
    key: "serviceIds",
    label: "Included Services",
    type: "multiselect",
    required: true,
    optionsFrom: "services",
    hint: "Select at least one service.",
  },
];

export const EMPLOYEE_FIELDS: FieldDef[] = [
  {
    key: "name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "e.g. Rimas Nasri",
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "EMPLOYEE", label: "Employee" },
      { value: "MANAGER", label: "Manager" },
    ],
  },
  {
    key: "commissionRate",
    label: "Commission Rate",
    type: "percent",
    min: 0,
    max: 100,
    placeholder: "10",
    hint: "% of service revenue assigned to this employee.",
  },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
];

// Form state

type FormState = Record<string, string | string[]>;

function initState(
  fields: FieldDef[],
  initial?: Record<string, any>,
): FormState {
  const state: FormState = {};
  for (const f of fields) {
    if (f.type === "multiselect") {
      const raw = initial?.[f.key];
      state[f.key] = Array.isArray(raw) ? raw : [];
    } else if (f.type === "percent" && initial?.[f.key] != null) {
      const v = initial[f.key];
      // Backend stores 0.1 -> display as 10
      state[f.key] = v <= 1 ? String(Math.round(v * 100)) : String(v);
    } else if (f.type === "date" && initial?.[f.key] != null) {
      const raw = String(initial[f.key]);
      state[f.key] = raw.length >= 10 ? raw.slice(0, 10) : raw;
    } else {
      state[f.key] = initial?.[f.key] != null ? String(initial[f.key]) : "";
    }
  }
  return state;
}

type FormAction =
  | { type: "SET"; key: string; value: string }
  | { type: "TOGGLE_MULTI"; key: string; value: string }
  | { type: "RESET"; fields: FieldDef[]; initial?: Record<string, any> };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET":
      return { ...state, [action.key]: action.value };
    case "TOGGLE_MULTI": {
      const current = (state[action.key] as string[]) ?? [];
      const next = current.includes(action.value)
        ? current.filter((v) => v !== action.value)
        : [...current, action.value];
      return { ...state, [action.key]: next };
    }
    case "RESET":
      return initState(action.fields, action.initial);
    default:
      return state;
  }
}

// Validation

function validate(
  fields: FieldDef[],
  state: FormState,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const val = state[f.key];
    if (f.required) {
      if (f.type === "multiselect") {
        if (!Array.isArray(val) || val.length === 0)
          errors[f.key] = "Select at least one option.";
      } else if (!String(val).trim()) {
        errors[f.key] = `${f.label} is required.`;
      }
    }
    if (["number", "price", "percent"].includes(f.type)) {
      const num = parseFloat(String(val));
      if (String(val).trim() !== "" && isNaN(num))
        errors[f.key] = "Must be a number.";
      if (f.min != null && !isNaN(num) && num < f.min)
        errors[f.key] = `Minimum is ${f.min}.`;
      if (f.max != null && !isNaN(num) && num > f.max)
        errors[f.key] = `Maximum is ${f.max}.`;
    }
  }
  return errors;
}

// Build payload

function buildPayload(
  fields: FieldDef[],
  state: FormState,
): Record<string, any> {
  const payload: Record<string, any> = {};
  for (const f of fields) {
    const val = state[f.key];
    if (f.type === "multiselect") {
      payload[f.key] = val as string[];
    } else if (f.type === "number" || f.type === "price") {
      const n = parseFloat(String(val));
      if (!isNaN(n)) payload[f.key] = n;
    } else if (f.type === "percent") {
      const n = parseFloat(String(val));
      if (!isNaN(n)) payload[f.key] = n / 100; // 10 → 0.1
    } else if (String(val).trim() !== "") {
      payload[f.key] = String(val).trim();
    }
  }
  return payload;
}

// Delete confirm

const DeleteConfirm: React.FC<{
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}> = ({ name, onConfirm, onCancel, loading }) => {
  const { t } = useT();
  return (
  <div className="p-6 flex flex-col items-center gap-4 text-center">
    <div className="p-4 rounded-full bg-error/10 text-error">
      <AlertTriangle size={28} />
    </div>
    <div>
      <p className="font-black text-base uppercase tracking-tight">
        {t("common.deleteConfirmTitle")}
      </p>
      <p className="text-sm text-base-content/60 mt-1">
        <span className="font-bold text-base-content">{name}</span> {t("common.deleteConfirmDesc")}
      </p>
    </div>
    <div className="flex gap-3 w-full">
      <button
        onClick={onCancel}
        disabled={loading}
        className="btn btn-ghost flex-1 rounded-lg font-bold"
      >
        {t("common.cancel")}
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="btn btn-error flex-1 rounded-lg font-bold"
      >
        {loading ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <>
            <Trash2 size={15} /> {t("common.delete")}
          </>
        )}
      </button>
    </div>
  </div>
);};

// Main component

export type ModalMode = "create" | "edit" | "delete";

interface ManagementModalProps {
  open: boolean;
  mode: ModalMode;
  onClose: () => void;
  fields: FieldDef[];
  entityName: string;
  accentColor?: string;
  initial?: Record<string, any>;
  onCreate?: (
    payload: Record<string, any>,
  ) => Promise<{ success: boolean; error?: string }>;
  onEdit?: (
    payload: Record<string, any>,
  ) => Promise<{ success: boolean; error?: string }>;
  onDelete?: () => Promise<{ success: boolean; error?: string }>;
}

const ManagementModal: React.FC<ManagementModalProps> = ({
  open,
  mode,
  onClose,
  fields,
  entityName,
  accentColor = "primary",
  initial,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const { t } = useT();

  // all hooks at top level of the component, never inside renderField
  const services = useServiceStore((s) => s.services);
  const servicesLoading = useServiceStore((s) => s.loading);

  const [formState, dispatch] = useReducer(
    formReducer,
    initState(fields, initial),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      dispatch({ type: "RESET", fields, initial });
      setErrors({});
      setServerError(null);
      setTimeout(() => firstInputRef.current?.focus(), 80);
    }
  }, [open, initial]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate(fields, formState);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const payload = buildPayload(fields, formState);
    setSubmitting(true);
    const action = mode === "create" ? onCreate : onEdit;
    if (!action) {
      setSubmitting(false);
      return;
    }

    const result = await action(payload);
    setSubmitting(false);
    if (result.success) {
      onClose();
    } else {
      setServerError(result.error ?? t("common.error"));
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!onDelete) return;
    setSubmitting(true);
    const result = await onDelete();
    setSubmitting(false);
    if (result.success) {
      onClose();
    } else {
      setServerError(result.error ?? t("common.error"));
    }
  };

  // Render one field
  const renderField = (field: FieldDef, index: number) => {
    const value = formState[field.key];
    const error = errors[field.key];
    const hasError = Boolean(error);

    // options are derived here using the hook values from component scope
    const options: FieldOption[] =
      field.optionsFrom === "services"
        ? services.map((s) => ({ value: s.id, label: s.name }))
        : (field.options ?? []);

    const inputClass = `input input-bordered w-full ${hasError ? "input-error" : ""}`;
    const commonProps = { ref: index === 0 ? firstInputRef : undefined };

    return (
      <div key={field.key} className="form-control">
        {/* Label */}
        <label className="label py-1">
          <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-60">
            {field.label}
            {field.required && (
              <span className={`text-${accentColor} ml-1`}>*</span>
            )}
          </span>
        </label>

        {/* text / date */}
        {(field.type === "text" || field.type === "date") && (
          <input
            {...commonProps}
            type={field.type}
            value={value as string}
            placeholder={field.placeholder}
            onChange={(e) =>
              dispatch({ type: "SET", key: field.key, value: e.target.value })
            }
            className={inputClass}
          />
        )}

        {/* number / price */}
        {(field.type === "number" || field.type === "price") && (
          <label
            className={`input input-bordered flex items-center gap-2 ${hasError ? "input-error" : ""}`}
          >
            <input
              {...commonProps}
              type="number"
              min={field.min}
              value={value as string}
              placeholder={field.placeholder ?? "0"}
              onChange={(e) =>
                dispatch({ type: "SET", key: field.key, value: e.target.value })
              }
              className="grow"
            />
            {field.type === "price" && (
              <span className="text-[10px] font-black opacity-40 shrink-0">
                FCFA
              </span>
            )}
          </label>
        )}

        {/* percent */}
        {field.type === "percent" && (
          <label
            className={`input input-bordered flex items-center gap-2 ${hasError ? "input-error" : ""}`}
          >
            <input
              {...commonProps}
              type="number"
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={1}
              value={value as string}
              placeholder={field.placeholder ?? "0"}
              onChange={(e) =>
                dispatch({ type: "SET", key: field.key, value: e.target.value })
              }
              className="grow"
            />
            <span className="text-[10px] font-black opacity-40 shrink-0">
              %
            </span>
          </label>
        )}

        {/* select */}
        {field.type === "select" && (
          <select
            value={value as string}
            onChange={(e) =>
              dispatch({ type: "SET", key: field.key, value: e.target.value })
            }
            className={`select select-bordered w-full ${hasError ? "select-error" : ""}`}
          >
            <option value="">Choose…</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* FIX 3: multiselect — properly wrapped, no broken nesting */}
        {field.type === "multiselect" && (
          <div
            className={`border rounded-lg p-3 max-h-44 overflow-y-auto space-y-1
            ${hasError ? "border-error" : "border-base-300"}`}
          >
            {field.optionsFrom === "services" && servicesLoading ? (
              <div className="flex items-center justify-center py-4">
                <span className="loading loading-spinner loading-sm" />
              </div>
            ) : options.length === 0 ? (
              <p className="text-xs opacity-40 text-center py-2">
                {t("services.noServicesAvailable")}
              </p>
            ) : (
              options.map((opt) => {
                const selected = (value as string[]).includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all
                      ${
                        selected
                          ? `bg-${accentColor}/10 border border-${accentColor}/20`
                          : "hover:bg-base-200"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all
                      ${
                        selected
                          ? `bg-${accentColor} border-${accentColor}`
                          : "border-base-content/30"
                      }`}
                    >
                      {selected && <Check size={10} className="text-white" />}
                    </div>
                    <span className="text-sm font-bold">{opt.label}</span>
                    <span className="text-xs opacity-40 ml-auto">
                      {opt.value.slice(0, 6)}…
                    </span>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        dispatch({
                          type: "TOGGLE_MULTI",
                          key: field.key,
                          value: opt.value,
                        })
                      }
                      className="hidden"
                    />
                  </label>
                );
              })
            )}
          </div>
        )}

        {/* Error / hint */}
        {error && <p className="text-error text-xs font-bold mt-1">{error}</p>}
        {field.hint && !error && (
          <p className="text-[10px] opacity-40 mt-1">{field.hint}</p>
        )}
      </div>
    );
  };

  // Modal title
  const title =
    mode === "create"
      ? `Add ${entityName}`
      : mode === "edit"
        ? `Edit ${entityName}`
        : `Delete ${entityName}`;

  // Render
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-md
          max-h-[90vh] flex flex-col overflow-hidden
          animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-5 border-b border-base-300 bg-base-200 border-l-4 border-${accentColor}`}
        >
          <div className="pl-3">
            <h3 className="font-black uppercase text-sm tracking-tight">
              {title}
            </h3>
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
              {mode === "delete"
                ? "This action is permanent"
                : "Fields marked * are required"}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {mode === "delete" ? (
            <DeleteConfirm
              name={initial?.name ?? entityName}
              onConfirm={handleDelete}
              onCancel={onClose}
              loading={submitting}
            />
          ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {fields.map((field, i) => renderField(field, i))}

              {serverError && (
                <div className="bg-error/10 text-error text-sm font-bold p-3 rounded-lg">
                  {serverError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="btn btn-ghost flex-1 rounded-lg font-bold"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`btn btn-${accentColor} flex-1 rounded-lg font-bold`}
                >
                  {submitting ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : mode === "create" ? (
                    t("common.add")
                  ) : (
                    t("common.save")
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagementModal;
