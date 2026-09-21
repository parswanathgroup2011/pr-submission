import { MenuItem, TextField } from "@mui/material";

export default function StatusFilter({ value = "all", onChange }) {
  return (
    <TextField
      select
      label="Status"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ maxWidth: { xs: "100%", sm: 220 } }}
    >
      <MenuItem value="all">All</MenuItem>
      <MenuItem value="pending">Pending</MenuItem>
      <MenuItem value="published">Published</MenuItem>
      <MenuItem value="rejected">Rejected</MenuItem>
    </TextField>
  );
}
