"use client";

import { useState } from "react";
import CreateStoreModal from "./CreateStoreModal";

export default function CreateStoreButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
      >
        + Create New Store
      </button>

      {isOpen && <CreateStoreModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
