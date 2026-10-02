import { Avatar, Box, Button, Grid, MenuItem, Paper, Stack, Typography } from "@mui/material";
import DetailsDrawer from "../../components/ui/DetailsDrawer";
import AppDialog from "../../components/ui/AppDialog";
import AuthedImage from "../../components/ui/AuthedImage";
import FormField from "../../components/ui/FormField";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import useAuthedFileUrl from "../../hooks/useAuthedFileUrl";
import { updateUserRole } from "../../services/adminApi";
import { handleError, handleSuccess } from "../../utils";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const ROLE_OPTIONS = ["user", "admin"];

function currentUserId() {
  const token = localStorage.getItem("authToken");
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?._id ? String(payload._id) : "";
  } catch {
    return "";
  }
}

function roleErrorMessage(err) {
  const status = err?.response?.status;
  const message = err?.response?.data?.message || err?.response?.data?.error;
  if (status === 400) return message || "Role must be user or admin.";
  if (status === 403) return message || "You do not have permission to change this role.";
  if (status === 404) return message || "User not found.";
  if (status === 401) return "Your session has ended. Please sign in again.";
  return "Unable to update role. Please try again.";
}

const valueOrDash = (value) => (value ? value : "—");

function Section({ title, children }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="overline"
        sx={{ color: "text.secondary", letterSpacing: "0.06em", fontWeight: 600 }}
      >
        {title}
      </Typography>
      <Box sx={{ mt: 1.25 }}>{children}</Box>
    </Box>
  );
}

function Field({ label, children }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
        {children}
      </Typography>
    </Box>
  );
}

