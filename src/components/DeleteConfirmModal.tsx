"use client";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  isPending: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isPending,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-2xl transition-all">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-[rgb(58,58,58)] transition-colors"
          aria-label="Close"
        >
          <span className="text-xl">✕</span>
        </button>

        <div className="mt-2">
          <h3 className="text-[1.25rem] font-extrabold text-[rgb(58,58,58)]">
            {title}
          </h3>
          <p className="mt-3 text-[0.875rem] leading-relaxed text-[rgb(58,58,58)]/80">
            Are you sure you want to delete{" "}
            <span className="font-bold text-[rgb(58,58,58)]">{itemName}</span>?
            This action will mark the item as deleted in the system.
          </p>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-[0.875rem] font-semibold text-[rgb(58,58,58)] hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            style={{ backgroundColor: "rgb(252, 96, 34)" }}
            className="rounded-lg px-5 py-2.5 text-[0.875rem] font-bold text-white hover:opacity-90 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
