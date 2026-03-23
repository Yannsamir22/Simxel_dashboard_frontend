import { Store } from "lucide-react";
import React from "react";
import { useT } from "../../../hooks/useT";

const NoSales: React.FC = () => {
  const { t } = useT();
  return (
    <div className="bg-base-200 border border-base-300 rounded-xl p-12 flex flex-col items-center justify-center opacity-40">
      <Store size={40} className="mb-3" />
      <p className="font-black uppercase tracking-widest text-sm">
        {t("dashboard.noSales")}
      </p>
    </div>
  );
};

export default NoSales;
