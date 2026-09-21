import { Box, Pagination, Typography } from "@mui/material";

export default function AppPagination({
  page = 1,
  totalPages = 1,
  totalCount,
  pageSize,
  onPageChange,
}) {
  if (totalPages <= 1 && !totalCount) return null;

  const start = totalCount && pageSize ? (page - 1) * pageSize + 1 : null;
  const end =
    totalCount && pageSize ? Math.min(page * pageSize, totalCount) : null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
        mt: 2,
        px: 0.5,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {start && end
          ? `Showing ${start}–${end} of ${totalCount}`
          : totalCount != null
            ? `${totalCount} results`
            : totalPages > 1
              ? `Page ${page} of ${totalPages}`
              : ""}
      </Typography>
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => onPageChange(value)}
          color="primary"
          shape="rounded"
          size="small"
        />
      )}
    </Box>
  );
}
