"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import EditProductModal from "@/src/app/admin/[id]/products/edit-product-modal";
import DeleteProductModal from "@/src/app/admin/[id]/products/delete-product-modal";

interface ProductRow {
  sku: string;
  name: string;
  id: string;
  image: string;
  description: string;
  quantity: number;
  price: number;
}

interface ProductTableProps {
  products: ProductRow[];
  existingSKUs?: string[];
  userId: string;
  currency: string;
  canDelete: boolean;
}

export default function ProductTable({
  products,
  existingSKUs = [],
  userId,
  currency,
  canDelete,
}: ProductTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuCoords, setMenuCoords] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<ProductRow | null>(null);

  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  // Fallback to prevent Intl crashes just in case
  const safeCurrency = currency || "PHP";

  // ... keep your existing useEffect ...
  useEffect(() => {
    function handleOutsideInteraction(event: Event) {
      if (!activeMenuId) return;
      if (event.type === "mousedown") {
        const target = event.target as HTMLElement;
        if (
          target.closest(".actions-menu-trigger") ||
          target.closest(".portaled-dropdown")
        ) {
          return;
        }
      }
      setActiveMenuId(null);
    }

    document.addEventListener("mousedown", handleOutsideInteraction);
    window.addEventListener("scroll", handleOutsideInteraction, true);
    window.addEventListener("resize", handleOutsideInteraction);

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      window.removeEventListener("scroll", handleOutsideInteraction, true);
      window.removeEventListener("resize", handleOutsideInteraction);
    };
  }, [activeMenuId]);

  return (
    <>
      <div
        ref={tableContainerRef}
        className="bg-white border rounded-xl overflow-hidden shadow-sm relative"
      >
        <table className="w-full text-left text-sm text-gray-600 border-collapse">
          {/* ... keep your existing thead ... */}
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b">
            <tr>
              <th className="p-4 w-20">Image</th>
              <th className="p-4">Product</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4">SKU</th>
              <th className="p-4 text-right">In Stock</th>
              <th className="p-4 text-center w-16">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              // ... keep your existing empty state ...
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-gray-400 bg-gray-200/20"
                >
                  No products found matching your active criteria.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/70 transition">
                  {/* ... keep Image, Name, Description td's identical ... */}
                  <td className="p-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 border rounded-lg flex items-center justify-center text-xs text-gray-400">
                        📦
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-semibold text-gray-900">
                    {product.name}
                  </td>
                  <td className="p-4 text-sm text-gray-500 max-w-[250px] truncate">
                    {product.description || (
                      <span className="italic text-gray-300">
                        No description
                      </span>
                    )}
                  </td>

                  {/* 3. Updated Price Column using Intl.NumberFormat */}
                  <td className="p-4 text-right font-medium text-gray-900">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: safeCurrency,
                    }).format(product.price)}
                  </td>

                  <td className="p-4 font-mono text-xs text-gray-500 tracking-wider">
                    {product.sku}
                  </td>
                  <td
                    className={`p-4 text-right font-medium ${product.quantity <= 0 ? "text-red-500" : "text-gray-900"}`}
                  >
                    {product.quantity.toLocaleString()}
                  </td>

                  {/* ... keep your existing Actions column identical ... */}
                  <td className="p-4 text-center">
                    <button
                      className="actions-menu-trigger p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeMenuId === product.id) {
                          setActiveMenuId(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMenuCoords({
                            top: rect.bottom + window.scrollY + 4,
                            right:
                              document.documentElement.clientWidth - rect.right,
                          });
                          setActiveMenuId(product.id);
                        }
                      }}
                    >
                      <MoreVertical className="h-5 w-5 pointer-events-none" />
                    </button>

                    {activeMenuId === product.id &&
                      menuCoords &&
                      typeof document !== "undefined" &&
                      createPortal(
                        <div
                          className="portaled-dropdown absolute bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 text-left w-36"
                          style={{
                            top: `${menuCoords.top}px`,
                            right: `${menuCoords.right}px`,
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditProduct(product);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                          >
                            <Edit2 className="h-4 w-4 text-gray-400" /> Edit
                          </button>
                          {canDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteProduct(product);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                            >
                              <Trash2 className="h-4 w-4 text-red-400" /> Delete
                            </button>
                          )}
                        </div>,
                        document.body,
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editProduct && (
        <EditProductModal
          product={editProduct}
          existingSKUs={existingSKUs}
          userId={userId}
          currency={safeCurrency}
          onClose={() => setEditProduct(null)}
        />
      )}
      {deleteProduct && (
        <DeleteProductModal
          product={deleteProduct}
          userId={userId}
          onClose={() => setDeleteProduct(null)}
        />
      )}
    </>
  );
}
