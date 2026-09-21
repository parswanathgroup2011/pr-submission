import { IconButton, Tooltip } from "@mui/material";

export default function ActionIconButton({
  title,
  onClick,
  color = "default",
  disabled,
  children,
}) {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          color={color}
          disabled={disabled}
          aria-label={title}
          sx={{ width: 36, height: 36 }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}
