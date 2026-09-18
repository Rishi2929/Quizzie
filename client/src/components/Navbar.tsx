import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BarChart3, ChevronRight, LayoutDashboard, Loader2, LogOut, Menu, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Sidebar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardActive = location.pathname === "/dashboard";
  const isAnalyticsActive = location.pathname === "/analytics";

  const logoutHandler = async (): Promise<void> => {
    if (isLoggingOut) return; // Prevent extra triggers

    setIsLoggingOut(true);
    try {
      await axios.post(
        `${API_URL}/users/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      setMobileMenuOpen(false);
      navigate("/login", { replace: true });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Unable to logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside className="hidden h-full min-h-0 border-r border-slate-200/60 bg-white/45 p-5 backdrop-blur-md md:flex md:flex-col md:justify-between">
        <div>
          {/* Brand */}
          <Link to="/dashboard" className="group inline-flex items-center gap-0.5">
            <span className="font-serif text-2xl font-black italic tracking-tighter text-slate-900 transition-colors group-hover:text-violet-600">
              Quizzie
            </span>
            <span className="text-xl font-black text-violet-600 transition-transform group-hover:rotate-12">✦</span>
          </Link>

          {/* Create Quiz */}
          <Link to="/createQuiz" className="mt-7 block">
            <Button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-xs font-bold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg active:scale-[0.98]"
            >
              <PlusCircle className="size-4" />
              <span>Create Quiz</span>
            </Button>
          </Link>

          {/* Navigation */}
          <nav className="mt-8">
            <p className="px-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>

            <div className="mt-3 space-y-1.5">
              <SidebarItem to="/dashboard" active={isDashboardActive} icon={<LayoutDashboard className="size-4" />}>
                Dashboard
              </SidebarItem>

              <SidebarItem to="/analytics" active={isAnalyticsActive} icon={<BarChart3 className="size-4" />}>
                Analytics
              </SidebarItem>
            </div>
          </nav>
        </div>

        {/* Bottom */}
        <div className="space-y-4">
          <Button
            type="button"
            onClick={logoutHandler}
            disabled={isLoggingOut}
            variant="ghost"
            className="group h-10 w-full justify-start rounded-xl border border-slate-200/80 bg-white/50 px-3 text-xs font-semibold text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-sm disabled:pointer-events-none disabled:opacity-60"
          >
            {isLoggingOut ? (
              <Loader2 className="mr-3 size-4 animate-spin text-rose-600" />
            ) : (
              <LogOut className="mr-3 size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            )}
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </Button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE HEADER
      ========================================================= */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/55 px-4 backdrop-blur-md md:hidden">
        <Link to="/dashboard" className="group inline-flex items-center gap-0.5">
          <span className="font-serif text-xl font-black italic tracking-tighter text-slate-900">Quizzie</span>
          <span className="text-lg font-black text-violet-600 transition-transform group-hover:rotate-12">✦</span>
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-xl text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </header>

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}
      {/* =========================================================
    MOBILE MENU
========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex h-dvh flex-col bg-[#FAF9F6] md:hidden">
          {/* Mobile menu header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/70 px-4 backdrop-blur-md">
            <Link to="/dashboard" className="group inline-flex items-center gap-0.5">
              <span className="font-serif text-xl font-black italic tracking-tighter text-slate-900">Quizzie</span>
              <span className="text-lg font-black text-violet-600 transition-transform group-hover:rotate-12">✦</span>
            </Link>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Full-screen navigation */}
          <div className="flex flex-1 flex-col justify-between p-5 overflow-y-auto">
            <nav className="space-y-1.5">
              <MobileSidebarItem to="/dashboard" active={isDashboardActive} icon={<LayoutDashboard className="size-4" />}>
                Dashboard
              </MobileSidebarItem>

              <MobileSidebarItem to="/analytics" active={isAnalyticsActive} icon={<BarChart3 className="size-4" />}>
                Analytics
              </MobileSidebarItem>

              <Link to="/createQuiz" className="block pt-4">
                <Button className="h-11 w-full rounded-xl bg-violet-600 text-xs font-bold text-white shadow-md shadow-violet-200 hover:bg-violet-700">
                  <PlusCircle className="mr-2 size-4" />
                  Create Quiz
                </Button>
              </Link>
            </nav>

            {/* Logout pinned at bottom */}
            <div className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={logoutHandler}
                disabled={isLoggingOut}
                className="h-11 w-full justify-start rounded-xl px-3 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:pointer-events-none disabled:opacity-60"
              >
                {isLoggingOut ? <Loader2 className="mr-2.5 size-4 animate-spin text-rose-600" /> : <LogOut className="mr-2.5 size-4" />}
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* =========================================================
   DESKTOP NAV ITEM
========================================================= */
interface SidebarItemProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, active, icon, children }) => {
  return (
    <Link
      to={to}
      className={`group flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold transition-all duration-200 ${
        active ? "bg-violet-100/80 text-violet-700 shadow-sm" : "text-slate-500 hover:bg-slate-100/70 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? "text-violet-600" : "text-slate-400"}>{icon}</span>
        <span>{children}</span>
      </div>

      <ChevronRight
        className={`size-3 transition-all duration-200 ${
          active ? "translate-x-0 opacity-100 text-violet-500" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
        }`}
      />
    </Link>
  );
};

/* =========================================================
   MOBILE NAV ITEM
========================================================= */
const MobileSidebarItem: React.FC<SidebarItemProps> = ({ to, active, icon, children }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold transition-colors ${
        active ? "bg-violet-100/80 text-violet-700" : "text-slate-500 hover:bg-slate-100/70 hover:text-slate-900"
      }`}
    >
      <span className={active ? "text-violet-600" : "text-slate-400"}>{icon}</span>
      {children}
    </Link>
  );
};

export default Sidebar;
