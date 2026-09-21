import { TextField } from "@mui/material";

export default function FormField({
  label,
  required,
  error,
  helperText,
  children,
  ...props
}) {
  return (
    <TextField
      label={label}
      required={required}
      error={Boolean(error)}
      helperText={error || helperText}
      {...props}
    >
      {children}
    </TextField>
  );
}
