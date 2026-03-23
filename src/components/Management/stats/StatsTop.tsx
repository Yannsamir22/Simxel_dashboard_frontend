
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TopEntry {
  name: string;
  revenue: number;
}

interface StatsTopsProps {
  topProducts:  TopEntry[];
  topServices:  TopEntry[];
  topEmployees: TopEntry[];
  topPackages:  TopEntry[];
}

const CONFIGS = [
  { key: "topProducts",  label: "Top Products",  color: "#0197f6" },
  { key: "topServices",  label: "Top Services",   color: "#16a34a" },
  { key: "topEmployees", label: "Top Employees",  color: "#8b5cf6" },
  { key: "topPackages",  label: "Top Packages",   color: "#0ed8e3" },
] as const;

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}k`
    : `${n}`;

const TopTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-base-100 border border-base-300 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-black opacity-60 mb-1 max-w-[120px] truncate">{label}</p>
      <p className="font-black text-primary">
        {(payload[0].revenue as number)} FCFA
      </p>
    </div>
  );
};

const Empty = () => (
  <div className="h-28 flex items-center justify-center opacity-20">
    <p className="text-xs font-black uppercase tracking-widest">—</p>
  </div>
);

interface TopPanelProps {
  data: TopEntry[];
  label: string;
  color: string;
}

const TopPanel: React.FC<TopPanelProps> = ({ data, label, color }) => {
  const sliced = (data ?? []).slice(0, 6);
  const hasData = sliced.length > 0;

  return (
    <div className="bg-base-200 border border-base-300 rounded-xl p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">
        {label}
      </p>
      {!hasData ? <Empty /> : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={sliced}
            layout="vertical"
            margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.08} horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={fmt}
              tick={{ fontSize: 8, opacity: 0.5 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 9, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              width={70}
              tickFormatter={(v: string) =>
                v.length > 9 ? v.slice(0, 8) + "…" : v
              }
            />
            <Tooltip content={<TopTooltip />} />
            <Bar
              dataKey="revenue"
              radius={[0, 4, 4, 0]}
              isAnimationActive={true}
              fill={color}
            >
              {sliced.map((_, i) => (
                <Cell
                  key={i}
                  fill={color}
                  opacity={1 - i * 0.1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const StatsTops: React.FC<StatsTopsProps> = ({
  topProducts, topServices, topEmployees, topPackages,
}) => {
  const map: Record<string, TopEntry[]> = {
    topProducts,
    topServices,
    topEmployees,
    topPackages,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {CONFIGS.map(({ key, label, color }) => (
        <TopPanel
          key={key}
          data={map[key] ?? []}
          label={label}
          color={color}
        />
      ))}
    </div>
  );
};

export default StatsTops;