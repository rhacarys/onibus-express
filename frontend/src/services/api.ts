import { queryClient } from "@/lib/queryClient";
import { useToastStore } from "@/store/useToastStore";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const showToast = useToastStore.getState().showToast;
    if (error.response) {
      const mensagem = error.response.data?.message || `Erro do servidor (${error.response.status}).`;
      showToast(mensagem, "error");
      if (error.response.status === 409) {
        queryClient.invalidateQueries({ queryKey: ["viagem", error.response.data?.viagemId] });
      }
    } else if (error.request) {
      showToast("Servidor indisponível. Verifique sua conexão.", "error");
    } else {
      showToast("Erro ao processar a requisição.", "error");
    }
    return Promise.reject(error);
  },
);
