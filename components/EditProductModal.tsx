"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
}

interface EditProductModalProps {
  isOpen: boolean;
  product: Product | null;
  existingProducts: Product[];
  onClose: () => void;
  onSave: (
    id: string,
    data: { name: string; sku: string; quantity: number },
  ) => Promise<void>;
  isPending: boolean;
}

export default function EditProductModal({
  isOpen,
  product,
  existingProducts,
  onClose,
  onSave,
  isPending,
}: EditProductModalProps) {
  const [formData, setFormData] = useState({ name: "", sku: "", quantity: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
      });
      setError(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isDuplicate = existingProducts.some(
      (p) =>
        p.sku.toLowerCase() === formData.sku.toLowerCase() &&
        p.id !== product.id,
    );

    if (isDuplicate) {
      setError(
        `The SKU "${formData.sku}" is already in use by another product.`,
      );
      return;
    }

    setError(null);
    await onSave(product.id, formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[rgb(23,33,44)]/40 backdrop-blur-sm transition-opacity"
        onClick={() => !isPending && onClose()}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl z-10 border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 mb-0 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-[1.125rem] font-bold text-[rgb(23,33,44)]">
            Edit Product
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-[rgb(23,33,44)] hover:bg-gray-300 disabled:opacity-30 w-8 h-8 flex items-center justify-center rounded-full transition-all"
            aria-label="Close modal"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-5">
          {error && (
            <div className="p-3 pt-0 text-[0.875rem] bg-red-50 border border-red-100 text-red-600 rounded-lg">
              <div className="flex items-center gap-1">
                <p>
                  <strong className="font-bold">Error:</strong> {error}
                </p>
              </div>
            </div>
          )}

          {/* Input Group */}
          <div className="space-y-4">
            <div>
              <label className="block text-[0.875rem] font-bold text-[rgb(58,58,58)] mb-1.5">
                Product Name
              </label>
              <input
                required
                disabled={isPending}
                placeholder="e.g. Wireless Mouse"
                className="w-full text-[0.875rem] border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[rgb(252,96,34)]/20 focus:border-[rgb(252,96,34)] disabled:bg-gray-50 disabled:text-gray-400 transition-all text-[rgb(58,58,58)]"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-[0.875rem] font-bold text-[rgb(58,58,58)] mb-1.5">
                SKU
              </label>
              <input
                required
                disabled={isPending}
                placeholder="e.g. WM-001"
                className={`w-full text-[0.875rem] font-mono border rounded-lg p-2.5 outline-none focus:ring-2 transition-all ${
                  error
                    ? "border-red-500 bg-red-50 focus:ring-red-200"
                    : "border-gray-200 focus:ring-[rgb(252,96,34)]/20 focus:border-[rgb(252,96,34)]"
                } disabled:bg-gray-50 disabled:text-gray-400 text-[rgb(58,58,58)]`}
                value={formData.sku}
                onChange={(e) => {
                  setFormData({ ...formData, sku: e.target.value });
                  setError(null);
                }}
              />
            </div>

            <div>
              <label className="block text-[0.875rem] font-bold text-[rgb(58,58,58)] mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                required
                disabled={isPending}
                min="0"
                className="w-full text-[0.875rem] border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[rgb(252,96,34)]/20 focus:border-[rgb(252,96,34)] disabled:bg-gray-50 disabled:text-gray-400 transition-all text-[rgb(58,58,58)]"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-[0.875rem] font-semibold text-[rgb(58,58,58)] hover:bg-gray-300 disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-[rgb(252,96,34)] text-white rounded-lg text-[0.875rem] font-bold hover:bg-[rgb(230,80,25)] disabled:bg-gray-300 transition-all flex items-center justify-center min-w-[140px] shadow-lg shadow-[rgb(252,96,34)]/20"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
