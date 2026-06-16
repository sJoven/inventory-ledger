"use client";

import { createStore } from "@/src/app/admin/actions";
import { useSession } from "next-auth/react";
import { useTransition, useState, useEffect } from "react";

export default function CreateStoreModal() {
  const { update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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
    const storeName = formData.get("storeName") as string;
    const currency = formData.get("currency") as string;
    const theme = formData.get("theme") as string;
    const storeIcon = formData.get("storeIcon") as string;
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
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#fc6022] hover:bg-[#e0541e] text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
      >
        + Create New Store
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors z-20"
              aria-label="Close Modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <form
              action={handleSubmit}
              className="w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 [scrollbar-width:thin] [scrollbar-color:#d6d3d1_transparent]"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight pr-8">
                  Create New Store
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Set up the basics for your new storefront.
                </p>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1.5 text-gray-700">
                  Store Name <span className="text-[#fc6022]">*</span>
                </label>
                <input
                  type="text"
                  name="storeName"
                  required
                  placeholder="e.g. My Awesome Store"
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
                />
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Store Settings
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-semibold text-sm mb-1.5 text-gray-700">
                    Currency <span className="text-[#fc6022]">*</span>
                  </label>
                  <select
                    name="currency"
                    defaultValue="PHP"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
                  >
                    <option value="PHP">PHP (₱)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-sm mb-1.5 text-gray-700">
                    Theme <span className="text-[#fc6022]">*</span>
                  </label>
                  <select
                    name="theme"
                    defaultValue="light"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1.5 text-gray-700">
                  Low Stock Alert Threshold{" "}
                  <span className="text-[#fc6022]">*</span>
                </label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  defaultValue={10}
                  min={0}
                  required
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1.5 text-gray-700 flex justify-between">
                  <span>Store Icon URL</span>
                  <span className="text-gray-400 font-normal">Optional</span>
                </label>
                <input
                  type="url"
                  name="storeIcon"
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
                />
              </div>

              <label className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  id="allowNegativeInventory"
                  name="allowNegativeInventory"
                  className="mt-0.5 w-4 h-4 text-[#fc6022] bg-white border-gray-300 rounded focus:ring-[#fc6022] focus:ring-2 accent-[#fc6022]"
                />
                <span className="text-sm text-gray-700 leading-tight">
                  <strong className="block text-gray-900 mb-0.5 font-semibold">
                    Allow Negative Inventory
                  </strong>
                  Permit selling items even when your recorded stock reaches 0.
                </span>
              </label>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#fc6022] hover:bg-[#e0541e] text-white py-3 rounded-xl font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-orange-300 disabled:shadow-none active:scale-[0.98] flex justify-center items-center"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating Store...
                    </span>
                  ) : (
                    "Create Store"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-800 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
