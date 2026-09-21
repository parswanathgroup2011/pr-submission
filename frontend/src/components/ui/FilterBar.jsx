import { Box } from "@mui/material";

export default function FilterBar({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      {children}
    </Box>
  );
}
