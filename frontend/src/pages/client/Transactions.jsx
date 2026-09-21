import React, { useEffect, useState } from "react";
import { getWalletTransactions } from "../../services/walletApi";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import AppPagination from "../../components/ui/AppPagination";
import StatusBadge from "../../components/ui/StatusBadge";
import { Box, Typography } from "@mui/material";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 20;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getWalletTransactions();
        if (res.success) setTransactions(res.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage) || 1;
  const currentTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const columns = [
    { id: "description", label: "Description" },
    {
      id: "date",
      label: "Date",
      render: (row) =>
        new Date(row.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
    {
      id: "amount",
      label: "Amount",
      render: (row) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: row.type === "credit" ? "success.main" : "text.primary" }}
        >
          {row.type === "credit" ? "+" : "-"}₹
          {Number(row.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </Typography>
      ),
    },
    { id: "type", label: "Type", render: (row) => <StatusBadge status={row.type} /> },
  ];

  return (
    <Box>
      <PageHeader
        title="Transaction history"
        description="Credits and debits from your wallet."
        showBack
        backTo="/home"
      />
      <DataTable
        columns={columns}
        rows={currentTransactions}
        loading={loading}
        emptyTitle="No transactions found"
      />
      <AppPagination
        page={currentPage}
        totalPages={totalPages}
        totalCount={transactions.length}
        pageSize={transactionsPerPage}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default Transactions;
