import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProfileProvider } from "./context/ProfileContext";

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
