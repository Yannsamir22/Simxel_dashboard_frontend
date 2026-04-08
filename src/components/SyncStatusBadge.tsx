import { useEffect, useState } from "react";
import { axiosInstance as api } from "../api/api";

type SyncData = {
    status: "online" | "offline" | "never_synced";
    label: string;
    humanReadable: string | null;
};

export function SyncStatusBadge({ businessId }: { businessId: string }) {
    const [sync, setSync] = useState<SyncData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const res = await api.get(`/businesses/${businessId}/sync-status`);
            setSync(res.data.data);
        } catch {
            setSync(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        // Poll every 2 minutes
        const interval = setInterval(fetchStatus, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, [businessId]);

    if (loading || !sync) return null;

    const isOnline = sync.status === "online";

    return (
        <div
            className={`flex items-center gap-1.5
        px-2 py-1
        rounded-full
        text-[10px] sm:text-xs
        font-semibold
        border
        ${isOnline
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"}
      `}>
            <span
                className={`
          w-2 h-2 rounded-full
          ${isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"}
        `} />
            <span className="whitespace-nowrap hidden sm:inline">
                {sync.label}
                {sync.humanReadable ? ` · ${sync.humanReadable}` : ""}
            </span>

            {/* Mobile short text */}
            <span className="sm:hidden">
                {isOnline ? "Online" : "Offline"}
            </span>
        </div>
    );
}