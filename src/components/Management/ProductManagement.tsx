import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "../../hooks/useT";
import { useProductStore, type Product } from "../../stores/productStore";
import { useToastStore } from "../../stores/toastStore";
import ManagementModal, {
  PRODUCT_FIELDS,
  type ModalMode,
} from "./ManagementModal";
import ProductSkeleton from "./skeleton/ProductSkeleton";

const ProductManagement = () => {
  const { t } = useT();
  const addToast = useToastStore((s: any) => s.addToast);

  const {
    products,
    fetchProducts,
    loading,
    addProduct,
    editProduct,
    removeProduct,
  } = useProductStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [target, setTarget] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openCreate = () => {
    setTarget(null);
    setMode("create");
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setTarget(p);
    setMode("edit");
    setModalOpen(true);
  };

  const openDelete = (p: Product) => {
    setTarget(p);
    setMode("delete");
    setModalOpen(true);
  };

  const handleCreate = async (data: any) => {
    const result = await addProduct(data);
    if (result.success) addToast(t("products.addProduct") + " ✓", "success");
    return result;
  };
  const handleEdit = async (data: any) => {
    const result = await editProduct(target!.id, data);
    if (result.success) addToast(t("common.save") + " ✓", "success");
    return result;
  };
  const handleDelete = async () => {
    const result = await removeProduct(target!.id);
    if (result.success) addToast(t("products.deleted"), "success");
    return result;
  };
  if (loading) return <ProductSkeleton />;

  return (
    <div className="px-4 pb-24 md:pd-6 space-y-6 animate-in fade-in duration-300 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-base-200 rounded-md shadow-xl border border-base-300 overflow-hidden animate-in fade-in duration-500">
        <div className="p-6 border-b border-base-300 flex justify-between items-center relative">
          <div className="absolute left-4 top-8 bottom-8 w-px bg-primary" />
          <div className="pl-6">
            <h3 className="text-xl font-black uppercase tracking-tighter">
              {t("products.title")}
            </h3>
            <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em]">
              {t("products.subtitle")}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="btn btn-primary btn-sm rounded-sm font-bold uppercase text-[10px] tracking-widest"
          >
            <Plus size={16} /> {t("products.addProduct")}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-300/50 border-b border-base-300 text-[10px] uppercase tracking-widest opacity-50">
                <th className="pl-10">{t("common.name")}</th>
                <th className="text-center">{t("products.salePrice")}</th>
                <th className="text-center">{t("products.unitCost")}</th>
                <th className="text-center">{t("products.stock")}</th>
                <th className="text-right pr-10">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-base-300/30 transition-colors border-b border-base-300/50"
                >
                  <td className="pl-10 font-bold text-sm uppercase tracking-tight">
                    {prod.name}
                  </td>
                  <td className="text-center font-black text-primary italic">
                    {prod.salePrice.toLocaleString()} FCFA
                  </td>
                  <td className="text-center text-sm opacity-60">
                    {prod.unitCost != null
                      ? `${prod.unitCost.toLocaleString()} FCFA`
                      : "—"}
                  </td>
                  <td className="text-center">
                    <span
                      className={`font-black px-2 py-1 rounded-sm text-sm
                          ${prod.stock <= 0
                          ? "bg-error/20 text-error"
                          : prod.stock <= (prod.minStockAlert ?? 5)
                            ? "bg-warning/20 text-warning"
                            : "text-secondary"
                        }`}
                    >
                      {prod.stock}
                    </span>
                  </td>
                  <td className="text-right pr-10 space-x-2">
                    <button
                      onClick={() => openEdit(prod)}
                      className="btn btn-ghost btn-xs hover:text-primary"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => openDelete(prod)}
                      className="btn btn-ghost btn-xs hover:text-error"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ManagementModal
        open={modalOpen}
        mode={mode}
        onClose={() => setModalOpen(false)}
        fields={PRODUCT_FIELDS}
        entityName="Product"
        accentColor="primary"
        initial={target ?? undefined}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProductManagement;
