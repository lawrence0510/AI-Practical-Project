import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import App2 from "./App2.jsx";
import App3 from "./App3.jsx";
import App23 from "./App23.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/app2",
    element: <App2 />,
  },
  {
    path: "/app3",
    element: <App3 />,
  },
  {
    path: "/app23",
    element: <App23 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} /> {/* 使用 RouterProvider 來提供路由 */}
  </React.StrictMode>
);
