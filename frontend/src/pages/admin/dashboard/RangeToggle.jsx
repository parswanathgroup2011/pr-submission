import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const OPTIONS = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "3m", label: "3 Months" },
];

export default function RangeToggle({ value, onChange, ariaLabel }) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      onChange={(_, next) => next && onChange(next)}
      aria-label={ariaLabel}
      sx={{
        "& .MuiToggleButton-root": {
          px: 1.25,
          py: 0.5,
          fontSize: 12,
          borderColor: "divider",
        },
      }}
    >
      {OPTIONS.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
