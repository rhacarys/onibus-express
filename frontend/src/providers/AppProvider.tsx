import { GlobalSnackbar } from "@/components/ui/GlobalSnackbar";
import { queryClient } from "@/lib/queryClient";
import { theme } from "@/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <GlobalSnackbar />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
