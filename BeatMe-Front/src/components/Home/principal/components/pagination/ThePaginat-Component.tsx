"use client";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "./pagination.css";

interface Props {
  count: number;
  page: number;
  onChange: (page: number) => void;
}

export default function PaginationRounded({ count, page, onChange }: Props) {
  return (
    <Stack spacing={2}>
      <Pagination
        count={count}
        page={page}
        onChange={(_, value) => onChange(value)}
        variant="outlined"
        shape="rounded"
        sx={{
          "@media (max-width: 500px)": {
            "& .MuiPagination-ul > li:nth-last-child(2)": {
              display: "none",
            },
          },
        }}
      />
    </Stack>
  );
}