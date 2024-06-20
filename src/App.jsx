import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";

import useAuthStore from "./hooks/useAuthStore";

export default function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setUser(user);
    } else {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  return (
    <>
      <Navbar />
      <main>
        <Toaster />
        <Outlet />
      </main>
    </>
  );
}
