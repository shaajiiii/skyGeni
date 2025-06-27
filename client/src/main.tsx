import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DashboardProvider } from "./context/DashboardContext.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </BrowserRouter>
  </StrictMode>
);
