import React from "react";
import {
      Cell,
      Pie,
      PieChart,
      RadialBar,
      RadialBarChart,
      ResponsiveContainer,
      Tooltip,
} from "recharts";
import { useT } from "../../../hooks/useT";

export interface TopEntry {
  name: string;
  revenue: number;
}

interface SalesMixProps {
  topServices: TopEntry[];
  topProducts: TopEntry[];
  topPackages: TopEntry[];
}

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(0)}k`
      : `${n}`;

const MixTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-base-100 border border-base-300 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-black" style={{ color: payload[0].payload.color }}>
        {payload[0].name ?? payload[0].payload.name}
      </p>
      <p className="font-black text-primary">
        {(payload[0].value ?? payload[0].payload.value).toLocaleString(
          "fr-FR",
        ) ?? (payload[0].revenue as number)}{" "}
        FCFA
      </p>
    </div>
  );
};

const Empty = () => (
  <div className="h-32 flex items-center justify-center opacity-20">
    <p className="text-xs font-black uppercase tracking-widest">—</p>
  </div>
);

const SalesMix: React.FC<SalesMixProps> = ({
  topServices,
  topProducts,
  topPackages,
}) => {
  const { t } = useT();
  const serviceTotal = (topServices ?? []).reduce((s, d) => s + d.revenue, 0);
  const productTotal = (topProducts ?? []).reduce((s, d) => s + d.revenue, 0);
  const packageTotal = (topPackages ?? []).reduce((s, d) => s + d.revenue, 0);
  const total = serviceTotal + productTotal + packageTotal;

  const pieData = [
    { name: "Services", revenue: serviceTotal, color: "#16a34a" },
    { name: "Products", revenue: productTotal, color: "#0197f6" },
    { name: "Packages", revenue: packageTotal, color: "#0ed8e3" },
  ].filter((d) => d.revenue > 0);

  const radialData = [
    { name: "Services", revenue: serviceTotal, fill: "#16a34a" },
    { name: "Products", revenue: productTotal, fill: "#0197f6" },
    { name: "Packages", revenue: packageTotal, fill: "#0ed8e3" },
  ].filter((d) => d.revenue > 0);

  const hasData = total > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
      {/* Sales Mix Donut */}
      <div className="bg-base-200 border border-base-300 rounded-xl p-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">
          {t("dashboard.salesMix")}
        </p>
        {!hasData ? (
          <Empty />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey={"revenue"}
                  isAnimationActive={true}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<MixTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-col gap-1.5 mt-1">
              {pieData.map((entry, i) => (
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
                  <span className="font-clack">{fmt(entry.revenue)} FCFA</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/*  Radial Bar  */}
      <div className="bg-base-200 border border-base-300 rounded-xl p-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">
          {t("dashboard.catBreakdown")}
        </p>
        {!hasData ? (
          <Empty />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={140}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={65}
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="revenue"
                  cornerRadius={4}
                  isAnimationActive={true}
                />
                <Tooltip content={<MixTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-1">
              {radialData.map((entry, i) => (
                <div key={i} className="flex items-center gap-1 text-xs">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: entry.fill }}
                  />
                  <span className="opacity-70">{entry.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default SalesMix;
