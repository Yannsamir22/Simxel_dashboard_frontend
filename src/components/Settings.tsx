// src/components/Settings.tsx
import {
  Building2,
  Check,
  ChevronRight,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../hooks/useT";
import { AuthService } from "../services/authService";
import { BusinessService } from "../services/businessService";
import { useAuthStore } from "../stores/authStore";
import { useBusinessStore } from "../stores/businessStore";
import ToggleLanguage from "./toggles/ToggleLanguage";
import ToggleTheme from "./toggles/ToggleTheme";

function useFeedback() {
  const { t } = useT();
  const [state, setState] = useState<{
    loading: boolean;
    success: string | null;
    error: string | null;
  }>({ loading: false, success: null, error: null });

  const run = async (
    fn: () => Promise<{ ok: boolean; message?: string; error?: string }>,
  ) => {
    setState({ loading: true, success: null, error: null });
    try {
      const res = await fn();
      if (res.ok) {
        setState({
          loading: false,
          success: res.message ?? t("settings.successMessage"),
          error: null,
        });
        setTimeout(() => setState((s) => ({ ...s, success: null })), 3000);
      } else {
        setState({
          loading: false,
          success: null,
          error: res.error ?? t("settings.failureMessage"),
        });
      }
    } catch (err: any) {
      setState({
        loading: false,
        success: null,
        error: err.response?.data?.error ?? t("settings.errorMessage"),
      });
    }
  };

  return { ...state, run };
}

const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-base-200 border border-base-300 rounded-xl overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-base-300">
      <span className="text-primary">{icon}</span>
      <h2 className="font-black text-sm uppercase tracking-widest">{title}</h2>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

const PwField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const { t } = useT();
  return (
    <div className="form-control">
      <label className="label pb-1">
        <span className="label-text text-xs font-bold uppercase tracking-widest opacity-50">
          {label}
        </span>
      </label>
      <input
        type="password"
        className="input input-bordered input-sm w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t("auth.passwordPlaceholder")}
      />
    </div>
  );
};

const Feedback = ({
  success,
  error,
}: {
  success: string | null;
  error: string | null;
}) => {
  if (success)
    return (
      <div className="flex items-center gap-2 text-success text-xs font-bold">
        <Check size={14} /> {success}
      </div>
    );
  if (error) return <p className="text-error text-xs font-bold">{error}</p>;
  return null;
};

