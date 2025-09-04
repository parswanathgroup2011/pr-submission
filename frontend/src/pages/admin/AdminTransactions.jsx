// src/pages/AdminTransactions.jsx
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getAllTransactions } from "../../services/adminApi";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();
        setTransactions(data?.transactions || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // 🔎 Search filter
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx._id?.toLowerCase().includes(search.toLowerCase()) ||
      tx.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      tx.amount?.toString().includes(search) ||
      tx.type?.toLowerCase().includes(search.toLowerCase())
  );

  // 📑 Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        sx={{ fontWeight: 600, color: "#1976d2", fontSize: "1.1rem" }}
      >
        List Of All Transactions
      </Typography>

      {/* 🔎 Search */}
      <Box className="flex justify-start mb-6 mt-2">
        <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white w-80">
          <SearchIcon color="action" className="mr-2" />
          <input
            type="text"
            placeholder="Search by ID, user, amount, status"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 outline-none"
          />
        </div>
      </Box>

      {/* 📊 Table */}
      <TableContainer
        component={Paper}
        className="shadow-2xl rounded-xl border border-gray-200 hover:shadow-indigo-300 transition-shadow duration-300 overflow-x-auto"
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow className="bg-indigo-100">
              {[
                "Sr No",
                "Transaction ID",
                "User",
                "Amount",
                "Date",
                "Status",
              ].map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: 700,
                    fontFamily: "Roboto, sans-serif",
                    fontSize: 14,
                    letterSpacing: "0.5px",
                    color: "#1e293b",
                    backgroundColor: "#e0e7ff",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedTransactions.map((tx, index) => (
              <TableRow
                key={tx._id}
                className="hover:bg-indigo-50 cursor-pointer"
              >
                <TableCell>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{tx._id}</TableCell>
                <TableCell>{tx.userId?.clientName || "N/A"}
</TableCell>
                
                <TableCell>₹ {tx.amount}</TableCell>
                <TableCell>
                  {new Date(tx.createdAt).toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    color: tx.type === "credit" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {tx.type}
                </TableCell>
              </TableRow>
            ))}
            {paginatedTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📌 Pagination */}
      {totalPages > 1 && (
        <Box className="flex justify-center mt-6 flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              variant={currentPage === pageNum ? "contained" : "outlined"}
              color="primary"
              size="small"
            >
              {pageNum}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AdminTransactions;
