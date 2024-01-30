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
      }, [id, tableData]);
      // console.log(selectedQuiz?.quizType)
      // console.log(selectedQuiz)




      if (!selectedQuiz) {
            return <div>Loading...</div>;
      }

      // <div>
      //       <h3>Quiz</h3>
      //       <p>Quiz Name: {selectedQuiz.quizName}</p>
      //       <p>Created At: {selectedQuiz.createdAt}</p>
      //       <p>Quiz Count: {selectedQuiz.quizCount}</p>
      //       <p>Quiz Type: {selectedQuiz.quizType}</p>
      //       <p>User: {selectedQuiz.user}</p>
      //       <ul>
      //             {selectedQuiz.questions.map((question, index) => (
      //                   <li key={index}>
      //                         Question {index + 1}      {question.questionTitle}
      //                   </li>
      //             ))}
      //       </ul>
      // </div>
      return (
            <>
                  {selectedQuiz?.quizType === "Poll" && (
                        <div className={styles['question-parent-cont']}>
                              <Navbar />
                              <div className={styles['content-container']}>
                                    <div className={styles['quiz-analysis-header']}>
                                          <h2>{selectedQuiz.quizName} Question Analysis</h2>
                                    </div>
                                    {selectedQuiz.questions.map((question, index) => (
                                          <div key={index} className={styles['question-div']}>
                                                <p>Question {index + 1}: {question.questionTitle}</p>
                                                <div className={styles['options-container']}>
                                                      {question.options.map((option, optionIndex) => (
                                                            <div key={optionIndex} className={styles['option-div']}>
                                                                  {/* {option.optionTitle} */}
                                                                  option {optionIndex + 1}
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
                        <div className={styles['question-parent-cont']}>
                              <Navbar />
                              <div className={styles['content-container']}>
                                    <div className={styles['quiz-analysis-header']}>
                                          <h2>{selectedQuiz.quizName} Question Analysis</h2>
                                    </div>
                                    {selectedQuiz.questions.map((question, index) => (
                                          <div key={index} className={styles['question-div']}>
                                                <p>Question {index + 1}: {question.questionTitle}</p>
                                                <div className={styles['options-container']}>
                                                      {question.options.map((option, optionIndex) => (
                                                            <div key={optionIndex} className={styles['option-div']}>
                                                                  {/* {option.optionTitle} */}
                                                                  option {optionIndex + 1}
                                                            </div>
                                                      ))}
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  )}
            </>
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