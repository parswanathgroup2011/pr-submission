import React, { useState, useEffect, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import PRSubmissionModal from "../../components/pr_submission/PRSubmissionModal";
import { getPRStats, getPRHistory } from "../../services/pressReleaseService";
import WalletBox from "../../components/wallet/WalletBox";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import DataTable from "../../components/ui/DataTable";
import AppPagination from "../../components/ui/AppPagination";
import StatusBadge from "../../components/ui/StatusBadge";

function Home() {
  const [isPRModelOpen, setIsPRModelOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalPR: 0,
    pendingPR: 0,
    publishedPR: 0,
    rejectedPR: 0,
  });
  const [prHistory, setPrHistory] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async (page = 1) => {
    setIsLoadingStats(true);
    setIsLoadingHistory(true);
    setFetchError(null);
    try {
      const [statsData, historyResponse] = await Promise.all([
        getPRStats(),
        getPRHistory({ limit: 10, page }),
      ]);
      setDashboardStats(
        statsData || { totalPR: 0, pendingPR: 0, publishedPR: 0, rejectedPR: 0 }
      );
      setPrHistory(historyResponse.pressRelease || []);
      setTotalPages(historyResponse.totalPages || 1);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setFetchError("Could not load dashboard data. Please try again later.");
    } finally {
      setIsLoadingStats(false);
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const columns = [
    { id: "prId", label: "PR No", render: (row) => row.prId || "—" },
    { id: "title", label: "Title", render: (row) => row.title || "N/A" },
    { id: "plan", label: "Plan", render: (row) => row.selectedPlan?.name || "N/A" },
    { id: "client", label: "Client", render: (row) => row.userId?.clientName || "N/A" },
    { id: "credits", label: "Credits", render: (row) => row.selectedPlan?.credits ?? "N/A" },
    { id: "city", label: "City", render: (row) => row.city || "N/A" },
    {
      id: "date",
      label: "Date",
      render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"),
    },
    { id: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        description="Track press releases, wallet balance, and recent submissions."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsPRModelOpen(true)}>
            Add PR
          </Button>
        }
      />

      {fetchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fetchError}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total PR"
            value={dashboardStats.totalPR}
            loading={isLoadingStats}
            to="/press-release"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending PR"
            value={dashboardStats.pendingPR}
            loading={isLoadingStats}
            to="/press-release?status=pending"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Published PR"
            value={dashboardStats.publishedPR}
            loading={isLoadingStats}
            to="/press-release?status=published"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Rejected PR"
            value={dashboardStats.rejectedPR}
            loading={isLoadingStats}
            to="/press-release?status=rejected"
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <WalletBox />
      </Box>

      <PageHeader title="Recent press releases" />
      <DataTable
        columns={columns}
        rows={prHistory}
        loading={isLoadingHistory}
        emptyTitle="No PR history available"
      />
      <AppPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {isPRModelOpen && (
        <PRSubmissionModal
          isOpen={isPRModelOpen}
          onClose={() => setIsPRModelOpen(false)}
          onPRSubmittedSuccessfully={() => {
            setIsPRModelOpen(false);
            fetchData(currentPage);
          }}
        />
      )}
    </Box>
  );
}

export default Home;
