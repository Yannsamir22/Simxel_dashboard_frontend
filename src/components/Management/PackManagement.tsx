import { Check, Edit2, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useT } from "../../hooks/useT";
import { usePackageStore, type Package } from "../../stores/packageStore";
import { useServiceStore } from "../../stores/serviceStore";
import { useToastStore } from "../../stores/toastStore";
import ManagementModal, {
  PACKAGE_FIELDS,
  type ModalMode,
} from "./ManagementModal";
import PackageSkeleton from "./skeleton/PackageSkeleton";

const PackManagement: React.FC = () => {
  const { t } = useT();
  const addToast = useToastStore((s: any) => s.addToast);

  const {
    packages,
    fetchPackages,
    addPackage,
    editPackage,
    removePackage,
    loading,
  } = usePackageStore();

  const { loadServices } = useServiceStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [target, setTarget] = useState<Package | null>(null);

  useEffect(() => {
    fetchPackages();
    loadServices();
  }, [fetchPackages, loadServices]);

  const openCreate = () => {
    setTarget(null);
    setMode("create");
    setModalOpen(true);
  };

  const openEdit = (p: Package) => {
    setTarget(p);
    setMode("edit");
    setModalOpen(true);
  };

  const openDelete = (p: Package) => {
    setTarget(p);
    setMode("delete");
    setModalOpen(true);
  };

  const toInitial = (pkg: Package) => ({
    ...pkg,
    serviceIds: pkg.services.map((s) => s.serviceId),
  });

  const handleCreate = async (data: any) => {
    const result = await addPackage(data);
    if (result.success) addToast(t("packages.addPackage") + " ✓", "success");
    return result;
  };

  const handleEdit = async (data: any) => {
    const result = await editPackage(target!.id, data);
    if (result.success) addToast(t("common.save") + " ✓", "success");
    return result;
  };

  const handleDelete = async () => {
    const result = await removePackage(target!.id);
    if (result.success) addToast(t("packages.deleted"), "success");
    return result;
  };

  if (loading) return <PackageSkeleton />;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 pt-6 pb-36 md:pb-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-6 border-b border-base-300 flex justify-between items-center relative">
        <div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-primary">
            {t("packages.title")}
          </h3>

          <p className="text-[10px] font-bold opacity-50 uppercase tracking-wider">
            {t("packages.subtitle")}
          </p>
        </div>

        <button
          onClick={openCreate}
          className="btn btn-primary btn-sm rounded-sm font-bold uppercase text-[10px] tracking-widest"
        >
          <Plus size={16} /> {t("packages.addPackage")}
        </button>
      </div>

      {/* Empty state */}
      {packages.length === 0 && (
        <div className="flex items-center justify-center py-16 opacity-30">
          <p className="font-black uppercase tracking-widest text-sm">
            {t("packages.noPackages")}
          </p>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-base-200 border border-base-300 rounded-xl overflow-hidden hover:border-primary/50 transition-all group shadow-sm"
          >
            {/* Card header */}
            <div className="p-5 border-b border-base-300 flex justify-between items-start bg-base-300/30">
              <h4 className="font-black uppercase text-sm tracking-tight">
                {pkg.name}
              </h4>

              <span className="text-primary font-black text-sm">
                {pkg.price.toLocaleString()} FCFA
              </span>
            </div>

            {/* Services list */}
            <div className="p-5 space-y-3">
              <p className="text-[9px] font-bold uppercase opacity-40 tracking-widest">
                {t("packages.included")} :
              </p>

              <div className="flex flex-wrap gap-2">
                {pkg.services.length > 0 ? (
                  pkg.services.map((item) => (
                    <div
                      key={item.serviceId}
                      className="flex items-center gap-1 bg-base-300 px-2 py-1 rounded border border-base-100"
                    >
                      <Check size={10} className="text-primary" />

                      <span className="text-[10px] font-bold uppercase">
                        {item.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-[10px] italic opacity-30">
                    {t("packages.noServices")}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-2 bg-base-300/10 flex justify-end gap-1">
              <button
                onClick={() => openEdit(pkg)}
                className="btn btn-ghost btn-xs hover:text-primary"
              >
                <Edit2 size={14} />
              </button>

              <button
                onClick={() => openDelete(pkg)}
                className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ManagementModal
        open={modalOpen}
        mode={mode}
        onClose={() => setModalOpen(false)}
        fields={PACKAGE_FIELDS}
        entityName="Package"
        accentColor="primary"
        initial={target ? toInitial(target) : undefined}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PackManagement;
