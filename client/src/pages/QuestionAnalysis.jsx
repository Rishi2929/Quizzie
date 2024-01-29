import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../main';
import styles from '../styles/QuestionAnalysis.module.scss'
import Navbar from '../components/Navbar';

const QuestionAnalysis = () => {
      const { id } = useParams();
      const { setUser, setIsAuthenticated, setLoading, tableData, setTableData } = useContext(Context);
      const [selectedQuiz, setSelectedQuiz] = useState(null);

      useEffect(() => {
            // Filter the tableData to find the selected quiz
            const quiz = tableData.find((quiz) => quiz._id === id);
            setSelectedQuiz(quiz);
      }, [id, tableData]);
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
            <div className={styles['question-parent-cont']}>
                  <Navbar />
                  <div className={styles['content-container']}>
                        {selectedQuiz.questions.map((question, index) => (
                              <div key={index} className={styles['question-div']}>
                                    Question {index + 1}: {question.questionTitle}
                                    <div className={styles['options-container']}>
                                          {question.options.map((option, optionIndex) => (
                                                <div key={optionIndex} className={styles['option-div']}>
                                                      {option.optionTitle}
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        ))}
                  </div>
            </div>
      );

};

export default QuestionAnalysis;
