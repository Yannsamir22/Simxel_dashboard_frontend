import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "../../hooks/useT";
import Loading from "../../loadash/Loading";
import { useServiceStore, type Service } from "../../stores/serviceStore";
import ManagementModal, {
  SERVICE_FIELDS,
  type ModalMode,
} from "./ManagementModal";
import { useToastStore } from "../../stores/toastStore";
import ServiceSkeleton from "./skeleton/ServiceSkeleton";

const ServiceManagement = () => {
  const { t } = useT();
  const addToast = useToastStore((s: any) => s.addToast);

  const {
    services,
    loadServices,
    addService,
    editService,
    removeService,
    loading,
  } = useServiceStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [target, setTarget] = useState<Service | null>(null);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const openCreate = () => {
    setTarget(null);
    setMode("create");
    setModalOpen(true);
  };
  const openEdit = (s: Service) => {
    setTarget(s);
    setMode("edit");
    setModalOpen(true);
  };
  const openDelete = (s: Service) => {
    setTarget(s);
    setMode("delete");
    setModalOpen(true);
  };

  const handleCreate = async (data: any) => {
    const result = await addService(data);
    if (result.success) addToast(t("services.addService") + " ✓", "success");
    return result;
  };
  const handleEdit = async (data: any) => {
    const result = await editService(target!.id, data);
    if (result.success) addToast(t("common.save") ,"success");
    return result;
  };
  const handleDelete = async () => {
    const result = await removeService(target!.id);
    if (result.success) addToast("Service deleted", "success");
    return result;
  };

  if (loading) return <ServiceSkeleton />;

  return (
    <div className="space-y-6">
      <div className="bg-base-200 rounded-md shadow-xl border border-base-300 overflow-hidden animate-in fade-in duration-500">
        <div className="p-6 border-b border-base-300 flex justify-between items-center relative">
          <div className="absolute left-4 top-8 bottom-8 w-px bg-primary" />
          <div className="pl-6">
            <h3 className="text-xl font-black uppercase tracking-tighter">
              {t("services.title")}
            </h3>
            <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em]">
              {t("services.subtitle")}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="btn btn-primary btn-sm rounded-sm font-bold gap-2 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
          >
            <Plus size={16} />
            {t("services.addService")}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-300/50 border-b border-base-300 text-[10px] uppercase tracking-widest opacity-50">
                <th className="pl-10">{t("common.name")}</th>
                <th className="text-center">{t("common.price")}</th>
                <th className="text-right pr-10">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-12 opacity-20 font-black uppercase tracking-widest text-sm"
                  >
                    {t("services.noServices")}
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr
                    key={service.id}
                    className="hover:bg-base-300/30 transition-colors border-b border-base-300/50"
                  >
                    <td className="pl-10 font-bold text-sm uppercase tracking-tight">
                      {service.name}
                    </td>
                    <td className="pl-10 justify-center flex font-bold text-sm uppercase tracking-tight ">
                      {service.price.toLocaleString()} FCFA
                    </td>

                    <td className="text-right pr-10 space-x-2">
                      <button
                        onClick={() => openEdit(service)}
                        className="btn btn-ghost btn-xs hover:text-primary"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => openDelete(service)}
                        className="btn btn-ghost btn-xs hover:text-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ManagementModal
        open={modalOpen}
        mode={mode}
        onClose={() => setModalOpen(false)}
        fields={SERVICE_FIELDS}
        entityName="Service"
        accentColor="primary"
        initial={target ?? undefined}
        onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDelete}
      />
    </div>
  );
};

export default ServiceManagement;
