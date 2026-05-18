import { Copy, Eye, EyeOff, Info, LogOut, MessageCircleCode, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import simxelLogo from "../assets/logo.svg";
import { useAuthStore } from "../stores/authStore";
import { useBusinessStore } from "../stores/businessStore";
import { useT } from "../hooks/useT";

export default function PendingActivationPage() {
  const { t } = useT();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { selectedBusiness, clearBusiness } = useBusinessStore();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!selectedBusiness) return null;

  const handleLogout = () => {
    clearBusiness();
    logout();
    navigate("/login");
  };

  const handleSwitchBusiness = () => {
    clearBusiness();
    navigate("/select-business");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedBusiness.secretKey || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Pre-filled WhatsApp message
  const whatsappNumber = "237688185548"; // Replace with actual Simxel Support Number
  const message = `Bonjour l'équipe Simxel,
                  \nJe viens d'effectuer le paiement de 50 000 FCFA pour activer ma licence POS.
                  \n\n*Commerce* : ${selectedBusiness.name}
                  \n*Email* : ${selectedBusiness.ownerId}
                  \n\nMerci de procéder à l'activation.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col font-sans text-base-content selection:bg-primary/30">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-base-300 bg-base-100 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <img src={simxelLogo} alt="Simxel" className="w-8 h-8" />
          <span className="font-black text-xl tracking-tight hidden sm:inline">SIMXEL</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={handleSwitchBusiness} className="btn btn-sm btn-ghost font-bold text-base-content/70">
            {t("pendingActivation.switchBusiness")}
          </button>
          <button onClick={handleLogout} className="btn btn-sm btn-outline border-base-300 text-error hover:bg-error hover:text-white hover:border-error">
            <LogOut size={14} /> <span className="hidden sm:inline">{t("pendingActivation.logout")}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-base-100 rounded-[2rem] shadow-2xl overflow-hidden border border-base-300">

          {/* Left Column: Information */}
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-base-100 to-base-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-warning/10 text-warning mb-6 shadow-inner">
              <ShieldCheck size={32} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
              {t("pendingActivation.title")}
            </h1>

            <p className="text-base-content/70 font-medium text-lg leading-relaxed mb-8">
              {t("pendingActivation.desc", { name: selectedBusiness.name })}
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck size={120} />
              </div>
              <h3 className="font-black text-2xl text-primary mb-1">{t("pendingActivation.priceText")}</h3>
              <p className="text-sm font-bold text-primary/70 uppercase tracking-widest">{t("pendingActivation.priceSub")}</p>

              <ul className="mt-4 space-y-2 text-sm font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> {t("pendingActivation.feature1")}</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> {t("pendingActivation.feature2")}</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> {t("pendingActivation.feature3")}</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Instructions */}
          <div className="p-8 sm:p-10 lg:p-12 lg:pl-0 flex flex-col justify-center">

            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Info className="text-secondary" /> {t("pendingActivation.howToActivate")}
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-base-300 before:to-transparent">

              {/* Step 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-base-100 bg-secondary text-white font-black shadow shrink-0 z-10">
                  {t("pendingActivation.step1Num")}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-base-300 bg-base-100 shadow-sm group-hover:border-secondary transition-colors ml-4 md:ml-0 md:mr-4">
                  <h4 className="font-bold text-base-content mb-1">{t("pendingActivation.step1Title")}</h4>
                  <p className="text-xs text-base-content/60 leading-relaxed">{t("pendingActivation.step1Desc")}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:even:flex-row group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-base-100 bg-base-200 text-base-content/50 font-black shadow shrink-0 z-10">
                  {t("pendingActivation.step2Num")}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-base-300 bg-base-100 shadow-sm ml-4 md:ml-4">
                  <h4 className="font-bold text-base-content mb-1">{t("pendingActivation.step2Title")}</h4>
                  <p className="text-xs text-base-content/60 leading-relaxed mb-3">{t("pendingActivation.step2Desc")}</p>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-success text-white w-full shadow-lg shadow-success/30 border-none">
                    <MessageCircleCode size={16} /> {t("pendingActivation.whatsappBtn")}
                  </a>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-base-100 bg-base-200 text-base-content/50 font-black shadow shrink-0 z-10">
                  {t("pendingActivation.step3Num")}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-base-300 bg-base-100 shadow-sm ml-4 md:ml-0 md:mr-4">
                  <h4 className="font-bold text-base-content mb-1">{t("pendingActivation.step3Title")}</h4>
                  <p className="text-xs text-base-content/60 leading-relaxed mb-3">{t("pendingActivation.step3Desc")}</p>

                  {/* Secret Key Display */}
                  <div className="flex items-center justify-between bg-base-200 p-2 rounded-lg border border-base-300">
                    <span className="font-mono text-xs font-bold tracking-widest opacity-80 overflow-hidden text-ellipsis whitespace-nowrap pl-2">
                      {showKey ? selectedBusiness.secretKey : "••••••••••••••••••••••••"}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setShowKey(!showKey)} className="btn btn-xs btn-square btn-ghost opacity-50 hover:opacity-100" title={showKey ? t("pendingActivation.hideKey") : t("pendingActivation.showKey")}>
                        {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={copyToClipboard} className="btn btn-xs btn-square btn-ghost opacity-50 hover:opacity-100 text-primary" title={t("pendingActivation.copy")}>
                        {copied ? <CheckCircle2 size={14} className="text-success" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Temporary CheckCircle2 declaration since lucide-react doesn't export it in older versions.
function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
