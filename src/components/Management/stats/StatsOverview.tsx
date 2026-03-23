
import { BarChart2, ShoppingCart, TrendingUp, Trophy } from "lucide-react";
import React from "react";

interface KpiItem {
  label: string;
  value: number;
  unit: string;
}

interface StatsOverviewProps {
  overview: KpiItem[];
}

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}k`
    : `${n}`;

const ICONS = [TrendingUp, Trophy, BarChart2, ShoppingCart];
const COLORS = ["text-primary", "text-warning", "text-secondary", "text-accent"];

const StatsOverview: React.FC<StatsOverviewProps> = ({ overview }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {overview.map((kpi, i) => {
        const Icon = ICONS[i] ?? BarChart2;
        return (
          <div
            key={i}
            className="bg-base-200 border border-base-300 rounded-xl p-4 shadow-sm flex flex-col gap-1"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
                {kpi.label}
              </p>
              <Icon size={16} className={`${COLORS[i] ?? "text-primary"} opacity-50`} />
            </div>
            <p className="text-2xl font-black text-primary">{fmt(kpi.value)}</p>
            <p className="text-[10px] opacity-40 font-semibold">{kpi.unit}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;