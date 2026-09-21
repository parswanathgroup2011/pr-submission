import { Avatar, Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import DetailsDrawer from "../../components/ui/DetailsDrawer";
import AppDialog from "../../components/ui/AppDialog";
import { useState } from "react";

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

function DocumentCard({ label, src, onView }) {
  return (
    <Paper elevation={1} sx={{ p: 1.5, borderRadius: "12px", height: "100%" }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
        {label}
      </Typography>
      {src ? (
        <>
          <Box
            component="img"
            src={src}
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

export default function UserDetailsDrawer({ user, open, onClose, getImageUrl }) {
  const [preview, setPreview] = useState({ open: false, src: "", title: "" });

  if (!user) return null;

  const websiteHref = user.website
    ? user.website.startsWith("http")
      ? user.website
      : `https://${user.website}`
    : "";

  const openPreview = (src, title) => {
    if (!src) return;
    setPreview({ open: true, src, title });
  };

  const documents = [
    { label: "Profile photo", src: getImageUrl(user.profileImage) },
    { label: "Company logo", src: getImageUrl(user.businessLogo) },
    { label: "GST document", src: getImageUrl(user.gstImage) },
    { label: "PAN document", src: getImageUrl(user.panImage) },
  ];

  return (
    <>
      <DetailsDrawer open={open} onClose={onClose} title="User details" width={560}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            src={getImageUrl(user.profileImage) || undefined}
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
                  src={doc.src}
                  onView={() => openPreview(doc.src, doc.label)}
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
          <Field label="Role">{valueOrDash(user.role)}</Field>
          <Field label="Created">
            {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
          </Field>
          <Field label="Updated">
            {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"}
          </Field>
        </Section>
      </DetailsDrawer>

      <AppDialog
        open={preview.open}
        onClose={() => setPreview({ open: false, src: "", title: "" })}
        title={preview.title}
        maxWidth="md"
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            component="img"
            src={preview.src}
            alt={preview.title}
            sx={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: 1 }}
          />
        </Box>
      </AppDialog>
    </>
  );
}
