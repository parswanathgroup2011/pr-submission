import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { getPendingTopups, approveTopup, rejectTopup } from "../../services/adminManualTopupApi";
import PageHeader from "../../components/ui/PageHeader";
import SearchInput from "../../components/ui/SearchInput";
import FilterBar from "../../components/ui/FilterBar";
import DataTable from "../../components/ui/DataTable";
import AppPagination from "../../components/ui/AppPagination";
import ActionIconButton from "../../components/ui/ActionIconButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import AppDialog from "../../components/ui/AppDialog";
import AuthedImage from "../../components/ui/AuthedImage";
import { handleError, handleSuccess } from "../../utils";

const AdminManualTopups = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openImage, setOpenImage] = useState(false);
  const [imageFile, setImageFile] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [confirm, setConfirm] = useState({ open: false, type: null, id: null });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPendingTopups();
      setRequests(data);
    } catch (err) {
      console.log("Failed to load topups", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = requests.filter(
    (r) =>
      r.userId?.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      r.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.userId?.mobileNumber?.includes(search)
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const runAction = async () => {
    try {
      if (confirm.type === "approve") {
        await approveTopup(confirm.id);
        handleSuccess("Payment approved");
      } else {
        await rejectTopup(confirm.id);
        handleSuccess("Payment rejected");
      }
      setConfirm({ open: false, type: null, id: null });
      await load();
    } catch (err) {
      handleError("Action failed");
    }
  };

  const columns = [
    { id: "sr", label: "Sr", render: (_row, index) => (currentPage - 1) * itemsPerPage + index + 1 },
    { id: "name", label: "Client name", render: (row) => row.userId?.clientName },
    { id: "email", label: "Email", render: (row) => row.userId?.email },
    { id: "mobile", label: "Mobile", render: (row) => row.userId?.mobileNumber },
    { id: "amount", label: "Amount", render: (row) => `₹ ${row.amount}` },
    {
      id: "screenshot",
      label: "Screenshot",
      render: (row) => (
        <ActionIconButton
          title="View"
          onClick={() => {
            setImageFile(row.screenshot);
            setOpenImage(true);
          }}
        >
          <VisibilityIcon fontSize="small" />
        </ActionIconButton>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <ActionIconButton
            title="Approve"
            color="success"
            onClick={() => setConfirm({ open: true, type: "approve", id: row._id })}
          >
            <CheckCircleOutlineIcon fontSize="small" />
          </ActionIconButton>
          <ActionIconButton
            title="Reject"
            color="error"
            onClick={() => setConfirm({ open: true, type: "reject", id: row._id })}
          >
            <CancelOutlinedIcon fontSize="small" />
          </ActionIconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Payment requests"
        description="Approve or reject manual wallet top-ups."
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
              placeholder="Search by name, email or mobile"
            />
          </FilterBar>
        }
      />
      <DataTable columns={columns} rows={paginated} loading={loading} emptyTitle="No requests found" />
      <AppPagination
        page={currentPage}
        totalPages={totalPages}
        totalCount={filtered.length}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
      <ConfirmDialog
        open={confirm.open}
        title={confirm.type === "approve" ? "Approve this payment?" : "Reject this payment?"}
        description={
          confirm.type === "approve"
            ? "The user's wallet will be credited."
            : "The request will be marked rejected with no credit."
        }
        confirmLabel={confirm.type === "approve" ? "Approve" : "Reject"}
        destructive={confirm.type === "reject"}
        onClose={() => setConfirm({ open: false, type: null, id: null })}
        onConfirm={runAction}
      />
      <AppDialog open={openImage} onClose={() => setOpenImage(false)} title="Payment screenshot" maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <AuthedImage
            filePath={imageFile}
            alt="Screenshot"
            sx={{ width: "100%", maxWidth: 600, borderRadius: 1 }}
          />
        </Box>
      </AppDialog>
    </Box>
  );
};

export default AdminManualTopups;
