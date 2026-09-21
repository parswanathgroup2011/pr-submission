import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Link as MuiLink, Tooltip, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getAllUsers } from "../../services/adminApi";
import PageHeader from "../../components/ui/PageHeader";
import SearchInput from "../../components/ui/SearchInput";
import FilterBar from "../../components/ui/FilterBar";
import DataTable from "../../components/ui/DataTable";
import AppPagination from "../../components/ui/AppPagination";
import ActionIconButton from "../../components/ui/ActionIconButton";
import UserDetailsDrawer from "./UserDetailsDrawer";

const getImageUrl = (filePath) => {
  if (!filePath) return "";
  const baseUrl = String(import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
  const cleaned = String(filePath).replace(/\\/g, "/").replace(/^\.?\//, "");
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  return `${baseUrl}/${cleaned}`;
};

const DOCUMENT_FIELDS = ["profileImage", "businessLogo", "gstImage", "panImage"];

const countDocuments = (user) =>
  DOCUMENT_FIELDS.reduce((count, field) => count + (user[field] ? 1 : 0), 0);

const websiteHref = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const truncateWebsite = (url) => {
  const display = String(url || "").replace(/^https?:\/\//, "");
  return display.length > 28 ? `${display.slice(0, 26)}…` : display;
};

const locationText = (user) => [user.city, user.state].filter(Boolean).join(", ") || "—";

const UserMaster = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 20;

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data?.users || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Unable to load users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const query = search.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    if (!query) return true;
    return (
      user.clientName?.toLowerCase().includes(query) ||
      user.companyName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.mobileNumber?.toLowerCase().includes(query)
    );
  });
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      id: "company",
      label: "Company",
      render: (user) => (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.companyName || user.clientName || "—"}
          </Typography>
          {user.companyName && user.clientName && user.companyName !== user.clientName ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.clientName}
            </Typography>
          ) : null}
        </Box>
      ),
    },
    {
      id: "contact",
      label: "Contact",
      render: (user) => (
        <Box sx={{ minWidth: 0 }}>
          {user.email ? (
            <Tooltip title={user.email}>
              <MuiLink
                href={`mailto:${user.email}`}
                underline="hover"
                sx={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </MuiLink>
            </Tooltip>
          ) : (
            <Typography variant="body2">—</Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {user.mobileNumber || "—"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "location",
      label: "Location",
      hideBelow: "sm",
      render: (user) => (
        <Typography
          variant="body2"
          sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          title={locationText(user)}
        >
          {locationText(user)}
        </Typography>
      ),
    },
    {
      id: "website",
      label: "Website",
      hideBelow: "md",
      render: (user) =>
        user.website ? (
          <Tooltip title={user.website}>
            <MuiLink
              href={websiteHref(user.website)}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {truncateWebsite(user.website)}
            </MuiLink>
          </Tooltip>
        ) : (
          "—"
        ),
    },
    {
      id: "kyc",
      label: "KYC",
      hideBelow: "sm",
      width: "18%",
      render: (user) => {
        const count = countDocuments(user);
        return (
          <Chip
            size="small"
            label={count ? `${count} document${count === 1 ? "" : "s"}` : "No documents"}
            sx={
              count
                ? { bgcolor: "#DCFCE7", color: "#166534", fontWeight: 600, height: 24 }
                : { bgcolor: "#F1F5F9", color: "#475569", fontWeight: 600, height: 24 }
            }
          />
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      sticky: true,
      width: 76,
      render: (user) => (
        <ActionIconButton title="View user" onClick={() => setSelectedUser(user)}>
          <VisibilityIcon fontSize="small" />
        </ActionIconButton>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Users"
        description="Registered clients and KYC documents."
        toolbar={
          <FilterBar>
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              placeholder="Search by company, name, email, or mobile"
              aria-label="Search users by company, name, email, or mobile"
              sx={{ width: { xs: "100%", sm: 440 } }}
            />
          </FilterBar>
        }
      />
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchUsers}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      <DataTable
        columns={columns}
        rows={paginatedUsers}
        loading={loading}
        loadingVariant="skeleton"
        minWidth={0}
        emptyTitle={query ? "No users match your search" : "No users found"}
        emptyDescription={
          query
            ? "Try a different company, name, email, or mobile."
            : "Registered clients will appear here."
        }
      />
      <AppPagination
        page={currentPage}
        totalPages={totalPages}
        totalCount={filteredUsers.length}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
      <UserDetailsDrawer
        user={selectedUser}
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        getImageUrl={getImageUrl}
      />
    </Box>
  );
};

export default UserMaster;
