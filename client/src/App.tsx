import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import QuestionAnalysisPage from "./pages/analytics/QuestionAnalysisPage";
import CreateQuizPage from "./pages/Quiz/CreateQuizPage";
import EditQuizPage from "./pages/Quiz/EditQuizPage";
import Quiz from "./pages/quizInterface/quiz/Quiz";
import LandingPage from "./pages/landing/LandingPage";
import ProtectedLayout from "./components/ProtectedLayout";

export const server = "http://localhost:3001/api/v1";

function App() {
  return (
    <Router>
      <Routes>
        {/* =====================================================
            PUBLIC ROUTES
        ====================================================== */}

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<AuthPage />} />

        {/* =====================================================
            PROTECTED APPLICATION
            AppLayout handles authentication.
        ====================================================== */}

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/analytics" element={<AnalyticsPage />} />

          <Route path="/createQuiz" element={<CreateQuizPage />} />

          <Route path="/editQuiz/:id" element={<EditQuizPage />} />

          <Route path="/ques-analysis/:id" element={<QuestionAnalysisPage />} />
        </Route>

        {/* =====================================================
            PUBLIC QUIZ
        ====================================================== */}

        <Route path="/quiz/:id" element={<Quiz />} />
      </Routes>

      <Toaster />
    </Router>
  );
}

export default App;
