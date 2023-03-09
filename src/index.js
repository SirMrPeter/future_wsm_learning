import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "context/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "App";
import { SocketProvider } from "context/socket";

// Material Dashboard 2 PRO React Context Provider
import { MaterialUIControllerProvider } from "context";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <MaterialUIControllerProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </MaterialUIControllerProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
