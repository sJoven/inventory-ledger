"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [text, setText] = useState(searchParams.get("query") || "");
  const [, startTransition] = useTransition();

  useEffect(() => {
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
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [text]);

  return (
    <div className="relative min-w-0 w-full">
      <input
        data-testid="product-search"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fc6022] focus:ring-4 focus:ring-[#fc6022]/10 transition-all duration-200"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
