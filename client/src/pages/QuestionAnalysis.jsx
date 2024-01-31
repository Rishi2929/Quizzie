import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../main';
import styles from '../styles/QuestionAnalysis.module.scss'
import Navbar from '../components/Navbar';
import axios from 'axios';
import { server } from '../App';



const QuestionAnalysis = () => {
      const { id } = useParams();
      const { setUser, setIsAuthenticated, setLoading } = useContext(Context);
      const [selectedQuiz, setSelectedQuiz] = useState(null);
      const [tableData, setTableData] = useState([]);


      useEffect(() => {
            const fetchData = async () => {
                  try {
                        const token = localStorage.getItem('token');
                        const response = await axios.get(`${server}/quiz/myQuiz`, {
                              headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                              }
                        });
                        setTableData(response.data.quiz);
                        // console.log(tableData)
                  } catch (error) {
                        console.error('Error fetching data:', error);
                  }
            };

            // Call the fetchData function when the component mounts
            fetchData();
      }, []);

      useEffect(() => {
            // Filter the tableData to find the selected quiz
            const quiz = tableData?.find((quiz) => quiz._id === id);
            setSelectedQuiz(quiz);
            console.log(selectedQuiz)

      }, [id, tableData]);
      // console.log(selectedQuiz?.quizType)
      // console.log(selectedQuiz?.questions)

      if (!selectedQuiz) {
            return <div>Loading...</div>;
      }

      return (
            <div className={styles["main-div"]}>
                  {selectedQuiz?.quizType === "Poll" && (
                        <div className={styles['parent-cont']}>
                              <Navbar />
                              <div className={styles['poll-content-container']}>
                                    <div className={styles['quiz-analysis-header']}>
                                          <h2>{selectedQuiz.quizName} Question Analysis</h2>
                                    </div>
                                    {selectedQuiz.questions.map((question, index) => (
                                          <div key={index} className={styles['poll-div']}>
                                                <p>Question {index + 1}: {question.questionTitle}</p>
                                                <div className={styles['poll-options-container']}>
                                                      {question.options.map((option, optionIndex) => (
                                                            <div key={optionIndex} className={styles['poll-option-div']}>
                                                                  {/* {option.optionTitle} */}
                                                                  <p>{option.count} <span>                                                                  option {optionIndex + 1}
                                                                  </span></p>
                                                            </div>
                                                      ))}
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  )


                  }
                  {selectedQuiz?.quizType === 'QA' && (
                        <div className={styles['parent-cont']}>
                              <Navbar />
                              Qa
                              <div className={styles['poll-content-container']}>
                                    <div className={styles['quiz-analysis-header']}>
                                          <h2>{selectedQuiz.quizName} Question Analysis</h2>
                                    </div>
                                    {selectedQuiz.questions.map((question, index) => (
                                          <div key={index} className={styles['question-div']}>
                                                <p>Question {index + 1}: {question.questionTitle}</p>
                                                <div className={styles["QA-flex-option"]}>
                                                      <div className={styles["option-div"]}>
                                                            <p>{question.totalAttempts}</p>
                                                            <p>people Attempted the question</p>
                                                      </div>
                                                      {question.options.map((option, optionIndex) => (
                                                            <div key={optionIndex} className={styles["option-div"]}>
                                                                  <p>{option?.count}</p>
                                                                  <p>people Answered Correctly</p>
                                                            </div>
                                                      ))}



                                                      <div className={styles["option-div"]}>
                                                            <p>60</p>
                                                            <p>people Answered Incorrectly</p>
                                                      </div>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  )}
            </div>
      );

};

export default QuestionAnalysis;


// <div className={styles['question-parent-cont']}>
// <Navbar />
// <div className={styles['content-container']}>
//       <div className={styles['quiz-analysis-header']}>
//             <h2>{selectedQuiz.quizName} Question Analysis</h2>
//       </div>
//       {selectedQuiz.questions.map((question, index) => (
//             <div key={index} className={styles['question-div']}>
//                   <p>Question {index + 1}: {question.questionTitle}</p>
//                   <div className={styles['options-container']}>
//                         {question.options.map((option, optionIndex) => (
//                               <div key={optionIndex} className={styles['option-div']}>
//                                     {/* {option.optionTitle} */}
//                                     option {optionIndex + 1}
//                               </div>
//                         ))}
//                   </div>
//             </div>
//       ))}
// </div>
// </div>


