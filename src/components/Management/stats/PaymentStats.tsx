import React from "react";
import {
      Bar,
      BarChart,
      CartesianGrid,
      Cell,
      Pie,
      PieChart,
      ResponsiveContainer,
      Tooltip,
      XAxis,
      YAxis,
} from "recharts";
import { useT } from "../../../hooks/useT";

interface PaymentStatsProps {
  payments: { CASH: number; OM: number; MOMO: number; CARD?: number };
}

const PAYMENT_COLORS: Record<string, string> = {
  CASH: "#16a34a",
  OM: "#f59e0b",
  MOMO: "#ef4444",
  CARD: "#0197f6",
};

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(0)}k`
      : `${n}`;

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-base-100 border border-base-300 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-black" style={{ color: payload[0].payload.color }}>
        {payload[0].name}
      </p>
      <p className="font-black text-primary">
        {payload[0].value.toLocaleString("fr-FR")} FCFA
      </p>
    </div>
  );
};

const Empty = () => (
  <div className="h-32 flex items-center justify-center opacity-20">
    <p className="text-xs font-black uppercase tracking-widest">—</p>
  </div>
);

const PaymentStats: React.FC<PaymentStatsProps> = ({ payments }) => {
  const { t } = useT();

  const data = Object.entries(payments ?? {})
    .filter(([, v]) => (v as number) > 0)
    .map(([k, v]) => ({
      name: k,
      value: v as number,
      color: PAYMENT_COLORS[k] ?? "#8b5cf6",
    }));

  const total = data.reduce((s, d) => s + d.value, 0);
  const hasData = data.length > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
      {/* Pie Chart  */}
      <div className="bg-base-200 border border-base-300 rounded-xl p-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">
          {t("dashboard.payments")}
        </p>
        {!hasData ? (
          <Empty />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={true}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-col gap-1.5 mt-1">
              {data.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: entry.color }}
                    />
                    <span className="opacity-70">{entry.name}</span>
                  </div>
                  <span className="font-black">
                    {total > 0
                      ? `${Math.round((entry.value / total) * 100)}%`
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Payment Bar Chart ─ */}
      <div className="bg-base-200 border border-base-300 rounded-xl p-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">
          {t("dashboard.totalCollected")}
        </p>
        {!hasData ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                strokeOpacity={0.1}
                horizontal={false}
              />
              <XAxis
                type="number"
                tickFormatter={fmt}
                tick={{ fontSize: 9, opacity: 0.5 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip content={<PieTooltip />} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                isAnimationActive={true}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PaymentStats;
