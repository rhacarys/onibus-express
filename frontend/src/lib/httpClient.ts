import { api } from "@/services/api";

export const httpClient = {
  get: <T>(url: string, config?: object): Promise<T> => api.get<T>(url, config).then((res) => res.data),
  post: <T>(url: string, data?: object): Promise<T> => api.post<T>(url, data).then((res) => res.data),
  put: <T>(url: string, data?: object): Promise<T> => api.put<T>(url, data).then((res) => res.data),
  patch: <T>(url: string, data?: object): Promise<T> => api.patch<T>(url, data).then((res) => res.data),
  delete: <T>(url: string): Promise<T> => api.delete<T>(url).then((res) => res.data),
};
