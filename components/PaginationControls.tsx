"use client";

import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

interface PaginationProps {
  total: number;
  current: number;
}

export default function PaginationControls({
  total,
  current,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    e.preventDefault();
    startTransition(() => {
      router.push(url);
    });
  };

  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {current > 1 && !isPending ? (
        <Link
          href={createPageURL(current - 1)}
          onClick={(e) => handlePageChange(e, createPageURL(current - 1))}
          className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
        >
          {"<"} Previous
        </Link>
      ) : (
        <span className="px-4 py-2 border rounded opacity-50 cursor-not-allowed">
          {"<"} Previous
        </span>
      )}

      <div className="flex items-center justify-center min-w-[100px] text-sm font-medium">
        {isPending ? (
          <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        ) : (
          <span>
            Page <span className="font-bold">{current}</span> of {total}
          </span>
        )}
      </div>

      {current < total && !isPending ? (
        <Link
          href={createPageURL(current + 1)}
          onClick={(e) => handlePageChange(e, createPageURL(current + 1))}
          className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
        >
          Next {">"}
        </Link>
      ) : (
        <span className="px-4 py-2 border rounded opacity-50 cursor-not-allowed">
          Next {">"}
        </span>
      )}
    </div>
  );
}
