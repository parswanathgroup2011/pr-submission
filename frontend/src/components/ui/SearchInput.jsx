import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  "aria-label": ariaLabel = "Search",
  sx,
}) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputProps={{ "aria-label": ariaLabel }}
      sx={{ maxWidth: { xs: "100%", sm: 420 }, ...sx }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </InputAdornment>
        ),
      }}
    />
  );
}
