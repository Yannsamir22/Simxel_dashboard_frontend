import {
  ArrowRightCircle,
  CalendarDays,
  ChevronDown,
  ChevronLeftCircle,
  ChevronRightCircle,
  Receipt,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "../hooks/useT";
import { SalesService } from "../services/salesService";

interface SaleItem {
  type: string;
  quantity: number;
  total: number;
  product?: { name: string };
  service?: { name: string };
  package?: { name: string };
  employee?: { name: string };
}

interface Payment {
  method: string;
  amount: number;
}

interface Sale {
  id: string;
  totalAmount: number;
  saleDate: string;
  user?: { name: string } | null;
  items: SaleItem[];
  paymentType: Payment[];
}

const PAYMENT_COLORS: Record<string, string> = {
  CASH: "badge-success",
  OM: "badge-warning",
  MOMO: "badge-error",
  CARD: "badge-info",
};

const fmt = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

const SaleRow = ({
  sale,
  onExpand,
  expanded,
}: {
  sale: Sale;
  onExpand: () => void;
  expanded: boolean;
}) => {
  const itemNames = sale.items
    .map((i) => i.product?.name ?? i.service?.name ?? i.package?.name ?? "?")
    .join(", ");

  return (
    <>
      <tr
        className="hover:bg-base-300/30 border-b border-base-300/50 cursor-pointer transition-colors"
        onClick={onExpand}
      >
        {/* Date */}
        <td className="px-4 py-3 text-xs opacity-60 whitespace-nowrap">
          {new Date(sale.saleDate).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          <span className="block opacity-50">
            {new Date(sale.saleDate).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </td>

        {/* Reference */}
        <td className="px-4 py-3 font-mono text-xs font-bold">
          {sale.id.substring(0, 8).toUpperCase()}
        </td>

        {/* Items summary */}
        <td className="px-4 py-3 text-sm max-w-[180px]">
          <p className="truncate opacity-80">{itemNames || "—"}</p>
          <p className="text-[10px] opacity-40">{sale.items.length} item(s)</p>
        </td>

        {/* Payments */}
        <td className="px-4 py-3 hidden sm:table-cell">
          <div className="flex flex-wrap gap-1">
            {sale.paymentType.map((p, i) => (
              <span
                key={i}
                className={`badge badge-sm p-2 font-black ${PAYMENT_COLORS[p.method] ?? "badge-ghost"}`}
              >
                {p.method}
              </span>
            ))}
          </div>
        </td>

        {/* Total */}
        <td className="px-4 py-3 text-right font-black text-sm text-primary whitespace-nowrap">
          {fmt(sale.totalAmount)}
        </td>

        {/* Expand */}
        <td className="px-2 py-3">
          <ChevronDown
            size={14}
            className={`opacity-40 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-base-200/50 border-b border-base-300">
          <td colSpan={7} className="px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Items */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">
                  Items
                </p>
                <div className="space-y-1">
                  {sale.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="opacity-70">
                        {item.product?.name ??
                          item.service?.name ??
                          item.package?.name ??
                          "?"}
                        {item.employee && (
                          <span className="opacity-40 text-xs">
                            {" "}
                            · {item.employee.name}
                          </span>
                        )}
                        <span className="ml-1 text-xs opacity-40">
                          x{item.quantity}
                        </span>
                      </span>
                      <span className="font-bold">{fmt(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Payments */}
              <div className="flex flex-col items-end justify-center pr-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">
                  Payments
                </p>
                <div className="space-y-1">
                  {sale.paymentType.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span
                        className={`badge badge-sm font-black p-2 ${PAYMENT_COLORS[p.method] ?? "badge-ghost"}`}
                      >
                        {p.method}
                      </span>
                      <span className="font-bold">{fmt(p.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const Sales: React.FC = () => {
  const { t } = useT();

  const [sales, setSales] = useState<Sale[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const LIMIT = 20;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await SalesService.getAllSales({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        limit: LIMIT,
        offset: page * LIMIT,
      });
      setSales(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (err: any) {
      setError(err.response?.data?.error ?? t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, startDate, endDate]);

  const filtered = search
    ? sales.filter(
        (s) =>
          s.id.toLowerCase().includes(search.toLowerCase()) ||
          s.items.some((i) =>
            (i.product?.name ?? i.service?.name ?? i.package?.name ?? "")
              .toLowerCase()
              .includes(search.toLowerCase()),
          ),
      )
    : sales;

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-4 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-base-200 rounded-xl border border-base-300 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="border-l-4 border-primary pl-4">
            <h2 className="text-xl font-black uppercase tracking-tight">
              {t("sales.title")}
            </h2>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
              {t("sales.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Receipt size={14} className="opacity-40" />
            <span className="text-sm font-black opacity-60">
              {total} {t("sales.total")}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <label className="input input-bordered flex items-center gap-2 flex-1">
          <Search size={14} className="opacity-40" />
          <input
            type="text"
            placeholder={t("sales.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow text-sm"
          />
        </label>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="opacity-40 shrink-0" />
          <input
            type="date"
            className="input input-bordered input-sm"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(0);
            }}
          />
          <span className="opacity-40 text-sm"><ArrowRightCircle />
          </span>
          <input
            type="date"
            className="input input-bordered input-sm"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(0);
            }}
          />
          {(startDate || endDate) && (
            <button
              className="btn btn-ghost btn-sm btn-circle opacity-40"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setPage(0);
              }}
            >
              <X />
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error text-sm py-2">
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-base-200 border border-base-300 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center opacity-30">
            <Receipt size={36} className="mb-3" />
            <p className="font-black uppercase tracking-widest text-sm">
              {t("sales.noSales")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-300/50 border-b border-base-300">
                  <th className="text-[10px] uppercase tracking-widest opacity-50 px-4">
                    {t("sales.date")}
                  </th>
                  <th className="text-[10px] uppercase tracking-widest opacity-50 px-4">
                    {t("sales.ref")}
                  </th>
                  <th className="text-[10px] uppercase tracking-widest opacity-50 px-4">
                    {t("sales.items")}
                  </th>
                  <th className="text-[10px] uppercase tracking-widest opacity-50 px-4 hidden sm:table-cell">
                    {t("sales.payment")}
                  </th>
                  <th className="text-[10px] uppercase tracking-widest opacity-50 px-4 text-right">
                    {t("sales.amount")}
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((sale) => (
                  <SaleRow
                    key={sale.id}
                    sale={sale}
                    expanded={expanded === sale.id}
                    onExpand={() =>
                      setExpanded(expanded === sale.id ? null : sale.id)
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3">
          <button
            className="btn w-fit btn-ghost rounded-full"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeftCircle />
          </button>
          <span className="text-xs opacity-60 font-bold">
            {page + 1} / {totalPages}
          </span>
          <button
            className="btn w-fit btn-ghost rounded-full"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRightCircle />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sales;
