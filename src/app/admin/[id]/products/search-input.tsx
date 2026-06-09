// app/admin/[id]/products/search-input.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [text, setText] = useState(searchParams.get("query") || "");
  const [, startTransition] = useTransition();

  // Handle debouncing/updating URL query parameters
  useEffect(() => {
    // If the text matches what's already in the URL, don't trigger anything
    if (text === (searchParams.get("query") || "")) return;

    const delayDebounceFn = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (text) {
          params.set("query", text);
        } else {
          params.delete("query");
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 500); // Bump debounce up to 500ms to give typing breathing room

    return () => clearTimeout(delayDebounceFn);
  }, [text]);

  return (
    <div className="relative">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-4 pr-10 py-2 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
        🔍
      </div>
    </div>
  );
}
