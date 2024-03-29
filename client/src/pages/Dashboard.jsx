import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Dashboard.module.scss";
import views from '../assets/Views.svg'
import { Navigate } from "react-router-dom";
import { Context } from "../main";
import moment from 'moment';
import axios from "axios";
import { server } from "../App";
import CustomLoader from "../components/CurstomLoader";
import numeral from 'numeral';


const Dashboard = () => {

  const { setUser, setIsAuthenticated, setLoading, isAuthenticated, loading } = useContext(Context)
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token');
        const response = await axios.get(`${server}/quiz/myQuiz`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setTableData(response.data.quiz);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sumOfQuestions = tableData.reduce((sum, quiz) => sum + quiz.questions.length, 0);

  const sortedTableData = tableData.sort((a, b) => b.quizCount - a.quizCount);

  const sumOfQuizCounts = tableData.reduce((sum, quiz) => sum + quiz.quizCount, 0);



  return (
    <div className={styles["dashboard-parent-cont"]}>
      <Navbar />
      {loading ? (
        <CustomLoader />
      ) : (
        <div className={styles["dashboard-child-cont"]}>
          <div className={styles["dashboard-flex-cont"]}>
            <div className={styles["dashboard-cont"]}>
              <div className={styles['flex-cont-1']}>
                <h1>
                  {tableData.length} <span>Quiz</span>
                </h1>
                <h1>
                  <span>Created</span>
                </h1>
              </div>
            </div>
            <div className={styles["dashboard-cont"]}>
              <div className={styles['flex-cont-2']}>
                <h1>
                  {sumOfQuestions} <span>questions</span>
                </h1>
                <h1>
                  <span>Created</span>
                </h1>
              </div>
            </div>
            <div className={styles["dashboard-cont"]}>
              <div className={styles['flex-cont-3']}>
                <h1>
                  {numeral(sumOfQuizCounts).format('0.0a')} <span>Total</span>
                </h1>
                <h1>
                  <span>Impressions</span>
                </h1>
              </div>
            </div>
          </div>
          <div className={styles['quiz-parent-cont']}>
            <h2>Trending Quizs</h2>
            {sortedTableData.length === 0 ? (
              <p className={styles["warning"]}>You haven't created any Quiz, Click on Create Quiz to create your first Quiz</p>
            ) : (
              <div className={styles['quiz-cont']}>
                {sortedTableData.map((quiz, index) => (
                  <div className={styles['quiz-box']} key={index}>
                    <div className={styles['quiz-flex-data']}>
                      <p className={styles['quiz-name']}>{quiz.quizName}</p>
                      <div className={styles['view-icon']}>
                        <p>{quiz.quizCount}<img src={views} alt="" /></p>
                      </div>
                    </div>
                    <p className={styles['green-span']}>Created on: {moment(quiz.createdAt).format('DD MMM, YYYY')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );

};

export default Dashboard;
