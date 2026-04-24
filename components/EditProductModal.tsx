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
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => !isPending && onClose()}
      />

      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl z-10 border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-gray-500 hover:text-black disabled:opacity-30 p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
              <div className="flex items-center gap-2">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              required
              disabled={isPending}
              placeholder="e.g. Wireless Mouse"
              className="w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU
            </label>
            <input
              required
              disabled={isPending}
              placeholder="e.g. WM-001"
              className={`w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                error
                  ? "border-red-500 bg-red-50 focus:ring-red-200"
                  : "focus:border-blue-500"
              } disabled:bg-gray-50 disabled:text-gray-500`}
              value={formData.sku}
              onChange={(e) => {
                setFormData({ ...formData, sku: e.target.value });
                setError(null);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              required
              disabled={isPending}
              min="0"
              className="w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center justify-center min-w-[120px]"
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
