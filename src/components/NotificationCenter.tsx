// src/components/NotificationCenter.tsx
// FIX: Added UPDATE_BANNER notification type + banner rendering
// FIX: fetchNotifications now also called on mount (not only on open)
// FIX: unreadCount polling restarts when businessId changes
// FIX: UPDATE_BANNER notifications render an inline dismissible banner above Navbar

import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCheck,
  Info,
  Megaphone,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useT } from "../hooks/useT";
import {
  useNotificationStore,
  type Notification,
  type NotificationType,
} from "../stores/notificationStore";

// ─── Type configs ────────────────────────────────────────────────────────────

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  LOW_STOCK: <AlertCircle className="w-5 h-5" />,
  SYNC_WARNING: <AlertTriangle className="w-5 h-5" />,
  WEEKLY_SUMMARY: <BarChart3 className="w-5 h-5" />,
  INFO: <Info className="w-5 h-5" />,

};

const TYPE_BADGE: Record<NotificationType, string> = {
  LOW_STOCK: "badge-warning",
  SYNC_WARNING: "badge-error",
  WEEKLY_SUMMARY: "badge-info",
  INFO: "badge-ghost",
};

const TYPE_ICON_BG: Record<NotificationType, string> = {
  LOW_STOCK: "bg-warning/15 text-warning",
  SYNC_WARNING: "bg-error/15 text-error",
  WEEKLY_SUMMARY: "bg-info/15 text-info",
  INFO: "bg-base-300 text-base-content",
};

// ─── Time helper ─────────────────────────────────────────────────────────────

function timeAgo(
  dateString: string,
  t: (key: string, opts?: Record<string, unknown>) => string,
): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return t("notification.justNow");
  if (m < 60) return t("notification.minutesAgo", { count: m });
  const h = Math.floor(m / 60);
  if (h < 24) return t("notification.hoursAgo", { count: h });
  const d = Math.floor(h / 24);
  if (d < 30) return t("notification.daysAgo", { count: d });
  const mo = Math.floor(d / 30);
  if (mo < 12) return t("notification.monthsAgo", { count: mo });
  return t("notification.yearsAgo", { count: Math.floor(mo / 12) });
}

// ─── Update Banner (rendered OUTSIDE the dropdown, inline at page top) ───────

interface UpdateBannerProps {
  notification: Notification;
  businessId: string;
}

