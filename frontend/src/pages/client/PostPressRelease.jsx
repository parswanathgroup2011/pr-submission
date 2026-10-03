import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PRSubmissionModal from "../../components/pr_submission/PRSubmissionModal";
import { getPRHistory, deletePressRelease } from "../../services/pressReleaseService";
import { handleSuccess, handleError } from "../../utils";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import AppPagination from "../../components/ui/AppPagination";
import StatusBadge from "../../components/ui/StatusBadge";
import ActionIconButton from "../../components/ui/ActionIconButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import FilterBar from "../../components/ui/FilterBar";
import StatusFilter from "../../components/ui/StatusFilter";

const PAGE_SIZE = 10;

const PostPressRelease = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [prList, setPrList] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPR, setEditingPR] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const isFiltered = statusFilter !== "all";

  const fetchFiltered = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPRHistory({ page: 1, limit: 1000 });
      const filtered = (response.pressRelease || []).filter(
        (pr) => pr.status === statusFilter
      );
      setFilteredRows(filtered);
    } catch {
      handleError("Failed to load press releases");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  const fetchPage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPRHistory({ page: currentPage, limit: PAGE_SIZE });
      setFilteredRows([]);
      setPrList(response.pressRelease || []);
      setTotalPages(response.totalPages || 1);
    } catch {
      handleError("Failed to load press releases");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    if (isFiltered) fetchFiltered();
  }, [isFiltered, fetchFiltered]);

  useEffect(() => {
    if (!isFiltered) fetchPage();
  }, [isFiltered, fetchPage]);

  const fetchPRs = isFiltered ? fetchFiltered : fetchPage;

  useEffect(() => {
    if (!isFiltered) return;
    setPrList(
      filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    );
    setTotalPages(Math.ceil(filteredRows.length / PAGE_SIZE) || 1);
  }, [filteredRows, currentPage, isFiltered]);

  const handleStatusChange = (value) => {
    if (!value || value === "all") setSearchParams({});
    else setSearchParams({ status: value });
  };

  const confirmDelete = async () => {
    try {
      await deletePressRelease(deleteId);
      handleSuccess("PR deleted successfully");
      setDeleteId(null);
      fetchPRs();
    } catch (err) {
      handleError(err.response?.data?.error || "Delete failed");
    }
  };

  const columns = [
    { id: "prId", label: "PR No", render: (row) => row.prId },
    { id: "title", label: "Title" },
    { id: "client", label: "Client", render: (row) => row.userId?.clientName || "N/A" },
    { id: "credits", label: "Credits", render: (row) => row.selectedPlan?.credits || "N/A" },
    { id: "city", label: "City" },
    { id: "date", label: "Date", render: (row) => new Date(row.createdAt).toLocaleString() },
    { id: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      id: "actions",
      label: "Actions",
      render: (row) =>
        (row.status === "draft" || row.status === "pending") && (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <ActionIconButton
              title="Edit"
              onClick={() => {
                setEditingPR(row);
                setEditModalOpen(true);
              }}
            >
              <EditIcon fontSize="small" />
            </ActionIconButton>
            <ActionIconButton title="Delete" color="error" onClick={() => setDeleteId(row._id)}>
              <DeleteOutlineIcon fontSize="small" />
            </ActionIconButton>
          </Box>
        ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Press releases"
        description="Review, edit, or delete submissions that are still pending."
        showBack
        backTo="/home"
        toolbar={
          <FilterBar>
            <StatusFilter value={statusFilter} onChange={handleStatusChange} />
          </FilterBar>
        }
      />
      <DataTable
        columns={columns}
        rows={prList}
        loading={isLoading}
        emptyTitle={
          isFiltered ? `No ${statusFilter} press releases found` : "No press releases found"
        }
      />
      <AppPagination
        page={currentPage}
        totalPages={totalPages}
        totalCount={isFiltered ? filteredRows.length : undefined}
        pageSize={isFiltered ? PAGE_SIZE : undefined}
        onPageChange={setCurrentPage}
      />

      {editModalOpen && (
        <PRSubmissionModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingPR(null);
          }}
          onPRSubmittedSuccessfully={() => {
            setEditModalOpen(false);
            setEditingPR(null);
            fetchPRs();
          }}
          editPressRelease={editingPR}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete press release?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default PostPressRelease;
