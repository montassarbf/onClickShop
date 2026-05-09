import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProfileProvider } from "./context/ProfileContext";
import { clearOldCaches } from "./utils";

// One-time cleanup to ensure no 'poisoned' objects remain in local storage from old deployments.
if (!localStorage.getItem("v2_boot")) {
  clearOldCaches();
  localStorage.setItem("v2_boot", "true");
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <ProfileProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ProfileProvider>
    </BrowserRouter>
  </StrictMode>
);
