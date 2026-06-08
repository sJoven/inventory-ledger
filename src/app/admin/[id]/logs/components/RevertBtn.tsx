"use client";

import { useState, useTransition } from "react";
import { revertProductState } from "../actions";
import { RotateCcw } from "lucide-react";

interface RevertButtonProps {
  storeId: string;
  logId: string;
  actionType: string;
  userId: string;
}

export function RevertButton({
  storeId,
  logId,
  actionType,
  userId,
}: RevertButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRevert = () => {
    if (
      !confirm(
        `Are you sure you want to undo this ${actionType.toLowerCase()} action?`,
      )
    )
      return;

    setErrorMessage(null);
    startTransition(async () => {
      // ➕ Passed userId as the third argument to the server action
      const result = await revertProductState(storeId, logId, userId);
      if (!result.success && result.error) {
        setErrorMessage(result.error);
        alert(`Error: ${result.error}`);
      }
    });
  };

  return (
    <div className="inline-flex flex-col items-end">
      <button
        onClick={handleRevert}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed px-2.5 py-1.5 rounded transition-colors"
      >
        <RotateCcw className={`h-3 w-3 ${isPending ? "animate-spin" : ""}`} />
        {isPending ? "Reverting..." : "Revert"}
      </button>
      {errorMessage && (
        <span
          className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate"
          title={errorMessage}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}
