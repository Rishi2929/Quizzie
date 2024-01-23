import { Toaster } from "react-hot-toast";
import "./App.module.scss";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import styles from "./styles/Login.module.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Context } from "./main";
import axios from "axios";

export const server = "http://localhost:3000/api/v1";



function App() {
  const { setUser, setIsAuthenticated, setLoading } = useContext(Context)

  useEffect(() => {
    setLoading(true)
    axios.get(`${server}/users/me`,
      {
        withCredentials: true

      }).then(res => {
        setUser(res.data.user),
          setIsAuthenticated(true)
        setLoading(false)

      }).catch((error) => {
        // error.response.data.message,
        setUser({});
        setIsAuthenticated(false)
        setLoading(false)


      })
  }, [])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
