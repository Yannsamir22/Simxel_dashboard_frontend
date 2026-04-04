// src/components/Management/Dashboard.tsx
import { useEffect, useState } from "react";
import { useT } from "../../hooks/useT";
import Loading from "../../loadash/Loading";
import { SalesService } from "../../services/salesService";
import NoSales from "./stats/NoSales";
import PaymentStats from "./stats/PaymentStats";
import SalesMix from "./stats/SalesMix";
import StatsChart from "./stats/StatsChart";
import StatsHeader, { type Period } from "./stats/StatsHeader";
import StatsOverview from "./stats/StatsOverview";
import StatsTops from "./stats/StatsTop";

export interface TopEntry {
  name: string;
  revenue: number;
}

interface DashboardData {
  period: string;
  overview: { label: string; value: number; unit: string }[];
  payments: { CASH: number; OM: number; MOMO: number; CARD?: number };
  topServices: TopEntry[];
  topProducts: TopEntry[];
  topEmployees: TopEntry[];
  topPackages: TopEntry[];
  chartData: { name: string; total: number }[];
}

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<Period>("Today");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useT();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await SalesService.getDashboardStats(period);
        if (!cancelled) {
          // Backend returns { ok: true, data: { ... } }
          // Fall back to res directly if the backend returns flat shape
          setData(res.data ?? res);
        }
      } catch (err: any) {
        if (!cancelled)
          setError(err.response?.data?.error ?? t("dashboard.loadError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [period]);

  if (loading) return <Loading message={t("common.loading")} />;

  const isEmpty =
    !loading && !error && data && (data.overview?.[0]?.value ?? 0) === 0;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <StatsHeader
        period={period}
        onPeriodChange={setPeriod}
        loading={loading}
      />

      {error && (
        <div className="alert justify-center alert-error shadow-lg rounded-md mx-4">
          <span className="font-bold text-sm">{error}</span>
        </div>
      )}

      {data && !isEmpty && (
        <>
          <StatsOverview overview={data.overview ?? []} />
          <StatsChart chartData={data.chartData ?? []} period={period} />
          <PaymentStats
            payments={data.payments ?? { CASH: 0, OM: 0, MOMO: 0 }}
          />
          <SalesMix
            topServices={data.topServices ?? []}
            topProducts={data.topProducts ?? []}
            topPackages={data.topPackages ?? []}
          />
          <StatsTops
            topProducts={data.topProducts ?? []}
            topServices={data.topServices ?? []}
            topEmployees={data.topEmployees ?? []}
            topPackages={data.topPackages ?? []}
          />
        </>
      )}

      {isEmpty && <NoSales />}
    </div>
  );
};

export default Dashboard;
