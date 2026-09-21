import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from "@mui/material";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

const HIDE_BELOW = {
  sm: { xs: "none", sm: "table-cell" },
  md: { xs: "none", md: "table-cell" },
};

function cellSx(column, { isHead } = {}) {
  return {
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
    display: column.hideBelow ? HIDE_BELOW[column.hideBelow] : undefined,
    overflow: "hidden",
    verticalAlign: "middle",
    ...(column.sticky
      ? {
          position: "sticky",
          right: 0,
          backgroundColor: isHead ? "#F8FAFC" : "background.paper",
          zIndex: isHead ? 3 : 2,
          boxShadow: "-8px 0 8px -8px rgba(15, 23, 42, 0.12)",
        }
      : {}),
  };
}

export default function DataTable({
  columns = [],
  rows = [],
  getRowId,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription,
  minWidth = 720,
  loadingVariant = "spinner",
  skeletonRows = 6,
}) {
  const showSkeleton = loading && loadingVariant === "skeleton";

  return (
    <TableContainer
      component={Paper}
      elevation={1}
      sx={{ borderRadius: "12px", overflowX: minWidth === 0 ? "hidden" : "auto" }}
    >
      {loading && loadingVariant === "spinner" ? (
        <LoadingState />
      ) : !loading && rows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <Table
          sx={{
            minWidth,
            width: "100%",
            tableLayout: minWidth === 0 ? "fixed" : "auto",
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={cellSx(column, { isHead: true })}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {showSkeleton
              ? Array.from({ length: skeletonRows }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align || "left"}
                        sx={cellSx(column)}
                      >
                        <Skeleton variant="text" width={column.sticky ? 28 : "80%"} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((row, index) => {
                  const id = getRowId ? getRowId(row, index) : row._id || index;
                  return (
                    <TableRow key={id} hover>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                          sx={cellSx(column)}
                        >
                          {column.render ? column.render(row, index) : row[column.id] ?? "—"}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
