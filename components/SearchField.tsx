"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react"; // 1. Added useTransition

export default function SearchField({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // 2. Initialize the transition hook
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get("query") || "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const term = formData.get("query")?.toString();

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    // 3. Wrap navigation in startTransition to track loading state
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  function handleReset() {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    params.set("page", "1");

    if (formRef.current) formRef.current.reset();

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl items-center gap-2"
    >
      <div className="flex-1">
        <input
          key={currentQuery}
          name="query"
          disabled={isPending} // Disable while searching
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 transition-colors"
          placeholder={placeholder}
          defaultValue={currentQuery}
        />
      </div>

      <div className="flex items-center gap-2 min-w-[140px]">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shrink-0 flex items-center justify-center gap-2 min-w-[90px]"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Wait...</span>
            </>
          ) : (
            "Search"
          )}
        </button>

        <div className="w-[60px]">
          {currentQuery && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleReset}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
