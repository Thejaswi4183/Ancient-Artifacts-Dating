// components/ThemeRegistry.tsx
"use client";

import { ReactNode } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8b5a2b", // Match your parchment theme
    },
  },
  typography: {
    fontFamily: `"Cinzel", "Cormorant Garamond", serif`,
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
