import { Layout } from "@/components/ui/Layout";
import Assentos from "@/pages/Assentos";
import Busca from "@/pages/Busca";
import Checkout from "@/pages/Checkout";
import Consulta from "@/pages/Consulta";
import { createBrowserRouter } from "react-router-dom";

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
