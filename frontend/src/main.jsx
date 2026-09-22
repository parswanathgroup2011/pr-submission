import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App";
import ThemeModeProvider, { useColorMode } from "./components/layout/ThemeModeProvider";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

function ThemedToastContainer() {
  const { mode } = useColorMode();
  return <ToastContainer position="top-right" newestOnTop closeOnClick theme={mode} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeModeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ThemedToastContainer />
  </ThemeModeProvider>
);
