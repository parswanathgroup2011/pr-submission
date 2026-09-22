import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function FormField({
  label,
  required,
  error,
  helperText,
  children,
  type,
  InputProps,
  ...props
}) {
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      label={label}
      required={required}
      error={Boolean(error)}
      helperText={error || helperText}
      {...props}
      type={isPassword ? (visible ? "text" : "password") : type}
      InputProps={{
        ...InputProps,
        ...(isPassword
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={visible ? "Hide password" : "Show password"}
                    onClick={() => setVisible((current) => !current)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {visible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : {}),
      }}
    >
      {children}
    </TextField>
  );
}
