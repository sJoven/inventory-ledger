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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Product</h2>

        <p className="text-gray-500 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">"{product.name}"</span>?
          This action cannot be undone.
        </p>

        {error && (
          <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-left">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-center w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
