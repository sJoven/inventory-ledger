"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { deleteProduct } from "@/src/app/products/actions";
import DeleteConfirmModal from "@/src/components/DeleteConfirmModal";
import { updateProduct } from "@/src/app/products/actions";
import EditProductModal from "@/src/components/EditProductModal";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
}

export default function ProductTable({
  products,
  isLoading,
}: {
  products: Product[];
  isLoading?: boolean;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetProduct, setTargetProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);

  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleConfirmDelete = async () => {
    if (!targetProduct) return;

    setIsDeleting(true);
    const result = await deleteProduct(targetProduct.id);

    if (result.success) {
      setTargetProduct(null);
    } else {
      alert("Error deleting product");
    }
    setIsDeleting(false);
  };

  const handleSaveEdit = async (
    id: string,
    data: { name: string; sku: string; quantity: number },
  ) => {
    setIsEditing(true);
    const result = await updateProduct(id, data);
    if (result.success) {
      setEditTarget(null);
    } else {
      alert(result.message);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId]!.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuId]);

  const toggleMenu = useCallback((id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }, []);

  const ActionMenu = ({
    product,
    isOpen,
  }: {
    product: Product;
    isOpen: boolean;
  }) => (
    <div
      className="relative inline-block"
      ref={(el) => {
        if (el) menuRefs.current[product.id] = el;
        else delete menuRefs.current[product.id];
      }}
    >
      <button
        onClick={() => {
          toggleMenu(product.id);
        }}
        className={`p-2 rounded-full transition-all focus:outline-none ${
          isOpen
            ? "bg-[#fc6022] text-[#fff]"
            : "text-[#3a3a3a] hover:bg-[#fc6022] hover:text-[#fff]"
        }`}
        aria-label="Product actions"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[60] mt-2 w-40 origin-top-right rounded-lg bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
          <div className="py-1">
            <button
              type="button"
              className="block w-full px-4 py-2.5 text-left text-[0.875rem] text-[#3a3a3a] hover:bg-[#fc6022] hover:text-white transition-colors"
              onClick={() => {
                console.log("CLICK WORKS");
                setEditTarget(product);
                setOpenMenuId(null);
              }}
            >
              Edit Product
            </button>
            <button
              type="button"
              className="block w-full px-4 py-2.5 text-left text-[0.875rem] text-red-600 hover:bg-red-500/30 font-medium transition-colors"
              onClick={() => {
                setTargetProduct({
                  id: product.id,
                  name: product.name,
                });
                setOpenMenuId(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="w-full">
        <div className="md:hidden space-y-4 p-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 
                 shadow-sm transition-all duration-300 ease-out
                 hover:shadow-xl hover:-translate-y-1 hover:border-[#fc6022]/30"
            >
              <div
                className="absolute top-0 left-6 w-8 h-1 bg-[#fc6022] rounded-b-full 
                      opacity-40 transition-all duration-300 
                      group-hover:w-16 group-hover:opacity-100"
              />

              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-xl font-extrabold text-[#3a3a3a] mb-1 tracking-tight 
                         group-hover:text-[#fc6022] transition-colors duration-300"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="px-2 py-0.5 bg-gray-100 text-[#3a3a3a] text-[10px] 
                             font-bold uppercase tracking-wider rounded-md"
                    >
                      SKU
                    </span>
                    <span className="text-sm font-mono text-gray-400 group-hover:text-gray-600">
                      {product.sku}
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between bg-gray-50 rounded-xl p-3 
                          border border-gray-100 transition-colors duration-300 
                          group-hover:bg-white group-hover:border-[#fc6022]/10"
                  >
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      In Stock
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#3a3a3a] group-hover:text-[#fc6022] transition-colors">
                        {product.quantity}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        units
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <ActionMenu
                    product={product}
                    isOpen={openMenuId === product.id}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block">
          <div className="w-full overflow-x-auto scrollbar-hide rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-[rgb(23,33,44)]">
                <tr>
                  <th className="px-6 py-4 text-left text-[0.875rem] font-bold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-[0.875rem] font-bold text-white uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-[0.875rem] font-bold text-white uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-right text-[0.875rem] font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className={`
            transition-colors duration-150
            odd:bg-white 
            even:bg-[rgb(23,33,44)]/[0.1] 
          `}
                  >
                    <td className="px-6 py-4 text-[0.875rem] text-[#3a3a3a] font-semibold border-b border-gray-100">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-[0.875rem] text-[#3a3a3a] opacity-60 font-mono border-b border-gray-100">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-[0.875rem] text-[#3a3a3a] border-b border-gray-100">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 text-right border-b border-gray-100">
                      <ActionMenu
                        product={product}
                        isOpen={openMenuId === product.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {products.length === 0 && (
        <div className="p-12 text-center text-gray-400 italic">
          No products found.
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!targetProduct}
        title="Delete Product"
        itemName={targetProduct?.name || ""}
        isPending={isDeleting}
        onClose={() => setTargetProduct(null)}
        onConfirm={handleConfirmDelete}
      />
      <EditProductModal
        isOpen={!!editTarget}
        product={editTarget}
        existingProducts={products}
        isPending={isEditing}
        onClose={() => setEditTarget(null)}
        onSave={handleSaveEdit}
      />
    </>
  );
}