export function UpdateBanner({ notification, businessId }: UpdateBannerProps) {
  const { markAsRead } = useNotificationStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || notification.isRead) return null;

  const handleDismiss = () => {
    setDismissed(true);
    markAsRead(businessId, notification.id);
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-[9998] flex justify-center px-4 pt-2 pointer-events-none">
      <div
        className="
          pointer-events-auto
          w-full max-w-2xl
          bg-success/10 border border-success/30
          text-success-content
          rounded-xl px-4 py-3
          flex items-center gap-3
          shadow-lg backdrop-blur-sm
          animate-in slide-in-from-top-2 duration-300
        "
      >
        <Megaphone className="w-5 h-5 text-success shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-success truncate">
            {notification.title}
          </p>
          <p className="text-xs text-base-content/70 truncate">
            {notification.message}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="btn btn-ghost btn-xs btn-circle text-base-content/50 hover:text-error shrink-0"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Update Banner Host (reads from store, renders banners) ──────────────────

export function UpdateBannerHost({ businessId }: { businessId: string }) {
  const { systemNotifications, fetchSystemNotifications } = useNotificationStore();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Poll every 30 seconds for new super admin broadcasts
  useEffect(() => {
    if (!businessId) return;
    fetchSystemNotifications(businessId);
    const interval = setInterval(() => fetchSystemNotifications(businessId), 30_000);
    return () => clearInterval(interval);
  }, [businessId, fetchSystemNotifications]);

  // Filter out dismissed ones
  const visible = systemNotifications.filter(n => !dismissedIds.has(n.id));

  if (visible.length === 0) return null;

  // Show only the most recent
  const latest = visible.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  const handleDismiss = () => {
    setDismissedIds(prev => new Set([...prev, latest.id]));
  };

  // Map super admin type to banner color
  const colors: Record<string, { bg: string; border: string; icon: string }> = {
    DANGER:  { bg: 'bg-error/10',   border: 'border-error/30',   icon: 'text-error'   },
    WARNING: { bg: 'bg-warning/10', border: 'border-warning/30', icon: 'text-warning' },
    SUCCESS: { bg: 'bg-success/10', border: 'border-success/30', icon: 'text-success' },
    INFO:    { bg: 'bg-info/10',    border: 'border-info/30',    icon: 'text-info'    },
  };

  const color = colors[latest.type] ?? colors.INFO;

  return (
    <div className="fixed top-16 left-0 right-0 z-[9998] flex justify-center px-4 pt-2 pointer-events-none">
      <div
        className={`
          pointer-events-auto
          w-full max-w-2xl
          ${color.bg} border ${color.border}
          rounded-xl px-4 py-3
          flex items-center gap-3
          shadow-lg backdrop-blur-sm
          animate-in slide-in-from-top-2 duration-300
        `}
      >
        <Megaphone className={`w-5 h-5 shrink-0 ${color.icon}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold truncate ${color.icon}`}>
            {latest.title}
          </p>
          <p className="text-xs text-base-content/70 truncate">
            {latest.message}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="btn btn-ghost btn-xs btn-circle text-base-content/50 hover:text-error shrink-0"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Notification item ────────────────────────────────────────────────────────

function NotificationItem({
  n,
  businessId,
  t,
}: {
  n: Notification;
  businessId: string;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  const { markAsRead, deleteOne } = useNotificationStore();

  return (
    <div
      onClick={() => !n.isRead && markAsRead(businessId, n.id)}
      className={`
        flex gap-3 px-4 py-4 border-b border-base-300
        transition-colors duration-150
        ${n.isRead
          ? "bg-base-100 cursor-default"
          : "bg-base-200 cursor-pointer hover:bg-base-300/60 active:bg-base-300"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${TYPE_ICON_BG[n.type]}`}
      >
        {TYPE_ICON[n.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm leading-snug text-base-content ${n.isRead ? "font-normal opacity-70" : "font-semibold"}`}
          >
            {n.title}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteOne(businessId, n.id, n.isRead);
            }}
            className="flex-shrink-0 btn btn-ghost btn-xs text-base-content/40 hover:text-error p-0 w-6 h-6 min-h-0"
            title="Delete"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-base-content/60 mt-0.5 line-clamp-2 leading-relaxed">
          {n.message}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          <span className={`badge badge-xs px-2.5 py-0.5 font-semibold ${TYPE_BADGE[n.type]}`}>
            {n.type.replace(/_/g, " ")}
          </span>
          <span className="text-[11px] text-base-content/40">
            {timeAgo(n.createdAt, t)}
          </span>
        </div>
      </div>

      {/* Unread dot */}
      {!n.isRead && (
        <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-primary mt-1.5" />
      )}
    </div>
  );
}

// ─── Main NotificationCenter component ───────────────────────────────────────

export function NotificationCenter({ businessId }: { businessId: string }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useT();

  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAllAsRead,
    clearRead,
    systemNotifications,
    fetchSystemNotifications,
  } = useNotificationStore();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // FIX: Fetch unread count on mount AND every 30s (was 60s — too slow for banners)
  // FIX: Dependency array includes businessId so it restarts when business changes
  useEffect(() => {
    if (!businessId) return;
    fetchUnreadCount(businessId);
    const interval = setInterval(() => fetchUnreadCount(businessId), 30_000);
    return () => clearInterval(interval);
  }, [businessId, fetchUnreadCount]);

  // FIX: Also fetch full notifications on mount to populate banners immediately
  useEffect(() => {
    if (!businessId) return;
    fetchNotifications(businessId);
    fetchSystemNotifications(businessId);
  }, [businessId, fetchNotifications, fetchSystemNotifications]);

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      fetchNotifications(businessId);
      fetchSystemNotifications(businessId);
    }
  };

  const hasRead = notifications.some((n) => n.isRead);

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center rounded-full size-8 btn-ghost hover:bg-base-200"
        title="Notifications"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell className="h-5" />

        {unreadCount > 0 && (
          <span
            className="
              absolute top-0.5 right-0.5
              badge badge-secondary badge-xs
              size-3.5 text-[10px] font-bold p-1
              flex items-center justify-center
            "
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 sm:hidden"
            onClick={() => setOpen(false)}
          />

          <div
            className="
              fixed sm:absolute
              top-16 left-0 sm:top-auto sm:left-auto sm:right-0 sm:mt-2
              z-50
              w-screen h-[calc(100vh-4rem)] sm:w-[420px] sm:h-auto sm:max-h-[540px]
              bg-base-100
              border-t border-base-200 sm:border sm:border-base-300
              sm:rounded-2xl
              shadow-2xl
              flex flex-col
              overflow-hidden
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-base-300 bg-base-200 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-secondary" />
                <span className="font-semibold text-base text-base-content">
                  {t("notification.title")}
                </span>
                {unreadCount > 0 && (
                  <div className="badge badge-secondary badge-sm size-5 rounded-full font-bold">
                    {unreadCount}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead(businessId)}
                    className="btn btn-ghost btn-xs gap-1 text-xs normal-case"
                    title={t("notification.markAllAsRead")}
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {t("notification.markAllAsRead")}
                    </span>
                  </button>
                )}
                {hasRead && (
                  <button
                    onClick={() => clearRead(businessId)}
                    className="btn btn-ghost btn-md gap-1 text-xs normal-case w-10 px-3 text-base-content/50"
                    title={t("notification.clearRead")}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {t("notification.clearRead")}
                    </span>
                  </button>
                )}
                {/* Mobile close */}
                <button
                  onClick={() => setOpen(false)}
                  className="btn btn-ghost btn-xs sm:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-base-100">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-base-content/50">
                  <span className="loading loading-spinner loading-sm text-secondary" />
                  <span className="text-sm">{t("notification.loading")}</span>
                </div>
              ) : (notifications.length === 0 && systemNotifications.length === 0) ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
                    <Bell className="w-8 h-8 text-base-content/30" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-medium text-base-content">
                      {t("notification.noNotifications")}
                    </p>
                    <p className="text-sm text-base-content/50 mt-1">
                      {t("notification.allCaughtUp")}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {/* System Announcements */}
                  {systemNotifications && systemNotifications.length > 0 && (
                    <>
                      <div className="px-4 py-2 bg-primary/10 border-b border-primary/20">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                          <Megaphone className="w-3.5 h-3.5 shrink-0" />
                          {t("notification.announcements") || "Announcements"}
                        </span>
                      </div>
                      {systemNotifications.map((sys) => (
                        <div key={sys.id} className="p-4 border-b border-base-200 hover:bg-base-200/40 transition-colors flex items-start gap-3">
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            sys.type === 'DANGER' ? 'bg-error/15 text-error' :
                            sys.type === 'WARNING' ? 'bg-warning/15 text-warning' :
                            sys.type === 'SUCCESS' ? 'bg-success/15 text-success' : 'bg-info/15 text-info'
                          }`}>
                            <Megaphone className="w-4 h-4 shrink-0" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-base-content leading-tight">{sys.title}</p>
                            <p className="text-xs text-base-content/60 mt-1 leading-relaxed">{sys.message}</p>
                            <p className="text-[9px] text-base-content/40 mt-1">{timeAgo(sys.createdAt, t)}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Unread section */}
                  {notifications.some((n) => !n.isRead) && (
                    <>
                      <div className="px-4 py-2 bg-base-200/60">
                        <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                          {t("notification.unread")} ({unreadCount})
                        </span>
                      </div>
                      {notifications
                        .filter((n) => !n.isRead)
                        .map((n) => (
                          <NotificationItem
                            key={n.id}
                            n={n}
                            businessId={businessId}
                            t={t}
                          />
                        ))}
                    </>
                  )}

                  {/* Read section */}
                  {notifications.some((n) => n.isRead) && (
                    <>
                      <div className="px-4 py-2 bg-base-200/60">
                        <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                          {t("notification.read")}
                        </span>
                      </div>
                      {notifications
                        .filter((n) => n.isRead)
                        .map((n) => (
                          <NotificationItem
                            key={n.id}
                            n={n}
                            businessId={businessId}
                            t={t}
                          />
                        ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}