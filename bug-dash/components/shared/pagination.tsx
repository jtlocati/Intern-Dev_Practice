"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const MAX_VISIBLE_PAGES = 7;

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
  start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>

      {pages[0] > 1 && (
        <>
          <Button type="button" variant="outline" size="sm" onClick={() => onPageChange(1)}>
            1
          </Button>
          {pages[0] > 2 && <span className="px-1 text-sm text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          type="button"
          variant={page === currentPage ? "primary" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-sm text-gray-400">...</span>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </nav>
  );
}

export default Pagination;
