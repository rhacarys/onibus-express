import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout";
import Busca from "../pages/Busca";
import Assentos from "../pages/Assentos";
import Checkout from "../pages/Checkout";
import Consulta from "../pages/Consulta";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Busca /> },
      { path: "viagem/:id/assentos", element: <Assentos /> },
      { path: "checkout", element: <Checkout /> },
      { path: "consulta", element: <Consulta /> },
    ],
  },
]);
