import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Dashboard.module.scss";
import views from '../assets/Views.svg'
import { Navigate } from "react-router-dom";
import { Context } from "../main";



const quizData = [
  { quizName: "Quiz1", quizCreated: 45, questionCreated: 110, totalImpressions: "1.1k", views: 667, createdOn: "25 Jan 2024" },
  { quizName: "Quiz2", quizCreated: 30, questionCreated: 90, totalImpressions: "800", views: 450, createdOn: "26 Jan 2024" },
  { quizName: "Quiz3", quizCreated: 25, questionCreated: 80, totalImpressions: "750", views: 400, createdOn: "27 Jan 2024" },
  { quizName: "Quiz4", quizCreated: 40, questionCreated: 120, totalImpressions: "950", views: 550, createdOn: "28 Jan 2024" },
  { quizName: "Quiz5", quizCreated: 35, questionCreated: 100, totalImpressions: "900", views: 500, createdOn: "29 Jan 2024" },
  { quizName: "Quiz6", quizCreated: 50, questionCreated: 130, totalImpressions: "1.2k", views: 700, createdOn: "30 Jan 2024" },
  { quizName: "Quiz7", quizCreated: 28, questionCreated: 85, totalImpressions: "780", views: 420, createdOn: "31 Jan 2024" },
  { quizName: "Quiz8", quizCreated: 32, questionCreated: 95, totalImpressions: "820", views: 480, createdOn: "1 Feb 2024" },
  { quizName: "Quiz9", quizCreated: 48, questionCreated: 115, totalImpressions: "1.0k", views: 600, createdOn: "2 Feb 2024" },
  { quizName: "Quiz10", quizCreated: 42, questionCreated: 105, totalImpressions: "980", views: 570, createdOn: "3 Feb 2024" },
  { quizName: "Quiz11", quizCreated: 38, questionCreated: 93, totalImpressions: "870", views: 460, createdOn: "4 Feb 2024" },
  { quizName: "Quiz12", quizCreated: 22, questionCreated: 75, totalImpressions: "720", views: 380, createdOn: "5 Feb 2024" },
  { quizName: "Quiz13", quizCreated: 46, questionCreated: 112, totalImpressions: "1.1k", views: 670, createdOn: "6 Feb 2024" },
  { quizName: "Quiz14", quizCreated: 33, questionCreated: 98, totalImpressions: "840", views: 490, createdOn: "7 Feb 2024" },
  { quizName: "Quiz15", quizCreated: 27, questionCreated: 88, totalImpressions: "760", views: 430, createdOn: "8 Feb 2024" },
  { quizName: "Quiz16", quizCreated: 43, questionCreated: 107, totalImpressions: "960", views: 580, createdOn: "9 Feb 2024" },
  { quizName: "Quiz17", quizCreated: 31, questionCreated: 92, totalImpressions: "810", views: 470, createdOn: "10 Feb 2024" },
  { quizName: "Quiz18", quizCreated: 36, questionCreated: 102, totalImpressions: "890", views: 510, createdOn: "11 Feb 2024" },
  { quizName: "Quiz19", quizCreated: 29, questionCreated: 87, totalImpressions: "770", views: 440, createdOn: "12 Feb 2024" },
  { quizName: "Quiz20", quizCreated: 34, questionCreated: 96, totalImpressions: "830", views: 500, createdOn: "13 Feb 2024" },
];



const Dashboard = () => {

  const { isAuthenticated, setIsAuthenticated, loading, setLoading } = useContext(Context);


  // if (isAuthenticated) return <Navigate to={"/"} />

  return (
    <div className={styles["dashboard-parent-cont"]}>
      <Navbar />
      <div className={styles["dashboard-child-cont"]}>
        <div className={styles["dashboard-flex-cont"]}>
          <div className={styles["dashboard-cont"]}>
            <div className={styles['flex-cont-1']}>
              <h1>
                12<span>Quiz</span>
              </h1>
              <h1>
                <span>Created</span>
              </h1>
            </div>
          </div>
          <div className={styles["dashboard-cont"]}>
            <div className={styles['flex-cont-2']}>
              <h1 >
                12 <span>questions</span>
              </h1>
              <h1>
                <span>Created</span>
              </h1>
            </div>
          </div>
          <div className={styles["dashboard-cont"]}>
            <div className={styles['flex-cont-3']}>
              <h1>
                12 <span>Total</span>
              </h1>
              <h1>
                <span>Impressions</span>
              </h1>
            </div>
          </div>
        </div>
        <div className={styles['quiz-parent-cont']}>
          <h2>Trending Quizs</h2>
          <div className={styles['quiz-cont']}>
            {quizData.map((quiz, index) => (
              <div className={styles['quiz-box']} key={index}>
                <div className={styles['quiz-flex-data']}>
                  <p className={styles['quiz-name']}>{quiz.quizName}</p>
                  <p> {quiz.views}<img src={views} alt="" /></p>
                </div>
                <p className={styles['green-span']}>Created on: {quiz.createdOn}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
