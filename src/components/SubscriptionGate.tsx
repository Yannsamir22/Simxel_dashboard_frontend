import { CalendarDays, ExternalLink, LogOut, MessageCircleCode, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import simxelLogo from "../assets/logo.svg";
import { useAuthStore } from "../stores/authStore";
import { useBusinessStore } from "../stores/businessStore";
import { useT } from "../hooks/useT";

export default function SubscriptionGate() {
  const { t } = useT();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { selectedBusiness, clearBusiness } = useBusinessStore();

  const handleLogout = () => {
    clearBusiness();
    logout();
    navigate("/login");
  };

  const handleSwitchBusiness = () => {
    clearBusiness();
    navigate("/select-business");
  };

  if (!selectedBusiness) return null;

  // Pre-filled WhatsApp message
  const whatsappNumber = "237688185548"; // Simxel Support
  const message = `Bonjour l'équipe Simxel,\nJe souhaite renouveler mon abonnement au tableau de bord Cloud.\n\n*Commerce* : ${selectedBusiness.name}\n*Email* : ${selectedBusiness.ownerId}\n\nMerci de m'indiquer la procédure de paiement.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-base-200/90 backdrop-blur-xl font-sans text-base-content overflow-y-auto">
      
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-base-300/50 bg-base-100/50 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src={simxelLogo} alt="Simxel" className="w-8 h-8" />
          <span className="font-black text-xl tracking-tight hidden sm:inline">SIMXEL</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={handleSwitchBusiness} className="btn btn-sm btn-ghost font-bold text-base-content/70">
            {t("subscriptionGate.switchBusiness")}
          </button>
          <button onClick={handleLogout} className="btn btn-sm btn-outline border-base-300 text-error hover:bg-error hover:text-white hover:border-error">
            <LogOut size={14} /> <span className="hidden sm:inline">{t("subscriptionGate.logout")}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 animate-in zoom-in-95 duration-500">
        <div className="max-w-2xl w-full bg-base-100 rounded-[2.5rem] shadow-2xl border border-error/20 overflow-hidden relative">
          
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-error via-warning to-error"></div>

          <div className="p-8 sm:p-12 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-5">
              <ShieldAlert size={200} />
            </div>

            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10 text-error mb-6 shadow-inner relative z-10">
              <CalendarDays size={36} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-base-content relative z-10">
              {t("subscriptionGate.title")}
            </h1>
            
            <p className="text-base-content/70 font-medium text-lg leading-relaxed mb-8 relative z-10">
              {t("subscriptionGate.desc", { name: selectedBusiness.name })}
            </p>

            <div className="bg-base-200 border border-base-300 rounded-3xl p-6 sm:p-8 w-full mb-8 relative z-10">
              <h3 className="font-black text-3xl text-secondary mb-1">10 000 FCFA <span className="text-sm font-bold text-base-content/50 uppercase tracking-widest">{t("subscriptionGate.priceSuffix")}</span></h3>
              <p className="text-sm font-bold text-base-content/60 mb-6">{t("subscriptionGate.priceSub")}</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-secondary w-full sm:w-auto px-8 rounded-xl shadow-lg shadow-secondary/30">
                  <MessageCircleCode size={18} /> {t("subscriptionGate.contactBtn")}
                </a>
                <a href="https://simxel.com/pricing" target="_blank" rel="noreferrer" className="btn btn-ghost w-full sm:w-auto px-8 rounded-xl text-base-content/60 hover:text-base-content">
                  {t("subscriptionGate.learnMore")} <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className="text-xs font-medium text-base-content/40 bg-warning/10 text-warning px-4 py-3 rounded-xl inline-flex items-center gap-2 relative z-10">
              <ShieldAlert size={14} /> {t("subscriptionGate.footerNote")}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
