import type { JSX } from "react";
import { Outlet } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container, Box, Button } from "@mui/material";
import { DirectionsBus } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export function Layout(): JSX.Element {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
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
    </Box>
  );
}
