"use client";

import { useState, useEffect, useRef } from "react";
import { deleteProduct } from "@/app/products/actions";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { updateProduct } from "@/app/products/actions";
import EditProductModal from "@/components/EditProductModal";

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

  const menuRef = useRef<HTMLDivElement | null>(null);
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
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div className="overflow-x-auto overflow-y-scroll [scrollbar-gutter:stable] rounded-lg border border-gray-200 pb-24">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-900 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-900 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-900 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-700 font-medium">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                  {product.sku}
                </td>
                <td className="px-4 py-3 text-gray-700">{product.quantity}</td>
                <td className="px-4 py-3 text-right">
                  <div
                    className={`relative inline-block ${openMenuId === product.id ? "z-50" : ""}`}
                    ref={openMenuId === product.id ? menuRef : null}
                  >
                    <button
                      onClick={() => toggleMenu(product.id)}
                      className={`p-2 rounded-full transition-colors focus:outline-none ${
                        openMenuId === product.id
                          ? "bg-gray-200"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-xl leading-none px-1">⋮</span>
                    </button>

                    {openMenuId === product.id && (
                      <div className="absolute right-0 z-50 mt-1 w-32 origin-top-right rounded-md border border-gray-200 bg-white shadow-xl">
                        <div className="py-1">
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => {
                              setEditTarget(product);
                              setOpenMenuId(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-12 text-center text-gray-400 italic">
            No products found for this store.
          </div>
        )}
      </div>
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
