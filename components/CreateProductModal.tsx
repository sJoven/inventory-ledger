"use client";

import { useState, useTransition } from "react";
import { createProduct } from "@/app/products/actions";

interface Product {
  sku: string;
}

export default function CreateProductModal({
  existingProducts,
}: {
  existingProducts: Product[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition(); // 1. Add useTransition

  const [formData, setFormData] = useState({ name: "", sku: "", quantity: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Manual duplicate check
    const isDuplicate = existingProducts.some(
      (p) => p.sku.toLowerCase() === formData.sku.toLowerCase(),
    );

    if (isDuplicate) {
      setError(`The SKU "${formData.sku}" is already in use.`);
      setFormData((prev) => ({ ...prev, sku: "" }));
      return;
    }

    // 2. Wrap the submission in startTransition
    startTransition(async () => {
      setError(null);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("sku", formData.sku);
      data.append("quantity", formData.quantity.toString());

      await createProduct(data);

      setIsOpen(false);
      setFormData({ name: "", sku: "", quantity: 0 });
    });
  };

  return (
    <>
      <button
        onClick={() => {
          setError(null);
          setIsOpen(true);
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        + Create Product
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">New Product</h2>
              <button
                onClick={() => !isPending && setIsOpen(false)}
                disabled={isPending}
                className="text-gray-500 hover:text-black disabled:opacity-30"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name
                </label>
                <input
                  disabled={isPending}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full border rounded p-2 disabled:bg-gray-50"
                  placeholder="e.g. Wireless Mouse"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input
                  disabled={isPending}
                  value={formData.sku}
                  onChange={(e) => {
                    setFormData({ ...formData, sku: e.target.value });
                    setError(null);
                  }}
                  required
                  placeholder="e.g. WM-001"
                  className={`w-full border rounded p-2 disabled:bg-gray-50 ${error ? "border-red-500" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Initial Quantity
                </label>
                <input
                  disabled={isPending}
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full border rounded p-2 disabled:bg-gray-50"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center min-w-[120px] justify-center"
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
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
