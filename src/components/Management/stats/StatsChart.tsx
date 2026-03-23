
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useT } from "../../../hooks/useT";
import { toCamelCase } from "./StatsHeader";

interface ChartDataPoint {
  name: string;
  total: number;
}

interface StatsChartProps {
  chartData: ChartDataPoint[];
  period: string;
}

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}k`
    : `${n}`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-base-100 border border-base-300 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-black opacity-60 mb-1">{label}</p>
      <p className="font-black text-primary">
        {payload[0].value.toLocaleString("fr-FR")} FCFA
      </p>
    </div>
  );
};

const Empty = () => (
  <div className="h-40 flex items-center justify-center opacity-20">
    <p className="text-xs font-black uppercase tracking-widest">—</p>
  </div>
);

const StatsChart: React.FC<StatsChartProps> = ({ chartData, period }) => {
  const { t } = useT();
  const periodLabel = t(`dashboard.period.${toCamelCase(period)}`);
  const hasData = chartData && chartData.length > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/*  Line Chart  */}
      <div className="bg-base-200 border border-base-300 rounded-xl p-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">
          {t("dashboard.kpi.revenue")} — {periodLabel}
        </p>
        {!hasData ? <Empty /> : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, opacity: 0.5 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={fmt}
                tick={{ fontSize: 9, opacity: 0.5 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#0197f6"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0197f6" }}
                activeDot={{ r: 5 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/*  Bar Chart ─ */}
      <div className="bg-base-200 border border-base-300 rounded-xl p-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">
          {t("dashboard.chart")} — {periodLabel}
        </p>
        {!hasData ? <Empty /> : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, opacity: 0.5 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={fmt}
                tick={{ fontSize: 9, opacity: 0.5 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total"
                fill="#0197f6"
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
};

export default StatsChart;