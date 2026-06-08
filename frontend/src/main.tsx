import App from "@/App";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { AppProvider } from "@/providers/AppProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

async function enableMocking() {
  if (import.meta.env.VITE_USE_MSW !== "true") return;
  const { worker } = await import("./__mocks__/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <AppProvider>
          <App />
        </AppProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );
});
