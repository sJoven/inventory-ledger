"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useParams } from "next/navigation"; // 👈 Add this
import { updateProductAction } from "@/src/app/admin/[id]/products/actions";

interface ProductRow {
  id: string;
  name: string;
  image: string;
  sku: string;
  quantity: number;
  // Included to match your Prisma schema, though optional in the table view
  description?: string;
  price?: number;
}

interface EditProductModalProps {
  product: ProductRow;
  existingSKUs: string[];
  userId: string;
  currency: string;
  onClose: () => void;
}

export default function EditProductModal({
  product,
  existingSKUs,
  userId,
  currency,
  onClose,
}: EditProductModalProps) {
  const params = useParams();
  const storeId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku,
    image: product.image,
    quantity: product.quantity,
    description: product.description || "",
    price: product.price || 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.sku !== product.sku && existingSKUs.includes(formData.sku)) {
      setError("This SKU is already in use by another product.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await updateProductAction(
        product.id,
        formData,
        storeId,
        userId,
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors z-20"
          aria-label="Close Modal"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        <form
          onSubmit={handleSubmit}
          className="w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 [scrollbar-width:thin] [scrollbar-color:#d6d3d1_transparent]"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight pr-8">
              Edit Product
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Modify the details of your inventory item.
            </p>
          </div>

          <div className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col sm:col-span-2">
                <label className="font-semibold text-sm mb-1.5 text-gray-700">
                  Product Name <span className="text-[#fc6022]">*</span>
                </label>
                <input
                  data-testid="product-name"
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1.5 text-gray-700">
                  SKU <span className="text-[#fc6022]">*</span>
                </label>
                <input
                  data-testid="product-sku"
                  required
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1.5 text-gray-700">
                  Quantity <span className="text-[#fc6022]">*</span>
                </label>
                <input
                  data-testid="product-quantity"
                  required
                  type="number"
                  name="quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col sm:col-span-2">
                <label className="font-semibold text-sm mb-1.5 text-gray-700">
                  Price ({currency}) <span className="text-[#fc6022]">*</span>
                </label>
                <input
                  data-testid="product-price"
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col sm:col-span-2">
                <label className="font-semibold text-sm mb-1.5 text-gray-700 flex justify-between">
                  <span>Image URL</span>
                  <span className="text-gray-400 font-normal">Optional</span>
                </label>
                <input
                  data-testid="product-image"
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.png"
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col sm:col-span-2">
                <label className="font-semibold text-sm mb-1.5 text-gray-700 flex justify-between">
                  <span>Description</span>
                  <span className="text-gray-400 font-normal">Optional</span>
                </label>
                <textarea
                  data-testid="product-description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons - Stacked full-width like reference */}
            <div className="pt-6 flex flex-col gap-3">
              <button
                data-testid="save-product-submit"
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#fc6022] hover:bg-[#e0541e] text-white py-3 rounded-xl font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-orange-300 disabled:shadow-none active:scale-[0.98] flex justify-center items-center"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    Saving Changes...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-800 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
