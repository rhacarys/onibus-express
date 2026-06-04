import { Refresh } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erro não tratado capturado:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: 3,
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" color="error" sx={{ fontWeight: "bold" }}>
            Ops! Algo deu errado.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "sm" }}>
            Tivemos um problema inesperado ao renderizar esta página. Tente recarregar ou voltar para o início.
          </Typography>
          <Button variant="contained" size="large" startIcon={<Refresh />} onClick={() => window.location.assign("/")}>
            Recarregar Aplicação
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
