import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { getUsersWithWallets } from "../../services/adminWallet";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import AppPagination from "../../components/ui/AppPagination";

const UserWallet = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsersWithWallets();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(users.length / rowsPerPage) || 1;
  const paginated = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const columns = [
    { id: "sr", label: "Sr", render: (_row, index) => (page - 1) * rowsPerPage + index + 1 },
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "mobile", label: "Mobile" },
    { id: "role", label: "Role" },
    {
      id: "walletBalance",
      label: "Wallet balance",
      render: (user) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: "success.main" }}>
          ₹ {user.walletBalance}
        </Typography>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="User wallets"
        description="Current wallet balances for all users."
        showBack
        backTo="/admin"
      />
      <DataTable columns={columns} rows={paginated} loading={loading} emptyTitle="No users found" />
      <AppPagination
        page={page}
        totalPages={totalPages}
        totalCount={users.length}
        pageSize={rowsPerPage}
        onPageChange={setPage}
      />
    </Box>
  );
};

export default UserWallet;
