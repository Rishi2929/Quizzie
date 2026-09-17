import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Navbar";
const API_URL = import.meta.env.VITE_API_URL;

export default function ProtectedLayout() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${API_URL}/users/me`, {
          withCredentials: true,
        });

        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] font-sans text-slate-900">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* existing background elements */}
      </div>

      <div className="relative mx-auto max-w-[1600px]">
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
          {/* Navbar / Sidebar */}
          <div className="md:sticky md:top-0 md:h-screen">
            <Sidebar />
          </div>

          {/* Page */}
          <main className="min-w-0 w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
