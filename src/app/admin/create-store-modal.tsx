"use client";

import { createStore } from "@/src/app/admin/actions";
import { useSession } from "next-auth/react";
import { useTransition, useState, useEffect } from "react";

export default function CreateStoreModal() {
  const { update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Prevent background page from scrolling when the modal window is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (formData: FormData) => {
    // 1. Extract values from Form Data
    const storeName = formData.get("storeName") as string;
    const currency = formData.get("currency") as string;
    const theme = formData.get("theme") as string;
    const storeIcon = formData.get("storeIcon") as string;

    // 2. Parse HTML values into proper types required by your Prisma schema
    const lowStockThreshold =
      parseInt(formData.get("lowStockThreshold") as string, 10) || 10;
    const allowNegativeInventory =
      formData.get("allowNegativeInventory") === "on";

    startTransition(async () => {
      const result = await createStore({
        storeName,
        settings: {
          lowStockThreshold,
          currency,
          theme,
          allowNegativeInventory,
          storeIcon: storeIcon.trim() || undefined,
        },
      });

      if (result.success) {
        alert(`Store "${result.data?.store_name}" created successfully!`);
        await update({ user: { triggerRefresh: true } });
        setIsOpen(false); // <-- Automatically close the modal on successful creation
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <>
      {/* 1. THE TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition shadow-sm"
      >
        + Create New Store
      </button>

      {/* 2. THE MODAL BACKDROP AND OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dimmed Background Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)} // Closes the modal if clicking outside the form box
          />

          {/* Modal Container Card */}
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl p-1 z-10">
            {/* Absolute Top Right Close 'X' Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg p-1 transition z-20"
              aria-label="Close Modal"
            >
              ✕
            </button>

            {/* YOUR EXACT FORM COMPONENT CONTAINER */}
            <form
              action={handleSubmit}
              className="w-full p-6 space-y-4 bg-white"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Create New Store
              </h2>

              {/* Store Name */}
              <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1 text-gray-700">
                  Store Name *
                </label>
                <input
                  type="text"
                  name="storeName"
                  required
                  placeholder="My Store"
                  className="border p-2 rounded text-gray-900 focus:outline-blue-500"
                />
              </div>

              <hr className="my-4 border-gray-200" />
              <h3 className="text-md font-semibold text-gray-500">
                Store Settings
              </h3>

              {/* Currency */}
              <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1 text-gray-700">
                  Currency *
                </label>
                <select
                  name="currency"
                  defaultValue="PHP"
                  className="border p-2 rounded text-gray-900"
                >
                  <option value="PHP">PHP (₱)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              {/* Theme */}
              <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1 text-gray-700">
                  Theme *
                </label>
                <select
                  name="theme"
                  defaultValue="light"
                  className="border p-2 rounded text-gray-900"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>

              {/* Low Stock Threshold */}
              <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1 text-gray-700">
                  Low Stock Alert Threshold *
                </label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  defaultValue={10}
                  min={0}
                  required
                  className="border p-2 rounded text-gray-900"
                />
              </div>

              {/* Store Icon (Optional) */}
              <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1 text-gray-700">
                  Store Icon URL{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="storeIcon"
                  placeholder="https://example.com/logo.png"
                  className="border p-2 rounded text-gray-900"
                />
              </div>

              {/* Allow Negative Inventory */}
              <div className="flex items-start space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="allowNegativeInventory"
                  name="allowNegativeInventory"
                  className="h-4 w-4 mt-1"
                />
                <label
                  htmlFor="allowNegativeInventory"
                  className="text-sm font-medium text-gray-700 select-none"
                >
                  Allow selling items when stock is 0 (Negative Inventory)
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition"
              >
                {isPending ? "Creating Store..." : "Create Store"}
              </button>

              {/* Optional Inline Secondary Cancel Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm font-medium text-gray-400 hover:text-gray-600 pt-1 transition"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
