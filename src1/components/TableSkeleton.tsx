export default function TableSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 bg-white">
      <div
        style={{ borderTopColor: "rgb(252, 96, 34)" }}
        className="h-8 w-8 animate-spin rounded-full border-4 border-gray-100"
      />

      <p className="text-[0.875rem] font-medium text-[rgb(23,33,44)]">
        Loading...
      </p>
    </div>
  );
}