function DocumentCard({ label, filePath, onView }) {
  const src = useAuthedFileUrl(filePath);

  return (
    <Paper elevation={1} sx={{ p: 1.5, borderRadius: "12px", height: "100%" }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
        {label}
      </Typography>
      {filePath ? (
        <>
          <Box
            component="img"
            src={src || undefined}
            alt={label}
            onClick={onView}
            sx={{
              width: "100%",
              height: 120,
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              mb: 1,
              bgcolor: "background.default",
              cursor: "pointer",
            }}
          />
          <Button size="small" onClick={onView}>
            View document
          </Button>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Not uploaded
        </Typography>
      )}
    </Paper>
  );
}

export default function UserDetailsDrawer({ user, open, onClose, onUpdated, socketSyncPending = false }) {
  const [preview, setPreview] = useState({ open: false, filePath: "", title: "" });
  const [role, setRole] = useState("user");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const avatarSrc = useAuthedFileUrl(user?.profileImage);
  const isSelf = Boolean(user?._id) && String(user._id) === currentUserId();

  useEffect(() => {
    setRole(ROLE_OPTIONS.includes(user?.role) ? user.role : "user");
    setSaving(false);
    setConfirmOpen(false);
  }, [user?._id, user?.role]);

  if (!user) return null;

  const websiteHref = user.website
    ? user.website.startsWith("http")
      ? user.website
      : `https://${user.website}`
    : "";

  const openPreview = (filePath, title) => {
    if (!filePath) return;
    setPreview({ open: true, filePath, title });
  };

  const confirmRoleChange = async () => {
    setConfirmOpen(false);
    setSaving(true);
    try {
      const data = await updateUserRole(user._id, role);
      const savedRole = data?.user?.role || role;
      const socketSync = data?.socketSync !== false;
      onUpdated?.({ _id: user._id, role: savedRole, socketSync });
      if (!socketSync) {
        toast.warning(
          data?.message ||
            "Role saved, but this user's live admin access could not be updated. Save the role again to retry.",
          { position: "top-right" }
        );
      } else {
        handleSuccess(data?.message || "Role updated");
      }
    } catch (err) {
      handleError(roleErrorMessage(err));
      setRole(ROLE_OPTIONS.includes(user.role) ? user.role : "user");
    } finally {
      setSaving(false);
    }
  };

  const retryingSocketSync = socketSyncPending && role === user.role;

  const documents = [
    { label: "Profile photo", filePath: user.profileImage },
    { label: "Company logo", filePath: user.businessLogo },
    { label: "GST document", filePath: user.gstImage },
    { label: "PAN document", filePath: user.panImage },
  ];

  return (
    <>
      <DetailsDrawer open={open} onClose={onClose} title="User details" width={560}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            src={avatarSrc || undefined}
            alt={user.clientName || "User"}
            sx={{ width: 72, height: 72 }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6">{valueOrDash(user.clientName)}</Typography>
            {user.email && (
              <Typography
                variant="body2"
                component="a"
                href={`mailto:${user.email}`}
                sx={{ color: "primary.main", display: "block" }}
              >
                {user.email}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {valueOrDash(user.mobileNumber)}
            </Typography>
          </Box>
        </Stack>

        <Section title="Company information">
          <Field label="Company name">{valueOrDash(user.companyName)}</Field>
          <Field label="Client type">{valueOrDash(user.clientType)}</Field>
          <Field label="Website">
            {websiteHref ? (
              <Box component="a" href={websiteHref} target="_blank" rel="noopener noreferrer">
                {user.website}
              </Box>
            ) : (
              "—"
            )}
          </Field>
        </Section>

        <Section title="Address">
          <Field label="Address">{valueOrDash(user.address)}</Field>
          <Field label="State">{valueOrDash(user.state)}</Field>
          <Field label="City">{valueOrDash(user.city)}</Field>
          <Field label="Pincode">{valueOrDash(user.pincode)}</Field>
        </Section>

        <Section title="Business / KYC">
          <Field label="GST number">{valueOrDash(user.gstNumber)}</Field>
          <Field label="PAN number">{valueOrDash(user.panNumber)}</Field>
          <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
            {documents.map((doc) => (
              <Grid key={doc.label} size={{ xs: 12, sm: 6 }}>
                <DocumentCard
                  label={doc.label}
                  filePath={doc.filePath}
                  onView={() => openPreview(doc.filePath, doc.label)}
                />
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section title="Bank details">
          <Field label="Bank name">{valueOrDash(user.bankName)}</Field>
          <Field label="Branch name">{valueOrDash(user.branchName)}</Field>
          <Field label="Account number">{valueOrDash(user.accountNumber)}</Field>
          <Field label="IFSC">{valueOrDash(user.ifscCode)}</Field>
          <Field label="MICR">{valueOrDash(user.micrCode)}</Field>
          <Field label="Branch code">{valueOrDash(user.branchCode)}</Field>
          <Field label="Authorised name">{valueOrDash(user.authorisedName)}</Field>
        </Section>

        <Section title="Account">
          <FormField
            select
            label="Role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            disabled={isSelf || saving}
            size="small"
            fullWidth
            helperText={
              isSelf
                ? "You cannot change your own role."
                : retryingSocketSync
                  ? "Role saved. Live admin access could not be updated. Save again to retry."
                  : "Saves this account's access level."
            }
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </FormField>
          <Button
            variant="contained"
            disabled={isSelf || saving || (role === user.role && !socketSyncPending)}
            onClick={() => setConfirmOpen(true)}
            sx={{ mb: 2 }}
          >
            {saving ? "Saving…" : retryingSocketSync ? "Retry role sync" : "Save role"}
          </Button>
          <Field label="Created">
            {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
          </Field>
          <Field label="Updated">
            {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"}
          </Field>
        </Section>
      </DetailsDrawer>

      <ConfirmDialog
        open={confirmOpen}
        title="Change role?"
        description={
          retryingSocketSync
            ? `Retry live access for ${user.clientName || "this user"}. Their saved role is already ${role}.`
            : `Set ${user.clientName || "this user"} to ${role}.`
        }
        confirmLabel={retryingSocketSync ? "Retry role sync" : "Save role"}
        destructive={role === "user"}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmRoleChange}
      />

      <AppDialog
        open={preview.open}
        onClose={() => setPreview({ open: false, filePath: "", title: "" })}
        title={preview.title}
        maxWidth="md"
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <AuthedImage
            filePath={preview.filePath}
            alt={preview.title}
            sx={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: 1 }}
          />
        </Box>
      </AppDialog>
    </>
  );
}
