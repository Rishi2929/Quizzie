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
import Quiz from "./components/quizInterface/quiz/Quiz";

export const server = "http://localhost:3000/api/v1";
// export const server = "https://quizzie-amms.onrender.com/api/v1";


function App() {
  const { setUser, setIsAuthenticated, setLoading } = useContext(Context)

  useEffect(() => {
    console.log("Use Effect")
    setLoading(true)
    axios.get(`${server}/users/me`, {
      withCredentials: true

    })
      .then(res => {
        console.log("then user is authenticated")

        setUser(res.data.user),
          setIsAuthenticated(true)
        setLoading(false)
        console.log("then user is authenticated")

      }).catch((error) => {
        // error.response.data.message,
        setUser({});
        setIsAuthenticated(false)
        setLoading(false)
        console.log("catch")


      })
  }, [])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/quiz/:id" element={<Quiz />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
