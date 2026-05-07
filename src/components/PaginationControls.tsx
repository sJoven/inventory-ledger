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
    <div className="flex items-center justify-center gap-6 py-4 bg-white">
      {current > 1 && !isPending ? (
        <Link
          href={createPageURL(current - 1)}
          onClick={(e) => handlePageChange(e, createPageURL(current - 1))}
          style={{
            backgroundColor: "rgb(23, 33, 44)",
            color: "rgb(197, 197, 197)",
          }}
          className="px-4 py-2 rounded text-[0.875rem] font-semibold transition-opacity hover:opacity-90"
        >
          {"<"} Previous
        </Link>
      ) : (
        <span
          style={{
            backgroundColor: "rgb(23, 33, 44)",
            color: "rgb(197, 197, 197)",
          }}
          className="px-4 py-2 rounded text-[0.875rem] font-semibold opacity-40 cursor-not-allowed"
        >
          {"<"} Previous
        </span>
      )}

      <div className="flex items-center justify-center min-w-[120px] text-[0.875rem] text-[rgb(58,58,58)]">
        {isPending ? (
          <div className="h-5 w-5 border-2 border-gray-200 border-t-[rgb(23,33,44)] rounded-full animate-spin" />
        ) : (
          <span>
            Page <span className="font-extrabold text-[1rem]">{current}</span>{" "}
            of {total}
          </span>
        )}
      </div>

      {current < total && !isPending ? (
        <Link
          href={createPageURL(current + 1)}
          onClick={(e) => handlePageChange(e, createPageURL(current + 1))}
          style={{
            backgroundColor: "rgb(23, 33, 44)",
            color: "rgb(197, 197, 197)",
          }}
          className="px-4 py-2 rounded text-[0.875rem] font-semibold transition-opacity hover:opacity-90"
        >
          Next {">"}
        </Link>
      ) : (
        <span
          style={{
            backgroundColor: "rgb(23, 33, 44)",
            color: "rgb(197, 197, 197)",
          }}
          className="px-4 py-2 rounded text-[0.875rem] font-semibold opacity-40 cursor-not-allowed"
        >
          Next {">"}
        </span>
      )}
    </div>
  );
}
