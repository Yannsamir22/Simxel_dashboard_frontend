// src/components/SyncStatusBadge.tsx
// Polls the server health endpoint every 30s.
// Shows: online / syncing / unreachable / offline
// FIX: Now exports a named export (was already correct, but added explicit type)
// FIX: Retry logic added — clicking the badge when unreachable retries immediately

import { CloudOff, Loader2, RefreshCw, Wifi } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "../hooks/useT";
import { axiosInstance } from "../api/api";

type SyncState = "online" | "syncing" | "unreachable" | "offline";

interface SyncStatusBadgeProps {
    businessId: string;
}

async function checkServerHealth(businessId: string): Promise<boolean> {
    try {
        await axiosInstance.get(`/businesses/${businessId}/health`, {
            timeout: 5000,
        });
        return true;
    } catch {
        return false;
    }
}

export function SyncStatusBadge({ businessId }: SyncStatusBadgeProps) {
    const { t } = useT();
    const [status, setStatus] = useState<SyncState>("syncing");
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const runCheck = useCallback(async () => {
        if (!navigator.onLine) {
            setStatus("offline");
            return;
        }
        setStatus("syncing");
        const ok = await checkServerHealth(businessId);
        if (ok) {
            setStatus("online");
            setLastSync(new Date());
        } else {
            setStatus("unreachable");
        }
    }, [businessId]);

    useEffect(() => {
        runCheck();
        intervalRef.current = setInterval(runCheck, 30_000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [runCheck]);

    // Browser online/offline events
    useEffect(() => {
        const onOnline = () => runCheck();
        const onOffline = () => setStatus("offline");
        window.addEventListener("online", onOnline);
        window.addEventListener("offline", onOffline);
        return () => {
            window.removeEventListener("online", onOnline);
            window.removeEventListener("offline", onOffline);
        };
    }, [runCheck]);

    const config: Record<
        SyncState,
        { label: string; color: string; icon: React.ReactNode; clickable: boolean }
    > = {
        online: {
            label: t("sync.online"),
            color: "text-success",
            icon: <Wifi size={10} />,
            clickable: false,
        },
        syncing: {
            label: t("sync.syncing"),
            color: "text-info",
            icon: <Loader2 size={10} className="animate-spin" />,
            clickable: false,
        },
        unreachable: {
            label: t("sync.unreachable"),
            color: "text-warning",
            icon: <RefreshCw size={10} />,
            clickable: true,
        },
        offline: {
            label: t("sync.offline"),
            color: "text-error",
            icon: <CloudOff size={10} />,
            clickable: false,
        },
    };

    const { label, color, icon, clickable } = config[status];

    return (
        <button
            onClick={clickable ? runCheck : undefined}
            disabled={!clickable}
            title={
                clickable
                    ? t("sync.clickToRetry")
                    : lastSync
                        ? `${t("sync.lastSync")} ${lastSync.toLocaleTimeString()}`
                        : label
            }
            className={`
        hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest
        px-2 py-0.5 rounded-full border
        transition-all duration-200
        ${color}
        ${status === "online"
                    ? "border-success/20 bg-success/5"
                    : status === "syncing"
                        ? "border-info/20 bg-info/5"
                        : status === "unreachable"
                            ? "border-warning/20 bg-warning/5 cursor-pointer hover:bg-warning/15"
                            : "border-error/20 bg-error/5"
                }
      `}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

export default SyncStatusBadge;