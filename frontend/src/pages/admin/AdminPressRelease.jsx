// AdminPressReleaseTable.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Avatar,
  TablePagination,
  Button
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

import { getAllPressReleases,downloadPressReleasePDF} from "../../services/pressReleaseService";

const AdminPressReleaseTable = () => {
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        let data = await getAllPressReleases();

        // 🔥 Sort latest first (by createdAt)
        data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPrs(data);
      } catch (error) {
        console.error("❌ Error fetching PRs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPRs();
  }, []);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <CircularProgress />
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        📑 All Press Releases
      </Typography>

      <Paper sx={{ borderRadius: 3, boxShadow: 3 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
  <TableRow>
    {[
      "PR ID", "Title", "Summary", "Content", "Image", "Quote",
      "City", "Tags", "Scheduled At", "Status", "Plan",
      "Category", "Created", "Updated", "Download"
    ].map((header) => (
      <TableCell
        key={header}
        sx={{
          backgroundColor: "#e0e7ff",  // Material Blue
          color: "black",
          fontWeight: "bold",
          fontSize: 12,
          textTransform: "uppercase",
          borderBottom: "none"
        }}
      >
        {header}
      </TableCell>
    ))}
  </TableRow>
</TableHead>

            <TableBody>
              {prs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    No press releases found
                  </TableCell>
                </TableRow>
              ) : (
                prs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // 👈 pagination slice
                  .map((pr) => (
                    <TableRow
                      key={pr._id}
                      hover
                      sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                    >
                      <TableCell>{pr.prId}</TableCell>
                    <TableCell>
  <Button
    variant="outlined"        // subtle border
    color="secondary"         // secondary color for contrast
    size="small"
    startIcon={<DownloadIcon />} // nice download icon
    sx={{
      textTransform: "none",   // keep text as-is
      fontWeight: "bold",
      borderRadius: 2,         // rounded corners
      backgroundColor: "#f0f0f0",
      "&:hover": {
        backgroundColor: "#e0e0e0",
        color: "#1976d2"
      }
    }}
    onClick={() => downloadPressReleasePDF(pr._id)}
  >
    Download PDF
  </Button>
</TableCell>


                      <TableCell>{pr.title}</TableCell>
                      <TableCell>{pr.summary}</TableCell>
                      <TableCell>
                        <div
                          dangerouslySetInnerHTML={{ __html: pr.content }}
                          style={{ maxHeight: 80, overflow: "hidden" }}
                        />
                      </TableCell>
                      <TableCell>
                        {pr.image ? (
                          <Avatar
                            variant="rounded"
                            src={`http://localhost:5002/${pr.image}`}
                            alt="PR"
                            sx={{ width: 60, height: 40 }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </TableCell>
                      <TableCell>{pr.quoteDescription}</TableCell>
                      <TableCell>{pr.city}</TableCell>
                      <TableCell>{pr.tags?.join(", ")}</TableCell>
                      <TableCell>
                        {pr.scheduledAt
                          ? new Date(pr.scheduledAt).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell>{pr.status}</TableCell>
                      <TableCell>{pr.selectedPlan?.name || "N/A"}</TableCell>
                      <TableCell>{pr.selectedCategory?.name || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(pr.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(pr.updatedAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ Pagination Controls */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={prs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default AdminPressReleaseTable;
