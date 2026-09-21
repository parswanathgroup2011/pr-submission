import React, { useEffect, useState } from "react";
import { getAllTransactions } from "../../services/adminApi";
import PageHeader from "../../components/ui/PageHeader";
import SearchInput from "../../components/ui/SearchInput";
import FilterBar from "../../components/ui/FilterBar";
import DataTable from "../../components/ui/DataTable";
import AppPagination from "../../components/ui/AppPagination";
import StatusBadge from "../../components/ui/StatusBadge";
import { Box, Typography } from "@mui/material";

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
        const sorted = (data?.transactions || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTransactions(sorted);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx._id?.toLowerCase().includes(search.toLowerCase()) ||
      tx.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      tx.userId?.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      tx.amount?.toString().includes(search) ||
      tx.type?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { id: "sr", label: "Sr", render: (_row, index) => (currentPage - 1) * itemsPerPage + index + 1 },
    { id: "_id", label: "Transaction ID" },
    { id: "user", label: "User", render: (tx) => tx.userId?.clientName || "N/A" },
    {
      id: "amount",
      label: "Amount",
      render: (tx) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          ₹ {tx.amount}
        </Typography>
      ),
    },
    { id: "date", label: "Date", render: (tx) => new Date(tx.createdAt).toLocaleString() },
    { id: "type", label: "Status", render: (tx) => <StatusBadge status={tx.type} /> },
  ];

  return (
    <Box>
      <PageHeader
        title="Transactions"
        description="Wallet credits and debits across all users."
        showBack
        backTo="/admin"
        toolbar={
          <FilterBar>
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, user, amount, status"
            />
          </FilterBar>
        }
      />
      <DataTable
        columns={columns}
        rows={paginatedTransactions}
        loading={loading}
        emptyTitle="No transactions found"
      />
      <AppPagination
        page={currentPage}
        totalPages={totalPages}
        totalCount={filteredTransactions.length}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default AdminTransactions;
