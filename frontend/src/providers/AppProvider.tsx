import { GlobalSnackbar } from "@/components/ui/GlobalSnackbar";
import { queryClient } from "@/lib/queryClient";
import { theme } from "@/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClientProvider } from "@tanstack/react-query";
import "dayjs/locale/pt-br";
import { type ReactNode } from "react";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <CssBaseline />
          {children}
          <GlobalSnackbar />
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
