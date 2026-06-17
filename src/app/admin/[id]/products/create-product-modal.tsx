"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createProductAction } from "@/src/app/admin/[id]/products/actions";

export default function CreateProductModal({
  storeId,
  existingSKUs,
  userId,
  currency,
  onClose,
}: {
  storeId: string;
  existingSKUs: string[];
  userId: string;
  currency: string;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    image: "",
    quantity: 0,
    description: "",
    price: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingSKUs.includes(formData.sku)) {
      alert("This SKU is already in use.");
      return;
    }

    setIsLoading(true);
    const res = await createProductAction(formData, storeId, userId);
    if (res.success) {
      onClose();
    } else {
      alert(res.error || "Failed to create product.");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors z-20"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <form
          onSubmit={handleSubmit}
          className="w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 [scrollbar-width:thin] [scrollbar-color:#d6d3d1_transparent]"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight pr-8">
              New Product
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add a new item to your store inventory.
            </p>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-sm mb-1.5 text-gray-700">
              Product Name <span className="text-[#fc6022]">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Premium Cotton T-Shirt"
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold text-sm mb-1.5 text-gray-700">
                SKU <span className="text-[#fc6022]">*</span>
              </label>
              <input
                type="text"
                name="sku"
                required
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. TSHIRT-001"
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm mb-1.5 text-gray-700">
                Price ({currency}) <span className="text-[#fc6022]">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-sm mb-1.5 text-gray-700">
              Quantity <span className="text-[#fc6022]">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              required
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-sm mb-1.5 text-gray-700 flex justify-between">
              <span>Image URL</span>
              <span className="text-gray-400 font-normal">Optional</span>
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/product.png"
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-sm mb-1.5 text-gray-700 flex justify-between">
              <span>Description</span>
              <span className="text-gray-400 font-normal">Optional</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your product..."
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200 resize-none"
            />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#fc6022] hover:bg-[#e0541e] text-white py-3 rounded-xl font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-orange-300 disabled:shadow-none active:scale-[0.98] flex justify-center items-center"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  Creating Product...
                </span>
              ) : (
                "Create Product"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-800 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
