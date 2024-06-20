import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

// Pages
import ErrorPage from "./pages/ErrorPage.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import BookSlot from "./pages/BookSlot.jsx";
import Bookings from "./pages/Bookings.jsx";
import AllBookings from "./pages/AllBookings.jsx";
import ManageSlots from "./pages/ManageSlots.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/book-slot", element: <BookSlot /> },
      { path: "/bookings", element: <Bookings /> },
      { path: "/all-bookings", element: <AllBookings /> },
      { path: "/manage-slots", element: <ManageSlots /> },
    ],
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
