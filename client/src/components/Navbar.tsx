import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Popup from "./Popup";
import { Context } from "../main";
import toast from "react-hot-toast";
import { LayoutDashboard, BarChart3, PlusCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavTab = "dashboard" | "analytics" | "createQuiz";

const Navbar: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated, setLoading, selected, setSelected } = useContext(Context);

  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = (btnName: NavTab): void => {
    if (btnName === "createQuiz") {
      setPopupVisible(true);
    }
  };

  const closePopup = (): void => {
    setPopupVisible(false);
  };

  const logoutHandler = (): void => {
    setSelected(0);
    setLoading(true);
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-[#FAF9F6]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Brand Header */}
          <Link
            to="/dashboard"
            onClick={() => setSelected(0)}
            className="flex items-center gap-1 text-2xl font-black tracking-tight font-serif italic text-slate-900 transition-opacity hover:opacity-90"
          >
            Quizzie<span className="text-violet-600 font-sans not-italic">.</span>
          </Link>

          {/* Navigation Links & Action Buttons */}
          <nav className="flex items-center gap-1 md:gap-2">
            <Link
              to="/dashboard"
              onClick={() => {
                handleButtonClick("dashboard");
                setSelected(0);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                selected === 0 || location.pathname === "/dashboard"
                  ? "bg-violet-100/70 text-violet-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-violet-600" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/analytics"
              onClick={() => {
                handleButtonClick("analytics");
                setSelected(1);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                selected === 1 || location.pathname === "/analytics"
                  ? "bg-violet-100/70 text-violet-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <BarChart3 className="h-4 w-4 text-violet-600" />
              <span>Analytics</span>
            </Link>

            {/* Create Quiz Modal Trigger */}
            <Button
              type="button"
              onClick={() => handleButtonClick("createQuiz")}
              className="ml-2 flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-violet-700 hover:shadow-violet-200 active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Quiz</span>
            </Button>

            {/* Logout Action */}
            {isAuthenticated && (
              <div className="ml-3 flex items-center pl-3 border-l border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={logoutHandler}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Popup Dialog Container */}
      {isPopupVisible && <Popup onClose={closePopup} isPopupVisible={isPopupVisible} />}
    </>
  );
};

export default Navbar;
