"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

export default function SearchField({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

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
      className="flex w-full max-w-2xl items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm"
    >
      <div className="flex-1">
        <input
          key={currentQuery}
          name="query"
          disabled={isPending}
          className="block w-full rounded-md border border-gray-200 bg-gray-50/50 py-2 px-3 text-[0.875rem] text-[#3a3a3a] outline-none focus:ring-2 focus:ring-[#fc6022]/20 focus:border-[#fc6022] disabled:bg-gray-100 transition-all placeholder:text-gray-400"
          placeholder={placeholder}
          defaultValue={currentQuery}
        />
      </div>

      <div className="flex items-center gap-2 min-w-[140px]">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-[#fc6022] px-4 py-2 text-[0.875rem] font-bold text-white hover:bg-[#e2521a] transition-all shrink-0 flex items-center justify-center gap-2 min-w-[100px] shadow-sm active:scale-95"
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

        <div className="min-w-[60px]">
          {currentQuery && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleReset}
              className="text-[0.875rem] font-medium text-[#17212c] opacity-60 hover:opacity-100 hover:bg-gray-100 px-3 py-2 rounded-md transition-all"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
