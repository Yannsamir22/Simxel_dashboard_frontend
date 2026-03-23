import React from "react";
import { useT } from "../../../hooks/useT";

export function toCamelCase(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}

export type Period =
  | "Today"
  | "Yesterday"
  | "This week"
  | "This month"
  | "This year";

const PERIODS: Period[] = [
  "Today",
  "Yesterday",
  "This week",
  "This month",
  "This year",
];

interface StatsHeaderProps {
  period: Period;
  onPeriodChange: (p: Period) => void;
  loading: boolean;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({
  period,
  onPeriodChange,
  loading,
}) => {
  const { t } = useT();
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="border-l-4 border-primary pl-5">
        <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight">
          {t("dashboard.title")}
        </h2>
        <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em]">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Period tabs */}
      <div className="flex items-center gap-1 bg-base-300/50 p-1 rounded-xl">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            disabled={loading}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all
              ${
                period === p
                  ? "bg-primary text-primary-content shadow"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-300"
              }`}
          >
            {t(`dashboard.period.${toCamelCase(p)}`)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatsHeader;
