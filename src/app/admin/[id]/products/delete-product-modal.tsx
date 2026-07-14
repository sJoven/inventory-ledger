"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { deleteProductAction } from "@/src/app/admin/[id]/products/actions";

interface ProductRow {
  id: string;
  name: string;
  image: string;
  sku: string;
  quantity: number;
}

interface DeleteProductModalProps {
  product: ProductRow;
  userId: string;
  onClose: () => void;
}

export default function DeleteProductModal({
  product,
  userId,
  onClose,
}: DeleteProductModalProps) {
  const params = useParams();
  const storeId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 👈 Call the server action
      const response = await deleteProductAction(product.id, storeId, userId);

      if (!response.success) {
        throw new Error(response.error);
      }

      onClose(); // Success! Close the modal.
    } catch (err: any) {
      setError(err.message || "An error occurred while deleting.");
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

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden p-6 sm:p-8 text-center flex flex-col items-center">
        {/* Warning Icon Container */}
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-5">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>

        {/* Header Content */}
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-2">
          Delete Product
        </h2>

        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">"{product.name}"</span>?{" "}
          <br className="hidden sm:block" />
          This action cannot be undone.
        </p>

        {/* Error State */}
        {error && (
          <div className="w-full mb-6 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-left">
            {error}
          </div>
        )}

        {/* Action Buttons - Stacked to match established system */}
        <div className="w-full flex flex-col gap-3">
          <button
            data-testid="delete-product-submit"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-red-300 disabled:shadow-none active:scale-[0.98] flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                Deleting...
              </span>
            ) : (
              "Delete Product"
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-800 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
