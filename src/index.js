import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/authContext";
import { BillProvider } from "./context/billContext";
import { PaymentProvider } from "./context/paymentContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BillProvider>
        <PaymentProvider>
        <App />
        </PaymentProvider>
      </BillProvider>
    </AuthProvider>
  </React.StrictMode>
);
