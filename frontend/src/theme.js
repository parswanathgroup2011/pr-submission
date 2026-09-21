import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1B51BD",
      dark: "#153F94",
      light: "#3B6FD4",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#0F172A",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
    divider: "#E2E8F0",
    success: { main: "#15803D" },
    warning: { main: "#D97706" },
    error: { main: "#DC2626" },
    info: { main: "#1B51BD" },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em" },
    h5: { fontWeight: 650, fontSize: "1.25rem", letterSpacing: "-0.02em" },
    h6: { fontWeight: 600, fontSize: "1.05rem" },
    subtitle1: { fontWeight: 500, color: "#475569" },
    body1: { fontSize: "0.9375rem" },
    body2: { fontSize: "0.875rem" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0 1px 2px rgba(15, 23, 42, 0.06)",
    "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
    "0 4px 12px rgba(15, 23, 42, 0.06)",
    "0 8px 24px rgba(15, 23, 42, 0.08)",
    ...Array(20).fill("0 8px 24px rgba(15, 23, 42, 0.08)"),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F8FAFC",
          color: "#0F172A",
        },
        a: {
          color: "#1B51BD",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 16,
          paddingBlock: 8,
          minHeight: 40,
        },
        sizeSmall: {
          minHeight: 32,
          paddingInline: 12,
        },
        containedPrimary: {
          "&:hover": { backgroundColor: "#153F94" },
        },
        outlined: {
          borderColor: "#E2E8F0",
          color: "#0F172A",
          "&:hover": {
            borderColor: "#1B51BD",
            backgroundColor: "rgba(27, 81, 189, 0.04)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: 8,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#CBD5E1",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1B51BD",
          },
        },
        input: {
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
          border: "1px solid #E2E8F0",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#E2E8F0",
          padding: "12px 16px",
          fontSize: "0.875rem",
        },
        head: {
          backgroundColor: "#F8FAFC",
          color: "#475569",
          fontWeight: 600,
          fontSize: "0.75rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#F8FAFC",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 650,
          fontSize: "1.125rem",
          padding: "20px 24px 12px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "8px 24px 16px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 24px 20px",
          gap: 8,
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1B51BD",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
