"use client";

import { useState, useTransition } from "react";
import { undoAction } from "./actions";
import { createPortal } from "react-dom";

export default function UndoButton({ logId }: { logId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUndo = async () => {
    setError(null);

    startTransition(async () => {
      try {
        await undoAction(logId);
        setIsOpen(false);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
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
        className="px-4 py-1.5 bg-[rgb(23,33,44)] text-[rgb(197,197,197)] hover:text-white 
               rounded-lg font-bold text-[0.875rem] transition-all duration-200 border border-[rgb(23,33,44)]"
      >
        Undo
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-2xl transition-all">
              <button
                onClick={() => !isPending && setIsOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-[rgb(58,58,58)] transition-colors"
                aria-label="Close"
                disabled={isPending}
              >
                <span className="text-xl">✕</span>
              </button>

              <div className="mt-2">
                <h3 className="text-[1.25rem] font-extrabold text-[rgb(58,58,58)]">
                  Confirm Undo
                </h3>

                <div className="mt-3 space-y-4">
                  <p className="text-[0.875rem] leading-relaxed text-[rgb(58,58,58)]/80">
                    Are you sure you want to revert this product to its previous
                    state? This will overwrite the current quantity and details.
                  </p>

                  {error && (
                    <div className="p-3 text-[0.875rem] bg-red-50 border border-red-100 text-red-600 rounded-lg font-medium">
                      <strong>Action Failed:</strong> {error}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-[0.875rem] font-semibold text-[rgb(58,58,58)] hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleUndo}
                  style={{ backgroundColor: "rgb(252, 96, 34)" }}
                  className="rounded-lg px-5 py-2.5 text-[0.875rem] font-bold text-white hover:opacity-90 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
                >
                  {isPending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Reverting...
                    </>
                  ) : (
                    "Confirm Undo"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
