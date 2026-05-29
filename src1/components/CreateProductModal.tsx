"use client";

import { useState, useTransition } from "react";
import { createProduct } from "@/src/app/products/actions";

export default function CreateProductModal({
  existingSkus,
}: {
  existingSkus: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({ name: "", sku: "", quantity: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedSku = formData.sku.toLowerCase().trim();
    const isDuplicate = existingSkus.includes(normalizedSku);

    if (isDuplicate) {
      setError(`The SKU "${formData.sku}" is already in use.`);
      return;
    }

    startTransition(async () => {
      setError(null);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("sku", formData.sku);
      data.append("quantity", formData.quantity.toString());

      try {
        await createProduct(data);
        setIsOpen(false);
        setFormData({ name: "", sku: "", quantity: 0 });
      } catch (err) {
        setError("Failed to create product. Please try again.");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => {
          setError(null);
          setIsOpen(true);
        }}
        style={{ backgroundColor: "rgb(252, 96, 34)" }}
        className="text-white px-5 py-2.5 rounded-lg transition hover:opacity-90 text-[0.875rem] font-bold shadow-sm"
      >
        + Create Product
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[1.25rem] font-extrabold text-[rgb(58,58,58)]">
                New Product
              </h2>
              <button
                onClick={() => !isPending && setIsOpen(false)}
                disabled={isPending}
                className="text-gray-400 hover:text-[rgb(58,58,58)] disabled:opacity-30 transition-colors"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 text-[0.875rem] bg-red-50 border border-red-100 text-red-600 rounded-lg font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[0.875rem] font-bold text-[rgb(58,58,58)]">
                  Product Name
                </label>
                <input
                  disabled={isPending}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-[0.875rem] text-[rgb(58,58,58)] focus:ring-2 focus:ring-[rgb(252,96,34)]/20 outline-none transition-all"
                  placeholder="e.g. Wireless Mouse"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[0.875rem] font-bold text-[rgb(58,58,58)]">
                  SKU
                </label>
                <input
                  disabled={isPending}
                  value={formData.sku}
                  onChange={(e) => {
                    setFormData({ ...formData, sku: e.target.value });
                    if (error) setError(null);
                  }}
                  required
                  placeholder="e.g. WM-001"
                  className={`w-full border rounded-lg p-2.5 text-[0.875rem] text-[rgb(58,58,58)] outline-none transition-all ${
                    error
                      ? "border-red-500"
                      : "border-gray-200 focus:ring-2 focus:ring-[rgb(252,96,34)]/20"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[0.875rem] font-bold text-[rgb(58,58,58)]">
                  Initial Quantity
                </label>
                <input
                  disabled={isPending}
                  type="number"
                  min="0"
                  value={Number(formData.quantity).toString()}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const sanitizedValue = parseInt(rawValue, 10);

                    setFormData({
                      ...formData,
                      quantity: isNaN(sanitizedValue) ? 0 : sanitizedValue,
                    });
                  }}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-[0.875rem] text-[rgb(58,58,58)] focus:ring-2 focus:ring-[rgb(252,96,34)]/20 outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg text-[0.875rem] font-semibold text-[rgb(58,58,58)] hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{ backgroundColor: "rgb(252, 96, 34)" }}
                  className="px-5 py-2.5 text-white rounded-lg hover:opacity-90 disabled:opacity-60 flex items-center min-w-[130px] justify-center transition text-[0.875rem] font-bold shadow-sm"
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
