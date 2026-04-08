import {
  AlertTriangle,
  ArrowRightCircle,
  BarChart2,
  CalendarDays,
  Check,
  Download,
  Loader2,
  Package,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useT } from "../hooks/useT";
import { ReportService } from "../services/reportService";
import { useBusinessStore } from "../stores/businessStore";

const fmt = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
const fmtPct = (a: number, total: number) =>
  total > 0 ? `${Math.round((a / total) * 100)}%` : "—";

//  Stat card 
const StatCard = ({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) => (
  <div className="bg-base-200 border border-base-300 rounded-xl p-4 flex items-center gap-4">
    <div className="p-2.5 bg-primary/10 rounded-lg text-primary shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
        {label}
      </p>
      <p className="font-black text-lg leading-tight truncate">{value}</p>
      {sub && <p className="text-xs opacity-40 mt-0.5">{sub}</p>}
    </div>
  </div>
);

//  Section wrapper with optional export button 
const Section = ({
  icon,
  title,
  children,
  onExport,
  exporting,
  exportLabel,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  onExport?: () => void;
  exporting?: boolean;
  exportLabel?: string;
}) => (
  <div className="bg-base-200 border border-base-300 rounded-xl overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3 border-b border-base-300 bg-base-300/30">
      <div className="flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        <h3 className="font-black text-sm uppercase tracking-widest">
          {title}
        </h3>
      </div>
      {onExport && (
        <button
          onClick={onExport}
          disabled={exporting}
          className="btn btn-ghost btn-xs gap-1.5 opacity-60 hover:opacity-100"
        >
          {exporting ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Download size={12} />
          )}
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {exportLabel ?? "Excel"}
          </span>
        </button>
      )}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

//  Export hook — handles loading + error per section 
function useExport(fn: () => Promise<void>) {
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      await fn();
    } catch (e: any) {
      setError(e.message ?? t("reports.exportFailed"));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
}

//  Main component 
const Report: React.FC = () => {
  const { t } = useT();
  const selectedBusiness = useBusinessStore((s) => s.selectedBusiness);
  const bizName = selectedBusiness?.name ?? "Simxel";

  // Default: current month
  const now = new Date();
  const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const today = now.toISOString().split("T")[0];

  const [start, setStart] = useState(firstOfMonth);
  const [end, setEnd] = useState(today);

  //  Summary 
  const [summary, setSummary] = useState<any>(null);
  const [summLoading, setSummLoading] = useState(false);
  const [summError, setSummError] = useState<string | null>(null);

  const loadSummary = async () => {
    if (!start || !end) return;
    setSummLoading(true);
    setSummError(null);
    try {
      const res = await ReportService.getSalesSummary(start, end);
      setSummary(res.ok ? res.data : null);
      if (!res.ok) setSummError(res.error ?? t("reports.failedToLoadSummary"));
    } catch (e: any) {
      setSummError(e.response?.data?.error ?? t("reports.failedToLoadSummary"));
    } finally {
      setSummLoading(false);
    }
  };

  //  Top items 
  const [topItems, setTopItems] = useState<any[]>([]);
  const [topLoading, setTopLoading] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);

  const loadTopItems = async () => {
    if (!start || !end) return;
    setTopLoading(true);
    setTopError(null);
    try {
      const res = await ReportService.getTopItems(start, end, 10);
      setTopItems(res.ok ? (res.data ?? []) : []);
      if (!res.ok) setTopError(res.error ?? t("reports.failedToLoadItems"));
    } catch (e: any) {
      setTopError(e.response?.data?.error ?? t("reports.failedToLoadItems"));
    } finally {
      setTopLoading(false);
    }
  };

  //  Staff 
  const [staff, setStaff] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState<string | null>(null);

  const loadStaff = async () => {
    if (!start || !end) return;
    setStaffLoading(true);
    setStaffError(null);
    try {
      const res = await ReportService.getStaffPerformance(start, end);
      setStaff(res.ok ? (res.data ?? []) : []);
      if (!res.ok) setStaffError(res.error ?? t("reports.failedToLoadStaff"));
    } catch (e: any) {
      setStaffError(e.response?.data?.error ?? t("reports.failedToLoadStaff"));
    } finally {
      setStaffLoading(false);
    }
  };

  //  Financial balance 
  const [balance, setBalance] = useState<any>(null);
  const [balLoading, setBalLoading] = useState(false);
  const [balError, setBalError] = useState<string | null>(null);

  const loadBalance = async () => {
    if (!start || !end) return;
    setBalLoading(true);
    setBalError(null);
    try {
      const res = await ReportService.getFinancialBalance(start, end);
      setBalance(res.ok ? res.data : null);
      if (!res.ok) setBalError(res.error ?? t("reports.failedToLoadBalance"));
    } catch (e: any) {
      setBalError(e.response?.data?.error ?? t("reports.failedToLoadBalance"));
    } finally {
      setBalLoading(false);
    }
  };

  //  Stock status 
  const [stock, setStock] = useState<any[]>([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  const loadStock = async () => {
    setStockLoading(true);
    setStockError(null);
    try {
      const res = await ReportService.getStockStatus();
      setStock(res.ok ? (res.data ?? []) : []);
      if (!res.ok) setStockError(res.error ?? t("reports.failedToLoadStock"));
    } catch (e: any) {
      setStockError(e.response?.data?.error ?? t("reports.failedToLoadStock"));
    } finally {
      setStockLoading(false);
    }
  };

  const loadAll = () => {
    loadSummary();
    loadTopItems();
    loadStaff();
    loadBalance();
    loadStock();
  };

  // Load on first render
  useState(() => {
    loadAll();
  });

  //  Excel export hooks 
  const journalExport = useExport(() =>
    ReportService.exportSalesJournal(start, end, bizName),
  );
  const staffExport = useExport(() =>
    ReportService.exportStaffPerformance(start, end, bizName),
  );
  const stockExport = useExport(() => ReportService.exportStockStatus(bizName));
  const balanceExport = useExport(() =>
    ReportService.exportFinancialBalance(start, end, bizName),
  );

  const PAYMENT_COLORS: Record<string, string> = {
    CASH: "text-success",
    OM: "text-warning",
    MOMO: "text-error",
    CARD: "text-info",
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto pb-24">
      {/*  Header  */}
      <div className="bg-base-200 border border-base-300 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="border-l-4 border-primary pl-4">
            <h2 className="text-xl font-black uppercase tracking-tight">
              {t("reports.title")}
            </h2>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
              {t("reports.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Date range */}
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="opacity-40 shrink-0" />
              <input
                type="date"
                className="input input-bordered input-sm"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
              <span className="opacity-40 text-sm"><ArrowRightCircle /></span>
              <input
                type="date"
                className="input input-bordered input-sm"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={loadAll}>
              {t("reports.generate")}
            </button>
          </div>
        </div>
      </div>

      {/*  Sales Summary  */}
      <Section
        icon={<TrendingUp size={16} />}
        title={t("reports.summary")}
        onExport={journalExport.run}
        exporting={journalExport.loading}
        exportLabel={t("reports.exportJournal")}
      >
        {journalExport.error && (
          <p className="text-error text-xs mb-2">{journalExport.error}</p>
        )}
        {summLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner text-primary" />
          </div>
        ) : summError ? (
          <p className="text-error text-sm">{summError}</p>
        ) : summary ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard
                icon={<TrendingUp size={18} />}
                label={t("reports.totalRevenue")}
                value={fmt(summary.totalRevenue)}
                sub={`${summary.totalTransactions} ${t("reports.transactions")}`}
              />
              <StatCard
                icon={<BarChart2 size={18} />}
                label={t("reports.avgTransaction")}
                value={fmt(summary.averageTransaction)}
              />
              <StatCard
                icon={<Wallet size={18} />}
                label={t("reports.paymentBreakdown")}
                value={
                  Object.keys(summary.paymentBreakdown ?? {}).join(" · ") || "—"
                }
              />
            </div>
            {summary.paymentBreakdown &&
              Object.keys(summary.paymentBreakdown).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(summary.paymentBreakdown).map(
                    ([method, amount]: any) => (
                      <div
                        key={method}
                        className="bg-base-300/40 rounded-lg p-3 text-center"
                      >
                        <p
                          className={`text-xs font-black uppercase ${PAYMENT_COLORS[method] ?? ""}`}
                        >
                          {method}
                        </p>
                        <p className="font-black text-sm mt-1">{fmt(amount)}</p>
                        <p className="text-[10px] opacity-40">
                          {fmtPct(amount, summary.totalRevenue)}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}
          </div>
        ) : (
          <p className="text-sm opacity-40 text-center py-6">
            {t("reports.noData")}
          </p>
        )}
      </Section>

      {/*  Financial Balance  */}
      <Section
        icon={<Wallet size={16} />}
        title={t("reports.financialBalance")}
        onExport={balanceExport.run}
        exporting={balanceExport.loading}
        exportLabel={t("reports.exportExcel")}
      >
        {balanceExport.error && (
          <p className="text-error text-xs mb-2">{balanceExport.error}</p>
        )}
        {balLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner text-primary" />
          </div>
        ) : balError ? (
          <p className="text-error text-sm">{balError}</p>
        ) : balance ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard
                icon={<TrendingUp size={18} />}
                label={t("reports.revenue")}
                value={fmt(balance.totalRevenue)}
              />
              <StatCard
                icon={<Wallet size={18} />}
                label={t("reports.expenses")}
                value={fmt(balance.totalExpenses)}
              />
              <div
                className={`bg-base-200 border rounded-xl p-4 flex items-center gap-4 ${balance.netProfit >= 0 ? "border-success/40" : "border-error/40"}`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${balance.netProfit >= 0 ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
                >
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                    {t("reports.netProfit")}
                  </p>
                  <p
                    className={`font-black text-lg ${balance.netProfit >= 0 ? "text-success" : "text-error"}`}
                  >
                    {balance.netProfit >= 0 ? "+" : ""}
                    {fmt(balance.netProfit)}
                  </p>
                </div>
              </div>
            </div>
            {balance.expenseBreakdown &&
              Object.keys(balance.expenseBreakdown).length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                    {t("reports.expenseBreakdown")}
                  </p>
                  <div className="space-y-2">
                    {Object.entries(balance.expenseBreakdown)
                      .sort(([, a]: any, [, b]: any) => b - a)
                      .map(([type, amount]: any) => (
                        <div key={type} className="flex items-center gap-3">
                          <span className="text-sm opacity-70 w-28 truncate shrink-0">
                            {type}
                          </span>
                          <div className="flex-1 bg-base-300 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: fmtPct(amount, balance.totalExpenses),
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold shrink-0 w-28 text-right">
                            {fmt(amount)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        ) : (
          <p className="text-sm opacity-40 text-center py-6">
            {t("reports.noData")}
          </p>
        )}
      </Section>

      {/*  Top Items  */}
      <Section icon={<Package size={16} />} title={t("reports.topItems")}>
        {topLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner text-primary" />
          </div>
        ) : topError ? (
          <p className="text-error text-sm">{topError}</p>
        ) : topItems.length > 0 ? (
          <div className="space-y-2">
            {topItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-black opacity-30 w-5 shrink-0">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold truncate">
                      {item.name}
                    </span>
                    <span className="text-xs opacity-40 shrink-0 ml-2">
                      {item.quantity}×
                    </span>
                  </div>
                  <div className="bg-base-300 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{
                        width:
                          topItems[0]?.revenue > 0
                            ? `${(item.revenue / topItems[0].revenue) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-black text-primary shrink-0 w-28 text-right">
                  {fmt(item.revenue)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm opacity-40 text-center py-6">
            {t("reports.noData")}
          </p>
        )}
      </Section>

      {/*  Staff Performance  */}
      <Section
        icon={<Users size={16} />}
        title={t("reports.staffPerformance")}
        onExport={staffExport.run}
        exporting={staffExport.loading}
        exportLabel={t("reports.exportExcel")}
      >
        {staffExport.error && (
          <p className="text-error text-xs mb-2">{staffExport.error}</p>
        )}
        {staffLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner text-primary" />
          </div>
        ) : staffError ? (
          <p className="text-error text-sm">{staffError}</p>
        ) : staff.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-base-300/50">
                  <th className="text-[10px] uppercase tracking-widest opacity-50">
                    {t("reports.employee")}
                  </th>
                  <th className="text-[10px] uppercase tracking-widest opacity-50 text-center">
                    {t("reports.prestations")}
                  </th>
                  <th className="text-[10px] uppercase tracking-widest opacity-50 text-right">
                    {t("reports.generated")}
                  </th>
                  <th className="text-[10px] uppercase tracking-widest opacity-50 text-right">
                    {t("reports.commission")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {staff.map((emp, i) => (
                  <tr key={i} className="border-b border-base-300/50">
                    <td className="font-bold py-2">{emp.employeeName}</td>
                    <td className="text-center opacity-70">
                      {emp.prestationCount}
                    </td>
                    <td className="text-right font-bold text-primary">
                      {fmt(emp.totalGenerated)}
                    </td>
                    <td className="text-right opacity-70">
                      {fmt(emp.commission)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm opacity-40 text-center py-6">
            {t("reports.noData")}
          </p>
        )}
      </Section>

      {/*  Stock Status  */}
      <Section
        icon={<AlertTriangle size={16} />}
        title={t("reports.stockStatus")}
        onExport={stockExport.run}
        exporting={stockExport.loading}
        exportLabel={t("reports.exportExcel")}
      >
        {stockExport.error && (
          <p className="text-error text-xs mb-2">{stockExport.error}</p>
        )}
        {stockLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner text-primary" />
          </div>
        ) : stockError ? (
          <p className="text-error text-sm">{stockError}</p>
        ) : stock.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-base-300/50">
                  <th className="text-[10px] uppercase tracking-widest opacity-50">
                    {t("reports.product")}
                  </th>
                  <th className="text-[10px] uppercase tracking-widest opacity-50 text-center">
                    {t("reports.currentStock")}
                  </th>
                  <th className="text-[10px] uppercase tracking-widest opacity-50 text-center">
                    {t("reports.minAlert")}
                  </th>
                  <th className="text-[10px] uppercase tracking-widest opacity-50 text-center">
                    {t("reports.status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {stock.map((p, i) => (
                  <tr
                    key={i}
                    className={`border-b border-base-300/50 ${p.status === "ALERT" ? "bg-error/5" : ""}`}
                  >
                    <td className="font-bold py-2">{p.productName}</td>
                    <td className="text-center">{p.currentStock}</td>
                    <td className="text-center opacity-50">
                      {p.minStockAlert}
                    </td>
                    <td className="text-center">
                      {p.status === "ALERT" ? (
                        <span className="badge badge-error badge-sm">
                          <AlertTriangle size={12} /> {t("reports.alert")}
                        </span>
                      ) : (
                        <span className="badge badge-success badge-sm px-4">
                          <Check size={12} /> {t("reports.ok")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm opacity-40 text-center py-6">
            {t("reports.noData")}
          </p>
        )}
      </Section>
    </div>
  );
};

export default Report;
