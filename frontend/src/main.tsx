import App from "@/App";
import { AppProvider } from "@/providers/AppProvider";
import React from "react";
import ReactDOM from "react-dom/client";

async function enableMocking() {
  if (import.meta.env.MODE !== "development") return;
  const { worker } = await import("./__mocks__/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>,
  );
});
