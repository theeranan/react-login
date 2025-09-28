import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import Home from "./pages/Home";

const container = document.getElementById("root");

// **Only declare `root` once**
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
