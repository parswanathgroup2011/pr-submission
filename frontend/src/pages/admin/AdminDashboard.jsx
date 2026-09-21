import React, { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { Alert, Box } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { getAllPressReleases } from "../../services/pressReleaseService";
import { getAllTransactions } from "../../services/adminApi";
import { getPendingTopups } from "../../services/adminManualTopupApi";
import { getAdminNotifications } from "../../services/notificationApi";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import DashboardPanel from "./dashboard/DashboardPanel";
import RangeToggle from "./dashboard/RangeToggle";
import NeedsAttention from "./dashboard/NeedsAttention";
import RecentActivity from "./dashboard/RecentActivity";
import {
  asArray,
  buildActivity,
  computePrStats,
  formatInr,
  prsByPlan,
  prTrendSeries,
  statusDistribution,
  walletFlowSeries,
} from "./dashboard/dashboardUtils";

function AdminDashboard() {
  const [prs, setPrs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingTopups, setPendingTopups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prRange, setPrRange] = useState("30d");
  const [walletRange, setWalletRange] = useState("30d");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        getAllPressReleases(),
        getAllTransactions(),
        getPendingTopups(),
        getAdminNotifications(),
      ]);
      if (cancelled) return;

      const [prRes, txRes, topupRes, noteRes] = results;
      if (prRes.status === "fulfilled") setPrs(asArray(prRes.value));
      if (txRes.status === "fulfilled") setTransactions(asArray(txRes.value?.transactions));
      if (topupRes.status === "fulfilled") setPendingTopups(asArray(topupRes.value));
      if (noteRes.status === "fulfilled") setNotifications(asArray(noteRes.value));

      const failed = results.filter((result) => result.status === "rejected").length;
      if (failed === results.length) {
        setError("Could not load dashboard data. Please try again later.");
      } else if (failed > 0) {
        setError("Some dashboard data could not be loaded.");
      } else {
        setError(null);
      }
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => computePrStats(prs), [prs]);
  const trend = useMemo(() => prTrendSeries(prs, prRange), [prs, prRange]);
  const wallet = useMemo(() => walletFlowSeries(transactions, walletRange), [transactions, walletRange]);
  const planRows = useMemo(() => prsByPlan(prs), [prs]);
  const statusRows = useMemo(() => statusDistribution(stats), [stats]);
  const activity = useMemo(
    () => buildActivity({ prs, transactions, notifications }),
    [prs, transactions, notifications]
  );

  const pieData = statusRows
    .filter((row) => row.value > 0)
    .map((row) => ({ id: row.id, value: row.value, label: row.label, color: row.color }));

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        description="Operations overview for press releases, payments, and wallet activity."
      />

      {error && (
        <Alert severity="warning" sx={{ mb: 2.5 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total PRs"
            value={stats.totalPR}
            loading={loading}
            to="/admin/press-releases"
            icon={<DescriptionOutlinedIcon fontSize="small" />}
            context={stats.pendingPR > 0 ? `${stats.pendingPR} awaiting review` : "All submissions"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending"
            value={stats.pendingPR}
            loading={loading}
            to="/admin/press-releases?status=pending"
            icon={<HourglassEmptyIcon fontSize="small" />}
            iconColor="warning.main"
            context={stats.totalPR > 0 ? `${stats.pendingPR} of ${stats.totalPR}` : "Needs review"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Published"
            value={stats.publishedPR}
            loading={loading}
            to="/admin/press-releases?status=published"
            icon={<CheckCircleOutlineIcon fontSize="small" />}
            iconColor="success.main"
            context={stats.totalPR > 0 ? `${stats.publishedPR} of ${stats.totalPR}` : "Approved submissions"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Rejected"
            value={stats.rejectedPR}
            loading={loading}
            to="/admin/press-releases?status=rejected"
            icon={<CancelOutlinedIcon fontSize="small" />}
            iconColor="error.main"
            context={stats.totalPR > 0 ? `${stats.rejectedPR} of ${stats.totalPR}` : "Not charged"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <DashboardPanel
            title="PR Submission Trend"
            action={<RangeToggle value={prRange} onChange={setPrRange} ariaLabel="PR trend range" />}
          >
            {loading ? (
              <LoadingState minHeight={280} label="Loading trend" />
            ) : prs.length === 0 ? (
              <EmptyState
                title="No submissions yet"
                description="The chart will show daily volume once press releases are submitted."
              />
            ) : (
              <LineChart
                height={280}
                grid={{ horizontal: true, vertical: true }}
                xAxis={[{ data: trend.labels, scaleType: "point", tickLabelStyle: { fontSize: 11 } }]}
                yAxis={[{ min: 0, tickMinStep: 1 }]}
                series={[
                  {
                    data: trend.counts,
                    label: "Submissions",
                    area: true,
                    showMark: trend.labels.length <= 7,
                    color: "#1B51BD",
                    valueFormatter: (value) => `${value ?? 0} PR${value === 1 ? "" : "s"}`,
                  },
                ]}
                margin={{ left: 40, right: 12, top: 16, bottom: 24 }}
                hideLegend
              />
            )}
          </DashboardPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <DashboardPanel title="PR Status">
            {loading ? (
              <LoadingState minHeight={280} label="Loading status" />
            ) : stats.totalPR === 0 ? (
              <EmptyState title="No status data" description="Status distribution appears after the first submission." />
            ) : (
              <Box>
                <Box sx={{ position: "relative" }}>
                  <PieChart
                    height={210}
                    series={[
                      {
                        data: pieData,
                        innerRadius: 55,
                        outerRadius: 85,
                        paddingAngle: 2,
                        cornerRadius: 4,
                        highlightScope: { fade: "global", highlight: "item" },
                      },
                    ]}
                    hideLegend
                    margin={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                      pb: 1,
                    }}
                  >
                    <Box sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>{stats.totalPR}</Box>
                    <Box sx={{ fontSize: 12, color: "text.secondary" }}>Total</Box>
                  </Box>
                </Box>
                <Box sx={{ mt: 1 }}>
                  {statusRows.map((row) => (
                    <Box
                      key={row.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 0.5,
                        gap: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: row.color, flexShrink: 0 }} />
                        <Box sx={{ fontSize: 13, color: "text.secondary" }}>{row.label}</Box>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1.5, fontSize: 13 }}>
                        <Box sx={{ fontWeight: 600 }}>{row.value}</Box>
                        <Box sx={{ color: "text.secondary", minWidth: 36, textAlign: "right" }}>
                          {row.percent == null ? "—" : `${row.percent}%`}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </DashboardPanel>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <DashboardPanel
            title="Wallet Money Flow"
            action={
              <RangeToggle value={walletRange} onChange={setWalletRange} ariaLabel="Wallet flow range" />
            }
          >
            {loading ? (
              <LoadingState minHeight={280} label="Loading wallet flow" />
            ) : transactions.length === 0 ? (
              <EmptyState
                title="No wallet transactions"
                description="Credits from approved top-ups and debits from approved PRs will appear here."
              />
            ) : (
              <BarChart
                height={280}
                grid={{ horizontal: true }}
                xAxis={[{ data: wallet.labels, scaleType: "band", tickLabelStyle: { fontSize: 11 } }]}
                yAxis={[{ min: 0, valueFormatter: (value) => formatInr(value) }]}
                series={[
                  {
                    data: wallet.credits,
                    label: "Credits",
                    color: "#15803D",
                    valueFormatter: (value) => formatInr(value),
                  },
                  {
                    data: wallet.debits,
                    label: "Debits",
                    color: "#1B51BD",
                    valueFormatter: (value) => formatInr(value),
                  },
                ]}
                margin={{ left: 64, right: 12, top: 24, bottom: 24 }}
                borderRadius={4}
              />
            )}
          </DashboardPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <DashboardPanel title="PRs by Plan">
            {loading ? (
              <LoadingState minHeight={280} label="Loading plans" />
            ) : planRows.length === 0 ? (
              <EmptyState
                title="No plan data"
                description="Plan usage appears once submissions include a selected plan."
              />
            ) : (
              <BarChart
                height={Math.max(280, planRows.length * 36)}
                layout="horizontal"
                grid={{ vertical: true }}
                yAxis={[
                  {
                    data: planRows.map((row) => row.name),
                    scaleType: "band",
                    width: 120,
                    tickLabelStyle: { fontSize: 11 },
                  },
                ]}
                xAxis={[{ min: 0, tickMinStep: 1 }]}
                series={[
                  {
                    data: planRows.map((row) => row.count),
                    label: "PRs",
                    color: "#1B51BD",
                    valueFormatter: (value) => `${value ?? 0} PR${value === 1 ? "" : "s"}`,
                  },
                ]}
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
                borderRadius={4}
                hideLegend
              />
            )}
          </DashboardPanel>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <DashboardPanel title="Needs Attention">
            <NeedsAttention
              pendingPrs={stats.pendingPR}
              pendingPayments={pendingTopups.length}
              loading={loading}
            />
          </DashboardPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <DashboardPanel title="Recent Activity">
            <RecentActivity items={activity} loading={loading} />
          </DashboardPanel>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
