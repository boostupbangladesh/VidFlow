import React from "react";
import ReactDOM from "react-dom/client";
import { VidFlowApp } from "./studio/VidFlowApp";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <VidFlowApp />
  </React.StrictMode>
);
