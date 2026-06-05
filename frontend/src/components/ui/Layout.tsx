import { DirectionsBus } from "@mui/icons-material";
import { AppBar, Box, Button, Card, Container, Toolbar, Typography } from "@mui/material";
import type { JSX } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function Layout(): JSX.Element {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar component="header" position="static">
        <Toolbar>
          <DirectionsBus sx={{ mr: 2, cursor: "pointer" }} onClick={() => navigate("/")} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            OniBus Express
          </Typography>
          <Button color="inherit" onClick={() => navigate("/consulta")}>
            Consultar Reserva
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>

      <Card
        component="footer"
        sx={{
          p: 2,
          textAlign: "center",
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="caption" color="text.secondary">
            &copy; {new Date().getFullYear()} OniBus Express. Todos os direitos reservados.
          </Typography>
        </Container>
      </Card>
    </Box>
  );
}
