import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
// 1. Define interface for the Context state shape
interface ContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
}

// 2. Export Context with explicit typing and default values
export const Context = createContext<ContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  loading: false,
  setLoading: () => {},
  selected: 0,
  setSelected: () => {},
});

const AppWrapper: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(0);

  return (
    // <Context.Provider
    //   value={{
    //     isAuthenticated,
    //     setIsAuthenticated,
    //     loading,
    //     setLoading,
    //     selected,
    //     setSelected,
    //   }}
    // >
    <App />
    // </Context.Provider>
  );
};

// 3. Mount root element with TS non-null assertion (!)
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
  <AppWrapper />,
  // </React.StrictMode>
);
