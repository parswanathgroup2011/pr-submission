import React, { useEffect, useState } from "react";
import { Avatar, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  getAllPressReleases,
  downloadPressReleasePDF,
  approvePressRelease,
  rejectPressRelease,
} from "../../services/pressReleaseService";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import AppPagination from "../../components/ui/AppPagination";
import StatusBadge from "../../components/ui/StatusBadge";
import ActionIconButton from "../../components/ui/ActionIconButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import FilterBar from "../../components/ui/FilterBar";
import StatusFilter from "../../components/ui/StatusFilter";
import useAuthedFileUrl from "../../hooks/useAuthedFileUrl";
import { handleError, handleSuccess } from "../../utils";

const stripHtml = (html) =>
  String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

function PressReleaseThumbnail({ filePath }) {
  const src = useAuthedFileUrl(filePath);
  return <Avatar variant="rounded" src={src || undefined} alt="PR" sx={{ width: 56, height: 40 }} />;
}

const AdminPressReleaseTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [confirm, setConfirm] = useState({ open: false, type: null, id: null });

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const data = await getAllPressReleases();
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPrs(data);
      } catch (error) {
        console.error("Error fetching PRs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPRs();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const filteredPrs =
    statusFilter === "all" ? prs : prs.filter((pr) => pr.status === statusFilter);

  const runAction = async () => {
    const { type, id } = confirm;
    try {
      if (type === "approve") {
        await approvePressRelease(id);
        setPrs((prev) => prev.map((pr) => (pr._id === id ? { ...pr, status: "published" } : pr)));
        handleSuccess("Press release approved");
      } else {
        await rejectPressRelease(id);
        setPrs((prev) => prev.map((pr) => (pr._id === id ? { ...pr, status: "rejected" } : pr)));
        handleSuccess("Press release rejected");
      }
    } catch (error) {
      handleError(error.response?.data?.error || "Action failed");
    } finally {
      setConfirm({ open: false, type: null, id: null });
    }
  };

  const totalPages = Math.ceil(filteredPrs.length / rowsPerPage) || 1;
  const paginated = filteredPrs.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const columns = [
    { id: "prId", label: "PR ID" },
    { id: "client", label: "Client", render: (pr) => pr.userId?.clientName || "N/A" },
    { id: "title", label: "Title" },
    { id: "summary", label: "Summary", render: (pr) => pr.summary || "—" },
    { id: "content", label: "Content", render: (pr) => stripHtml(pr.content) || "—" },
    {
      id: "image",
      label: "Image",
      render: (pr) =>
        pr.image ? (
          <PressReleaseThumbnail filePath={pr.image} />
        ) : (
          "—"
        ),
    },
    { id: "quote", label: "Quote", render: (pr) => pr.quoteDescription || "—" },
    { id: "city", label: "City" },
    { id: "tags", label: "Tags", render: (pr) => pr.tags?.join(", ") || "—" },
    {
      id: "scheduledAt",
      label: "Scheduled",
      render: (pr) => (pr.scheduledAt ? new Date(pr.scheduledAt).toLocaleString() : "—"),
    },
    { id: "status", label: "Status", render: (pr) => <StatusBadge status={pr.status} /> },
    { id: "plan", label: "Plan", render: (pr) => pr.selectedPlan?.name || "N/A" },
    { id: "category", label: "Category", render: (pr) => pr.selectedCategory?.name || "N/A" },
    { id: "created", label: "Created", render: (pr) => new Date(pr.createdAt).toLocaleString() },
    { id: "updated", label: "Updated", render: (pr) => new Date(pr.updatedAt).toLocaleString() },
    {
      id: "actions",
      label: "Actions",
      render: (pr) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <ActionIconButton title="Download PDF" onClick={() => downloadPressReleasePDF(pr._id)}>
            <DownloadIcon fontSize="small" />
          </ActionIconButton>
          {pr.status === "pending" && (
            <>
              <ActionIconButton
                title="Approve"
                color="success"
                onClick={() => setConfirm({ open: true, type: "approve", id: pr._id })}
              >
                <CheckCircleOutlineIcon fontSize="small" />
              </ActionIconButton>
              <ActionIconButton
                title="Reject"
                color="error"
                onClick={() => setConfirm({ open: true, type: "reject", id: pr._id })}
              >
                <CancelOutlinedIcon fontSize="small" />
              </ActionIconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Press releases"
        description="Review, approve, reject, and download submissions."
        showBack
        backTo="/admin"
        toolbar={
          <FilterBar>
            <StatusFilter
              value={statusFilter}
              onChange={(value) => {
                if (!value || value === "all") setSearchParams({});
                else setSearchParams({ status: value });
              }}
            />
          </FilterBar>
        }
      />
      <DataTable
        columns={columns}
        rows={paginated}
        loading={loading}
        emptyTitle={
          statusFilter === "all"
            ? "No press releases found"
            : `No ${statusFilter} press releases found`
        }
      />
      <AppPagination
        page={page}
        totalPages={totalPages}
        totalCount={filteredPrs.length}
        pageSize={rowsPerPage}
        onPageChange={setPage}
      />
      <ConfirmDialog
        open={confirm.open}
        title={confirm.type === "approve" ? "Approve this press release?" : "Reject this press release?"}
        description={
          confirm.type === "approve"
            ? "The client's wallet will be charged for the selected plan."
            : "No wallet deduction will occur."
        }
        confirmLabel={confirm.type === "approve" ? "Approve" : "Reject"}
        destructive={confirm.type === "reject"}
        onClose={() => setConfirm({ open: false, type: null, id: null })}
        onConfirm={runAction}
      />
    </Box>
  );
};

export default AdminPressReleaseTable;
