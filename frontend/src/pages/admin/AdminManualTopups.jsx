import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  CircularProgress,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import {
  getPendingTopups,
  approveTopup,
  rejectTopup,
} from "../../services/adminManualTopupApi";

const AdminManualTopups = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [openImage, setOpenImage] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPendingTopups();
        setRequests(data);
      } catch (err) {
        console.log("Failed to load topups", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getScreenshotUrl = (filePath) => {
    if (!filePath) return "";
    const base = import.meta.env.VITE_API_URL.replace("/api", "");
    return `${base}/uploads/${filePath}`;
  };

  const filtered = requests.filter(
    (r) =>
      r.userId?.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      r.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.userId?.mobileNumber?.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = async (id) => {
    await approveTopup(id);
    window.location.reload();
  };

  const handleReject = async (id) => {
    await rejectTopup(id);
    window.location.reload();
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen bg-gray-50">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "#1976d2", fontSize: "1.2rem" }}
      >
        Pending Manual Top-Up Requests
      </Typography>

      {/* Search */}
      <Box className="flex justify-start mb-6 mt-2">
        <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white w-80">
          <SearchIcon color="action" className="mr-2" />
          <input
            type="text"
            placeholder="Search by name, email or mobile"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 outline-none"
          />
        </div>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        className="shadow-2xl rounded-xl border border-gray-200 hover:shadow-indigo-300 transition-shadow duration-300 overflow-x-auto"
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow className="bg-indigo-100">
              {[
                "Sr No",
                "Client Name",
                "Email",
                "Mobile",
                "Amount",
                "Screenshot",
                "Actions",
              ].map((header, i) => (
                <TableCell
                  key={i}
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                    backgroundColor: "#e0e7ff",
                    color: "#1e293b",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((req, index) => (
              <TableRow key={req._id} className="hover:bg-indigo-50">
                <TableCell>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>

                <TableCell>{req.userId?.clientName}</TableCell>
                <TableCell>{req.userId?.email}</TableCell>
                <TableCell>{req.userId?.mobileNumber}</TableCell>
                <TableCell>₹ {req.amount}</TableCell>

                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setImageSrc(getScreenshotUrl(req.screenshot));
                      setOpenImage(true);
                    }}
                  >
                    View
                  </Button>
                </TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleApprove(req._id)}
                  >
                    Approve
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleReject(req._id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <Button
              key={pg}
              onClick={() => setCurrentPage(pg)}
              variant={currentPage === pg ? "contained" : "outlined"}
              color="primary"
              size="small"
            >
              {pg}
            </Button>
          ))}
        </Box>
      )}

      {/* Screenshot Modal */}
      <Dialog
  open={openImage}
  onClose={() => setOpenImage(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Payment Screenshot</DialogTitle>

  <DialogContent
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      py: 2
    }}
  >
    <img
      src={imageSrc}
      alt="Screenshot"
      style={{
        width: "100%",
        maxWidth: "600px",
        height: "auto",
        borderRadius: "10px",
        objectFit: "contain",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)"
      }}
    />
  </DialogContent>
</Dialog>

    </Box>
  );
};

export default AdminManualTopups;
