"use client";

import { useState, useTransition } from "react";
import { undoAction } from "./actions";

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
        className="text-blue-600 hover:text-blue-800 font-medium text-sm underline decoration-dotted"
      >
        Undo
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirm Undo</h2>
              <button
                onClick={() => !isPending && setIsOpen(false)}
                className="text-gray-500 hover:text-black disabled:opacity-30"
                disabled={isPending}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to revert this product to its previous
                state?
              </p>

              {error && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded">
                  <strong>Action Failed:</strong> {error}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUndo}
                  disabled={isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center min-w-[100px] disabled:bg-blue-400"
                >
                  {isPending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Reverting...
                    </>
                  ) : (
                    "Confirm Undo"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}