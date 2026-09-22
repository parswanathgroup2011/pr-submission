import { createTheme } from "@mui/material/styles";

const PRIMARY = {
  main: "#1B51BD",
  dark: "#153F94",
  light: "#3B6FD4",
  contrastText: "#FFFFFF",
};

export function createAppTheme(mode = "light") {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: PRIMARY,
      secondary: {
        main: isLight ? "#0F172A" : "#E5E5E5",
      },
      background: {
        default: isLight ? "#F8FAFC" : "#0A0A0A",
        paper: isLight ? "#FFFFFF" : "#141414",
      },
      text: {
        primary: isLight ? "#0F172A" : "#FAFAFA",
        secondary: isLight ? "#475569" : "#A3A3A3",
      },
      divider: isLight ? "#E2E8F0" : "#262626",
      success: { main: "#15803D" },
      warning: { main: "#D97706" },
      error: { main: "#DC2626" },
      info: { main: "#1B51BD" },
    },
    typography: {
      fontFamily: '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h4: { fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em" },
      h5: { fontWeight: 650, fontSize: "1.25rem", letterSpacing: "-0.02em" },
      h6: { fontWeight: 600, fontSize: "1.05rem" },
      subtitle1: { fontWeight: 500 },
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
            backgroundColor: isLight ? "#F8FAFC" : "#0A0A0A",
            color: isLight ? "#0F172A" : "#FAFAFA",
            fontFamily: '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
            borderColor: isLight ? "#E2E8F0" : "#2E2E2E",
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
            backgroundColor: isLight ? "#FFFFFF" : "#141414",
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isLight ? "#CBD5E1" : "#3A3A3A",
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
            border: `1px solid ${isLight ? "#E2E8F0" : "#262626"}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: isLight ? "#E2E8F0" : "#262626",
            padding: "12px 16px",
            fontSize: "0.875rem",
          },
          head: {
            backgroundColor: isLight ? "#F8FAFC" : "#111111",
            color: isLight ? "#475569" : "#A3A3A3",
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
              backgroundColor: isLight ? "#F8FAFC" : "rgba(255,255,255,0.04)",
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
            backgroundColor: isLight ? "#FFFFFF" : "#111111",
            color: isLight ? "#0F172A" : "#FAFAFA",
            boxShadow: "none",
            borderBottom: `1px solid ${isLight ? "#E2E8F0" : "#262626"}`,
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
}

const theme = createAppTheme("light");
export default theme;
