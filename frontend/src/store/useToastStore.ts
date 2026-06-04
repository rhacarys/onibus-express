import { type AlertColor } from "@mui/material";
import { create } from "zustand";

interface ToastState {
  open: boolean;
  message: string;
  type: AlertColor;
  showToast: (message: string, type?: AlertColor) => void;
  closeToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  open: false,
  message: "",
  type: "info",
  showToast: (message, type = "info") => set({ open: true, message, type }),
  closeToast: () => set({ open: false }),
}));
