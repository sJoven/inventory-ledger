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
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#fc6022] bg-[#fc6022]/10 hover:bg-[#fc6022]/20 hover:text-[#e0541e] disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-md transition-all duration-200 active:scale-[0.98]"
      >
        <RotateCcw className={`h-3 w-3 ${isPending ? "animate-spin" : ""}`} />
        {isPending ? "Reverting..." : "Revert"}
      </button>
      {errorMessage && (
        <span
          className="text-[10px] font-medium text-red-500 mt-1.5 max-w-[150px] truncate"
          title={errorMessage}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}
