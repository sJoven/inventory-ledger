"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreateProductModal from "@/src/app/admin/[id]/products/create-product-modal";

export default function CreateProductButton({
  storeId,
  existingSKUs,
  userId,
  currency,
}: {
  storeId: string;
  existingSKUs: string[];
  userId: string;
  currency: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-[#fc6022] hover:bg-[#e0541e] text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" /> Add Product
      </button>

      {isOpen && (
        <CreateProductModal
          storeId={storeId}
          existingSKUs={existingSKUs}
          userId={userId}
          currency={currency}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
