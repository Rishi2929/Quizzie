import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import React from "react";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />,
  </React.StrictMode>,
);
