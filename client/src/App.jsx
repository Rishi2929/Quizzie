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

export const server = "http://localhost:3000/api/v1";
// export const server = "https://quizzie-amms.onrender.com/api/v1";
// export const server = "https://quizzie-exp.onrender.com/api/v1";


function App() {
  const { setUser, setIsAuthenticated, setLoading, tableData, setTableData } = useContext(Context)


  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("token")) {
        setIsAuthenticated(true)
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${server}/quiz/myQuiz`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });
          setTableData(response.data.quiz);
          // console.log(tableData)
        } catch (error) {
          console.error('Error fetching data:', error);
        }

      }
      else {
        toast.error('Login Session Expired')
      }

    };

    fetchData();
  }, [tableData]);
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
