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
  const safeCurrency = currency || "PHP";

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
        className="bg-white border border-gray-200 rounded-2xl shadow-sm relative overflow-hidden md:overflow-visible w-[95vw] md:w-full max-w-full"
      >
        <div className="overflow-x-auto md:overflow-visible w-full [scrollbar-width:thin] [scrollbar-color:#d6d3d1_transparent]">
          <table className="table-fixed text-left text-sm text-gray-600 border-collapse min-w-[800px] w-full">
            <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-semibold tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-20 min-w-[100px]">Image</th>
                <th className="px-6 py-4 min-w-[120px]">Product</th>
                <th className="px-6 py-4 min-w-[200px]">Description</th>
                <th className="px-6 py-4 w-28 text-right">Price</th>
                <th className="px-6 py-4 w-32">SKU</th>
                <th className="px-6 py-4 w-24 text-right whitespace-nowrap">
                  In Stock
                </th>
                <th className="px-6 py-4 w-16 text-center min-w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 bg-gray-50/30"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-2xl mb-2">📦</span>
                      <p>No products found matching your active criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/80 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image ? (
                        <img
                          src={product.image}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                          📦
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-800 whitespace-nowrap truncate">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[200px]">
                      {product.description || (
                        <span className="italic text-gray-400">
                          No description
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right font-semibold text-gray-800 whitespace-nowrap">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: safeCurrency,
                      }).format(product.price)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                        {product.sku}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span
                        className={`font-semibold px-2.5 py-1 rounded-lg ${product.quantity <= 0 ? "text-red-600 bg-red-50" : "text-gray-800"}`}
                      >
                        {product.quantity.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button
                        data-testid="product-actions"
                        className="actions-menu-trigger p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeMenuId === product.id) {
                            setActiveMenuId(null);
                          } else {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setMenuCoords({
                              top: rect.bottom + window.scrollY + 4,
                              right:
                                document.documentElement.clientWidth -
                                rect.right,
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
                            className="portaled-dropdown absolute bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 text-left w-40 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
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
                              className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-[#fc6022] hover:bg-[#fc6022]/10 flex items-center gap-2.5 transition-colors"
                            >
                              <Edit2 className="h-4 w-4" /> Edit Product
                            </button>
                            {canDelete && (
                              <button
                                data-testid="delete-product-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteProduct(product);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" /> Delete
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
