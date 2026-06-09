"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreateProductModal from "@/src/app/admin/[id]/products/create-product-modal";

export default function CreateProductButton({
  storeId,
  existingSKUs,
  userId,
}: {
  storeId: string;
  existingSKUs: string[];
  userId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Plus className="w-4 h-4" /> Add Product
      </button>

      {isOpen && (
        <CreateProductModal
          storeId={storeId}
          existingSKUs={existingSKUs}
          userId={userId}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