const Settings = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { owner, logout } = useAuthStore();
  const { selectedBusiness, clearBusiness } = useBusinessStore();

  const [bizName, setBizName] = useState(selectedBusiness?.name ?? "");
  const [bizCurrency, setBizCurrency] = useState(
    selectedBusiness?.currency ?? "FCFA",
  );
  const [bizType, setBizType] = useState(selectedBusiness?.type ?? "SERVICE");
  const bizFeedback = useFeedback();

  const [posConfig, setPosConfig] = useState<{
    exists: boolean;
    isSynced: boolean;
    lastUpdated: string | null;
  } | null>(null);

  useEffect(() => {
    BusinessService.getPosConfig()
      .then((res) => {
        if (res.ok) setPosConfig(res.data);
      })
      .catch(() => {});
  }, []);

  const [mgr, setMgr] = useState({ current: "", next: "" });
  const mgrFeedback = useFeedback();

  const [adm, setAdm] = useState({ current: "", next: "" });
  const admFeedback = useFeedback();

  const [reset, setReset] = useState({ main: "", admin: "" });
  const resetFeedback = useFeedback();

  const [ownerPw, setOwnerPw] = useState({ old: "", next: "" });
  const ownerPwFeedback = useFeedback();

  const handleLogout = () => {
    logout();
    clearBusiness();
    navigate("/login");
  };

  const handleSwitchBusiness = () => {
    clearBusiness();
    navigate("/select-business");
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">{t("settings.title")}</h1>
          <p className="text-xs opacity-50 mt-0.5">{selectedBusiness?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <ToggleLanguage />
          <ToggleTheme />
        </div>
      </div>

      {/* Business info */}
      <Section
        icon={<Building2 size={16} />}
        title={t("settings.businessInfo")}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="form-control sm:col-span-2">
            <label className="label pb-1">
              <span className="label-text text-xs font-bold uppercase tracking-widest opacity-50">
                {t("register.businessName")}
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-xs font-bold uppercase tracking-widest opacity-50">
                {t("register.currency")}
              </span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={bizCurrency}
              onChange={(e) => setBizCurrency(e.target.value)}
            >
              <option value="FCFA">FCFA</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-xs font-bold uppercase tracking-widest opacity-50">
                {t("register.businessType")}
              </span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={bizType}
              onChange={(e) => setBizType(e.target.value)}
            >
              <option value="SERVICE">Service</option>
              <option value="RETAIL">Retail</option>
              <option value="RESTAURANT">Restaurant</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <Feedback success={bizFeedback.success} error={bizFeedback.error} />
          <button
            className="btn btn-primary btn-sm ml-auto"
            disabled={bizFeedback.loading}
            onClick={() =>
              bizFeedback.run(() =>
                BusinessService.updateBusinessInfo({
                  name: bizName,
                  currency: bizCurrency,
                  type: bizType,
                }),
              )
            }
          >
            {bizFeedback.loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              t("common.save")
            )}
          </button>
        </div>
      </Section>

      {/* Remote POS config */}
      <Section icon={<ShieldCheck size={16} />} title={t("settings.posConfig")}>
        {posConfig && (
          <div className="flex items-center gap-2 text-xs pb-2 border-b border-base-300">
            <span className="opacity-50">{t("settings.posStatus")}:</span>
            {posConfig.exists ? (
              <span
                className={`badge badge-sm ${posConfig.isSynced ? "badge-success" : "badge-warning"}`}
              >
                {posConfig.isSynced
                  ? t("settings.synced")
                  : t("settings.pendingSync")}
              </span>
            ) : (
              <span className="badge badge-sm badge-error">
                {t("settings.notActivated")}
              </span>
            )}
            {posConfig.lastUpdated && (
              <span className="opacity-30 ml-auto">
                {new Date(posConfig.lastUpdated).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-widest opacity-40">
            {t("settings.managerPassword")}
          </p>
          <PwField
            label={t("settings.currentAdminPw")}
            value={mgr.current}
            onChange={(v) => setMgr((s) => ({ ...s, current: v }))}
          />
          <PwField
            label={t("settings.newManagerPw")}
            value={mgr.next}
            onChange={(v) => setMgr((s) => ({ ...s, next: v }))}
          />
          <div className="flex items-center justify-between">
            <Feedback success={mgrFeedback.success} error={mgrFeedback.error} />
            <button
              className="btn btn-sm btn-outline ml-auto"
              disabled={mgrFeedback.loading || !mgr.current || !mgr.next}
              onClick={() =>
                mgrFeedback.run(() =>
                  BusinessService.changePosMainPassword({
                    currentAdminPassword: mgr.current,
                    newMainPassword: mgr.next,
                  }).then((r) => {
                    if (r.ok) setMgr({ current: "", next: "" });
                    return {
                      ok: r.ok,
                      message: t("settings.passwordUpdated"),
                      error: r.error,
                    };
                  }),
                )
              }
            >
              {mgrFeedback.loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t("common.update")
              )}
            </button>
          </div>
        </div>

        <div className="divider my-1" />

        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-widest opacity-40">
            {t("settings.adminPassword")}
          </p>
          <PwField
            label={t("settings.currentAdminPw")}
            value={adm.current}
            onChange={(v) => setAdm((s) => ({ ...s, current: v }))}
          />
          <PwField
            label={t("settings.newAdminPw")}
            value={adm.next}
            onChange={(v) => setAdm((s) => ({ ...s, next: v }))}
          />
          <div className="flex items-center justify-between">
            <Feedback success={admFeedback.success} error={admFeedback.error} />
            <button
              className="btn btn-sm btn-outline ml-auto"
              disabled={admFeedback.loading || !adm.current || !adm.next}
              onClick={() =>
                admFeedback.run(() =>
                  BusinessService.changePosAdminPassword({
                    currentAdminPassword: adm.current,
                    newAdminPassword: adm.next,
                  }).then((r) => {
                    if (r.ok) setAdm({ current: "", next: "" });
                    return {
                      ok: r.ok,
                      message: t("settings.passwordUpdated"),
                      error: r.error,
                    };
                  }),
                )
              }
            >
              {admFeedback.loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t("common.update")
              )}
            </button>
          </div>
        </div>

        <div className="divider my-1" />

        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-widest opacity-40">
            {t("settings.fullReset")}
          </p>
          <p className="text-xs opacity-50">{t("settings.fullResetNote")}</p>
          <PwField
            label={t("settings.newManagerPw")}
            value={reset.main}
            onChange={(v) => setReset((s) => ({ ...s, main: v }))}
          />
          <PwField
            label={t("settings.newAdminPw")}
            value={reset.admin}
            onChange={(v) => setReset((s) => ({ ...s, admin: v }))}
          />
          <div className="flex items-center justify-between">
            <Feedback
              success={resetFeedback.success}
              error={resetFeedback.error}
            />
            <button
              className="btn btn-sm btn-error btn-outline ml-auto gap-1"
              disabled={resetFeedback.loading || !reset.main || !reset.admin}
              onClick={() =>
                resetFeedback.run(() =>
                  BusinessService.resetPosPasswords({
                    mainPassword: reset.main,
                    adminPassword: reset.admin,
                  }).then((r) => {
                    if (r.ok) setReset({ main: "", admin: "" });
                    return r;
                  }),
                )
              }
            >
              {resetFeedback.loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <RefreshCw size={13} /> {t("settings.resetAll")}
                </>
              )}
            </button>
          </div>
        </div>
      </Section>

      {/* Owner account */}
      <Section icon={<User size={16} />} title={t("settings.ownerAccount")}>
        <div className="flex items-center gap-3 py-1">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-10">
              <span className="text-sm font-black">
                {(owner?.name ?? owner?.email ?? "?")[0].toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <p className="font-black text-sm">{owner?.name ?? "—"}</p>
            <p className="text-xs opacity-50">{owner?.email}</p>
          </div>
        </div>
        <div className="divider my-1" />
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-widest opacity-40">
            {t("settings.changeOwnerPassword")}
          </p>
          <PwField
            label={t("settings.currentPassword")}
            value={ownerPw.old}
            onChange={(v) => setOwnerPw((s) => ({ ...s, old: v }))}
          />
          <PwField
            label={t("settings.newPassword")}
            value={ownerPw.next}
            onChange={(v) => setOwnerPw((s) => ({ ...s, next: v }))}
          />
          <div className="flex items-center justify-between">
            <Feedback
              success={ownerPwFeedback.success}
              error={ownerPwFeedback.error}
            />
            <button
              className="btn btn-sm btn-outline ml-auto"
              disabled={
                ownerPwFeedback.loading || !ownerPw.old || !ownerPw.next
              }
              onClick={() =>
                ownerPwFeedback.run(() =>
                  AuthService.changePassword(ownerPw.old, ownerPw.next).then(
                    (r) => {
                      if (r.ok) setOwnerPw({ old: "", next: "" });
                      return r;
                    },
                  ),
                )
              }
            >
              {ownerPwFeedback.loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t("common.update")
              )}
            </button>
          </div>
        </div>
      </Section>

      <div className="space-y-2">
        <button
          onClick={handleSwitchBusiness}
          className="w-full flex items-center justify-between px-5 py-3 bg-base-200 border border-base-300 rounded-xl hover:border-primary/40 transition-all text-sm font-bold"
        >
          <div className="flex items-center gap-3">
            <Building2 size={16} className="opacity-50" />
            {t("settings.switchBusiness")}
          </div>
          <ChevronRight size={16} className="opacity-30" />
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3 bg-base-200 border border-base-300 rounded-xl hover:border-error/40 hover:text-error transition-all text-sm font-bold"
        >
          <LogOut size={16} className="opacity-50" />
          {t("auth.logout")}
        </button>
      </div>
      <div className="h-4" />
    </div>
  );
};

export default Settings;
