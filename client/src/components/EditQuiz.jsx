import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import img from "../assets/Delete icon.svg";
import img2 from "../assets/Quiz Test Vector.png";
import { v4 as uuid } from "uuid";
import { server } from "../App";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../main";
import CustomLoader from "./CurstomLoader";

const EditQuiz = () => {
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [showTimerRow, setShowTimerRow] = useState(false);
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } = useContext(Context);


  const [initialData, setInitialData] = useState({
    _id: uuid(),
    optionType: "text",
    correctAnswer: "",
    questionTitle: "",
    options: [
      {
        _id: uuid(),
        imgUrl: "",
        optionTitle: "",
      },
      {
        _id: uuid(),
        imgUrl: "",
        optionTitle: "",
      },
    ],
    timer: "", // Add this line

  });

  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(initialData._id);

  const navigate = useNavigate();
  const param = useParams();
  const quizId = param?.id;

  useEffect(() => {
    if (quizId) {
      fetchQuizData();
    }
  }, [quizId]);

  console.log("questions: ", questions, 111, "selectedOption: ", selectedOption);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${server}/quiz/myQuiz/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (response && response?.data?.quiz) {
        const quiz = response?.data?.quiz;
        console.log("quiz: ", quiz);
        setQuizName(quiz.quizName);
        setQuizType(quiz.quizType);
        setQuestions(quiz.questions);
        setSelectedOption(quiz?.questions?.[0]._id);
        if (quiz.quizType === 'QA') setShowTimerRow(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handles clicking on a question
  const handleQuestionClick = (qId) => {
    if (questions.some((ques) => ques._id == qId)) {
      setSelectedOption(qId);
    }
  };

  // handling adding question to the quiz
  const handlePlusClick = () => {
    if (questions.length >= 5) return;

    let newObj = {};

    const tempData = { ...initialData };

    if (quizType === "QA") {
      newObj = { ...initialData };
    } else {
      delete tempData.correctAnswer;
      newObj = { ...tempData }
    }

    console.log("newObj : ", newObj)

    // const newObj = { ...initialData };

    newObj._id = uuid();

    setQuestions((old) => [...old, newObj]);

    setSelectedOption(newObj._id);
  };

  // Handles deleting a question
  const handleDeleteClick = (e, qId, index) => {
    e.stopPropagation();
    if (questions.some((ques) => ques._id === qId)) {
      setQuestions((old) => old.filter((ques) => ques._id !== qId));

      if (qId === selectedOption) {
        setSelectedOption(questions[0]._id);
      }
    }
  };

  // handling change in input fields and for timer buttons also
  const handleChange = (value, field, qId, opId = "null", answerField = "null", textImgTypeFieldName = "null") => {
    if (field === "questionTitle") {
      setQuestions((old) => old.map((ques) => ques._id === qId ? { ...ques, questionTitle: value } : ques));
    } else if (field === "optionType") {
      const resetOptionsArr = [
        { _id: uuid(), imgUrl: "", optionTitle: "", },
        { _id: uuid(), imgUrl: "", optionTitle: "", },
      ];
      setQuestions((old) => old.map((ques) => ques._id === qId ? { ...ques, optionType: value, options: resetOptionsArr } : ques));
    }
    // handling change in option field for different types like: text, imgUrl and text-imgUrl
    else if (field === "optionField") {
      if (answerField === "answer") {
        setQuestions((old) => old.map((ques) => ques._id === qId ? { ...ques, correctAnswer: value } : ques));
        return;
      }

      const selectedQuestion = questions.find(
        (question) => question._id === qId
      );

      let selectedOptions = [...selectedQuestion.options];

      if (selectedQuestion.optionType === "text") {
        selectedOptions = selectedOptions.map((option) =>
          option._id === opId ? { ...option, optionTitle: value } : option
        );
      } else if (selectedQuestion.optionType === "imgUrl") {
        selectedOptions = selectedOptions.map((option) =>
          option._id === opId ? { ...option, imgUrl: value } : option
        );
      } else if (selectedQuestion.optionType === "text-imgUrl") {
        if (textImgTypeFieldName === "text-field") {
          selectedOptions = selectedOptions.map((option) =>
            option._id === opId ? { ...option, optionTitle: value } : option
          );
        } else if (textImgTypeFieldName === "imgUrl-field") {
          selectedOptions = selectedOptions.map((option) =>
            option._id === opId ? { ...option, imgUrl: value } : option
          );
        }
      }
      setQuestions((old) => old.map((ques) => ques._id === qId ? { ...ques, options: selectedOptions, timer: "" } : ques)); // Reset timer here
    } else if (field === "timer") {
      setQuestions((old) => old.map((ques) => (ques._id === qId ? { ...ques, timer: value } : ques)));
    }
  };


  // Handles adding an option to a question
  const handleAddOptionBtn = (qId) => {
    const optionObj = { _id: uuid(), imgUrl: "", optionTitle: "" };

    if (questions.some((question) => question._id === qId)) {
      const selectedQuestion = questions.find((ques) => ques._id === qId);

      if (selectedQuestion.options.length >= 4) return; // we can't add more than 4 options per question

      const quesOptions = [...selectedQuestion.options, optionObj];

      setQuestions((old) => old.map((ques) => ques._id === qId ? { ...ques, options: quesOptions } : ques));
    }
  };

  // Handles deleting an option from a question
  const handleDeleteOptionBtn = (qId, opId) => {
    const selectionQuestion = questions.find((ques) => ques._id === qId);
    const questionOptions = [...selectionQuestion.options.filter((opt) => opt._id !== opId)];

    setQuestions((old) =>
      old.map((ques) => ques._id === qId ? { ...ques, options: questionOptions } : ques));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { quizName: quizName, quizType: quizType, questions: questions, };
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(`${server}/quiz/updateQuiz/${quizId}`, data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (response && response?.data?.success === false) {
        toast.error(response?.data?.message);
      } else {
        toast.success(response.data.message);
        navigate(`/analytics`);
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while processing your request.");
      }
      // toast.error(response.data.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["popup-parent-cont"]}>
      <div className={styles["popup-child-cont"]}>
        <div className={styles["poll-cont"]}>
          {loading ? <CustomLoader isLoading={loading} /> :
            <>
              <div className={styles["poll-row1"]}>
                {questions.map((ques, index) => {
                  return (
                    <React.Fragment key={ques._id}>
                      <div onClick={() => handleQuestionClick(ques._id)}>
                        <div key={index} className={`${styles.circle} ${selectedOption === ques._id ? styles["circle-selected"] : ""}`}>
                          <p>{index + 1}</p>
                        </div>

                        {index > 0 && (
                          <button onClick={(e) => handleDeleteClick(e, ques._id, index)} className={styles["del-circle-btn"]}>
                            <img src={img2} alt="" />
                          </button>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
                {questions.length < 5 &&
                  <button onClick={() => handlePlusClick()} className={styles["add-circle-btn"]}> + </button>
                }

                <div className={styles["remind"]}>
                  <p>Max 5 questions</p>
                </div>
              </div>

              {questions?.map((ques, index) => {
                return (
                  <>
                    {/* rendering only 1 selected question from array of questions */}
                    {selectedOption === ques._id && (
                      <React.Fragment key={ques._id}>
                        {/* for question title */}
                        <div className={styles["poll-row2"]}>
                          <input placeholder="Poll Question" onChange={(e) => handleChange(e.target.value, "questionTitle", ques._id)} value={ques.questionTitle} />
                        </div>

                        {/* for option types */}
                        <div className={styles["poll-row3"]}>
                          <span>Option Type</span>
                          <label>
                            <input
                              type="radio"
                              value="text"
                              name="optionType"
                              checked={ques.optionType === "text"}
                              onChange={(e) => handleChange(e.target.value, "optionType", ques._id)} />
                            Text
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="imgUrl"
                              name="optionType"
                              checked={ques.optionType === "imgUrl"}
                              onChange={(e) => handleChange(e.target.value, "optionType", ques._id)} />
                            Image URL
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="optionType"
                              value="text-imgUrl"
                              checked={ques.optionType === "text-imgUrl"}
                              onChange={(e) => handleChange(e.target.value, "optionType", ques._id)} />
                            Text & Image URL
                          </label>
                        </div>

                        {/* rendering the options array which is stored in questions array */}
                        <div className={styles["poll-row4"]}>
                          {ques.options?.map((option, optionIndex) => {
                            console.log("ques: ", ques);
                            return (
                              <React.Fragment key={option._id}>
                                {/* this radio button used to select the answer if quiz is QA type. If quiz if poll type then we don't show this button */}
                                <div className={styles["input-types"]}>
                                  {quizType === "QA" && (
                                    <input
                                      type="radio"
                                      name="options"
                                      value={option._id}
                                      checked={ques.correctAnswer === option._id}
                                      className="input-radio"
                                      style={{
                                        accentColor: `${ques.correctAnswer === option._id ? "#60B84B" : ""}`,
                                        color: `${ques.correctAnswer === option._id ? "white" : "black"}`,
                                      }}
                                      onChange={(e) => handleChange(e.target.value, "optionField", ques._id, option._id, "answer")} />
                                  )}
                                  {/* render this input if option type selected is text */}
                                  {ques.optionType === "text" && (
                                    <input
                                      type="text"
                                      placeholder="Text"
                                      className={styles["input-box"]}
                                      value={option.optionTitle}
                                      style={{
                                        background: `${ques.correctAnswer === option._id ? "#60B84B" : ""}`,
                                        color: `${ques.correctAnswer === option._id ? "white" : "black"}`,
                                      }}
                                      onChange={(e) => handleChange(e.target.value, "optionField", ques._id, option._id)} />
                                  )}

                                  {/* render this input if option type selected is image Url */}
                                  {ques.optionType === "imgUrl" && (
                                    <input
                                      type="text"
                                      placeholder="Image URL"
                                      className={styles["input-box"]}
                                      value={option.imgUrl}
                                      style={{
                                        background: `${ques.correctAnswer === option._id ? "#60B84B" : ""}`,
                                        color: `${ques.correctAnswer === option._id ? "white" : "black"}`,
                                      }}
                                      onChange={(e) => handleChange(e.target.value, "optionField", ques._id, option._id)} />
                                  )}

                                  {/* render this input if option type selected is Text & Image URL */}
                                  {ques.optionType === "text-imgUrl" && (
                                    <>
                                      <input
                                        type="text"
                                        placeholder="Text"
                                        className={styles["input-box"]}
                                        value={option.optionTitle}
                                        style={{
                                          background: `${ques.correctAnswer === option._id ? "#60B84B" : ""}`,
                                          color: `${ques.correctAnswer === option._id ? "white" : "black"}`,
                                        }}
                                        onChange={(e) => handleChange(e.target.value, "optionField", ques._id, option._id, "null", "text-field")} />
                                      <input
                                        type="text"
                                        placeholder="Image URL"
                                        className={styles["input-box"]}
                                        value={option.imgUrl}
                                        style={{
                                          background: `${ques.correctAnswer === option._id ? "#60B84B" : ""}`,
                                          color: `${ques.correctAnswer === option._id ? "white" : "black"}`,
                                        }}
                                        onChange={(e) => handleChange(e.target.value, "optionField", ques._id, option._id, "null", "imgUrl-field")} />
                                    </>
                                  )}

                                  {/* only show delete buttons with options if total options are more than 2 and show delete for option 3 and 4 only */}
                                  {ques.options.length >= 3 &&
                                    (optionIndex === 2 || optionIndex === 3) && (
                                      <button onClick={() => handleDeleteOptionBtn(ques._id, option._id)} className={`${styles["delete-btn"]} ${selectedOption === "Text & Image URL" ? styles["delete-btn-img-text"] : ""}`}  >
                                        <img src={img} alt="" />
                                      </button>
                                    )}
                                </div>
                              </React.Fragment>
                            );
                          })}

                          {/* Button for adding more option. Max options can only be 4 */}
                          {ques.options.length <= 3 && (
                            <button
                              className={`${styles["add-btn"]} ${showTimerRow ? styles["add-btn-position-qa"] : styles["add-btn-position-poll"]}`}
                              onClick={() => handleAddOptionBtn(ques._id)}>Add option</button>)}

                          {/* timer option for a particular question */}
                          {showTimerRow && (
                            <div className={styles["timer-row-4"]}>
                              <p>Timer</p>
                              <button onClick={() => handleChange("", "timer", ques._id)} className={ques.timer === "" ? styles["selected-timer-btn"] : ""}>OFF</button>
                              <button onClick={() => handleChange("5", "timer", ques._id)} className={ques.timer === "5" ? styles["selected-timer-btn"] : ""}>
                                5 sec
                              </button>
                              <button onClick={() => handleChange("10", "timer", ques._id)} className={ques.timer === "10" ? styles["selected-timer-btn"] : ""}>
                                10 sec
                              </button>
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    )}
                  </>
                );
              })}
              <div className={styles["poll-row-5"]}>
                <button onClick={() => navigate(`/analytics`)} className={styles["cancel-btn"]}>Cancel</button>
                <button className={styles["del-btn"]} onClick={handleSubmit}>Update Quiz</button>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;
