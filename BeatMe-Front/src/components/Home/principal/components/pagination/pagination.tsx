"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import PaginationRounded from "../pagination/ThePaginat-Component";
import "./pagination.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage > 1) params.set("page", String(newPage));
    else params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="Pagination-section">
      <div>
        <span className="Pagination-PerNumber">
          {start}–{end} of {total.toLocaleString("en-US")}
        </span>
      </div>
      <div>
        <PaginationRounded
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}