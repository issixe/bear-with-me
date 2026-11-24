import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Admin from "./interfaces/pages/Admin";
import Home from "./interfaces/pages/Home";
import Learn from "./interfaces/pages/Learn";
import ModuleComplete from "./interfaces/pages/ModuleComplete";
import "./styles/index.css";
import { ServicesProvider } from "./interfaces/context/ServicesContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "learn", element: <Learn /> },
      { path: "module-complete", element: <ModuleComplete /> },
      // add new pages here, e.g. { path: "about", element: <About /> }
    ],
  },
  { path: "/admin", element: <Admin /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ServicesProvider>
      <RouterProvider router={router} />
    </ServicesProvider>
  </React.StrictMode>,
);
