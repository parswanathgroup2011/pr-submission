import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "../../theme";

const ColorModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("colorMode") === "dark"
      ? "dark"
      : "light"
  );

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => {
        setMode((current) => {
          const next = current === "light" ? "dark" : "light";
          localStorage.setItem("colorMode", next);
          return next;
        });
      },
    }),
    [mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
