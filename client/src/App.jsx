import toast, { Toaster } from "react-hot-toast";
import "./App.module.scss";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import styles from "./styles/Login.module.scss";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Context } from "./main";
import axios from "axios";
import Quiz from "./components/quizInterface/quiz/Quiz";
import EditQuiz from "./components/EditQuiz";
import QuestionAnalysis from "./pages/QuestionAnalysis";

// export const server = "http://localhost:3000/api/v1";
export const server = "https://quizzie-o9kt.onrender.com/api/v1";


function App() {
  const { setUser, setIsAuthenticated, setLoading } = useContext(Context)

  useEffect(() => {
    // console.log("Use Effect")
    setLoading(true)
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/editQuiz/:id" element={<EditQuiz />} />
        <Route path="/ques-analysis/:id" element={<QuestionAnalysis />} />


      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
