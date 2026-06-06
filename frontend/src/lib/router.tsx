/* eslint-disable react-refresh/only-export-components */
import { Layout } from "@/components/ui/Layout";
import { Box, LinearProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const Busca = lazy(() => import("@/pages/Busca"));
const Assentos = lazy(() => import("@/pages/Assentos"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Consulta = lazy(() => import("@/pages/Consulta"));

const lazyRoute = (Component: React.ComponentType) => (
  <Suspense
    fallback={
      <Box
        role="alert"
        aria-busy="true"
        aria-label="Carregando página..."
        sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 1400 }}
      >
        <LinearProgress color="primary" />
      </Box>
    }
  >
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: lazyRoute(Busca) },
      { path: "viagem/:id/assentos", element: lazyRoute(Assentos) },
      { path: "checkout", element: lazyRoute(Checkout) },
      { path: "consulta", element: lazyRoute(Consulta) },
    ],
  },
]);
