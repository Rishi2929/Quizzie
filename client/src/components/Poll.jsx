import React, { useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import img from "../assets/Delete icon.svg";
import img2 from "../assets/Quiz Test Vector.png";
import { v4 as uuid } from "uuid";
import { server } from "../App";
import axios from "axios";
import toast from "react-hot-toast";

const Poll = ({ onClose, quizName, quizType, showTimerRow }) => {

  const [initialData, setInitialData] = useState({
    qId: uuid(),
    optionType: "text",
    correctAnswer: "",
    options: [
      {
        id: uuid(),
        imgUrl: "",
        optionTitle: "",
      },
      {
        id: uuid(),
        imgUrl: "",
        optionTitle: "",
      },
    ],
  });

  const [questions, setQuestions] = useState([initialData]);
  const [selectedOption, setSelectedOption] = useState(initialData.qId);

  // Handles clicking on a question
  const handleQuestionClick = (qId) => {
    if (questions.some((ques) => ques.qId == qId)) {
      setSelectedOption(qId);
    }
    console.log("handleQuestionClick: " + qId);
  };

  // Handles adding a question to the quiz
  const handlePlusClick = () => {
    if (questions.length >= 5) return;

    const newObj = { ...initialData };

    newObj.qId = uuid();

    setQuestions((old) => [...old, newObj]);

    setSelectedOption(newObj.qId);
  };

  // Handles deleting a question
  const handleDeleteClick = (e, qId, index) => {
    e.stopPropagation();
    if (questions.some((ques) => ques.qId === qId)) {
      setQuestions((old) => old.filter((ques) => ques.qId !== qId));

      if (qId === selectedOption) {
        setSelectedOption(questions[0].qId);
      }
    }
  };

  // handling change in input fields and for timer buttons also
  const handleChange = (value, field, qId, opId = "null", answerField = "null", textImgTypeFieldName = "null") => {
    if (field === "questionTitle") {
      setQuestions((old) => old.map((ques) => ques.qId === qId ? { ...ques, questionTitle: value } : ques));
    } else if (field === "optionType") {
      const resetOptionsArr = [
        { id: uuid(), imgUrl: "", optionTitle: "", },
        { id: uuid(), imgUrl: "", optionTitle: "", },
      ];
      setQuestions((old) => old.map((ques) => ques.qId === qId ? { ...ques, optionType: value, options: resetOptionsArr } : ques));
    }
    // handling change in option field for different types like: text, imgUrl and text-imgUrl
    else if (field === "optionField") {
      if (answerField === "answer") {
        setQuestions((old) => old.map((ques) => ques.qId === qId ? { ...ques, correctAnswer: value } : ques));
        return;
      }

      const selectedQuestion = questions.find(
        (question) => question.qId === qId
      );

      let selectedOptions = [...selectedQuestion.options];

      if (selectedQuestion.optionType === "text") {
        console.log("text option selected");
        selectedOptions = selectedOptions.map((option) =>
          option.id === opId ? { ...option, optionTitle: value } : option
        );
      } else if (selectedQuestion.optionType === "imgUrl") {
        console.log("imgUrl option selected");
        selectedOptions = selectedOptions.map((option) =>
          option.id === opId ? { ...option, imgUrl: value } : option
        );
      } else if (selectedQuestion.optionType === "text-imgUrl") {
        console.log("text-imgUrl option selected");
        if (textImgTypeFieldName === "text-field") {
          selectedOptions = selectedOptions.map((option) =>
            option.id === opId ? { ...option, optionTitle: value } : option
          );
        } else if (textImgTypeFieldName === "imgUrl-field") {
          console.log("imgUrl-field");
          selectedOptions = selectedOptions.map((option) =>
            option.id === opId ? { ...option, imgUrl: value } : option
          );
        }
      }
      setQuestions((old) => old.map((ques) => ques.qId === qId ? { ...ques, options: selectedOptions } : ques));
    } else if (field === "timer") {
      setQuestions((old) => old.map((ques) => (ques.qId === qId ? { ...ques, timer: value } : ques)));
    }
  };

  // Handles adding an option to a question
  const handleAddOptionBtn = (qId) => {
    const optionObj = { id: uuid(), imgUrl: "", optionTitle: "" };

    if (questions.some((question) => question.qId === qId)) {
      const selectedQuestion = questions.find((ques) => ques.qId === qId);

      if (selectedQuestion.options.length >= 4) return; // we can't add more than 4 options per question

      const quesOptions = [...selectedQuestion.options, optionObj];

      setQuestions((old) => old.map((ques) => ques.qId === qId ? { ...ques, options: quesOptions } : ques));
    }
  };

  // Handles deleting an option from a question
  const handleDeleteOptionBtn = (qId, opId) => {
    const selectionQuestion = questions.find((ques) => ques.qId === qId);
    const questionOptions = [...selectionQuestion.options.filter((opt) => opt.id !== opId)];

    setQuestions((old) =>
      old.map((ques) => ques.qId === qId ? { ...ques, options: questionOptions } : ques));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { quizName: quizName, quizType: quizType, questions: questions, };
    // console.log(data);
    try {
      const response = await axios.post(`${server}/quiz/new`, data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // console.log(response.data); 
      toast.success("Quiz created successfully");

    } catch (error) {
      console.error("handleSubmit Error:", error);
      toast.error("Quiz failed to create");
    }
  };

  return (
    <div className={styles["popup-parent-cont"]}>
      <div className={styles["popup-child-cont"]}>
        <div className={styles["poll-cont"]}>
          <div className={styles["poll-row1"]}>
            {questions.map((ques, index) => {
              return (
                <React.Fragment key={ques.qId}>
                  <div onClick={() => handleQuestionClick(ques.qId)}>
                    <div key={index} className={`${styles.circle} ${selectedOption === ques.qId ? styles["circle-selected"] : ""}`}>
                      <p>{index + 1}</p>
                    </div>

                    {index > 0 && (
                      <button onClick={(e) => handleDeleteClick(e, ques.qId, index)} className={styles["del-circle-btn"]}>
                        <img src={img2} alt="" />
                      </button>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
            <button onClick={() => handlePlusClick()} className={styles["add-circle-btn"]}> + </button>

            <div className={styles["remind"]}>
              <p>Max 5 questions</p>
            </div>
          </div>

          {questions?.map((ques, index) => {
            return (
              <>
                {/* rendering only 1 selected question from array of questions */}
                {selectedOption === ques.qId && (
                  <React.Fragment key={ques.qId}>
                    {/* for question title */}
                    <div className={styles["poll-row2"]}>
                      <input placeholder="Poll Question" onChange={(e) => handleChange(e.target.value, "questionTitle", ques.qId)} value={ques.questionTitle} />
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
                          onChange={(e) => handleChange(e.target.value, "optionType", ques.qId)} />
                        Text
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="imgUrl"
                          name="optionType"
                          checked={ques.optionType === "imgUrl"}
                          onChange={(e) => handleChange(e.target.value, "optionType", ques.qId)} />
                        Image URL
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="optionType"
                          value="text-imgUrl"
                          checked={ques.optionType === "text-imgUrl"}
                          onChange={(e) => handleChange(e.target.value, "optionType", ques.qId)} />
                        Text & Image URL
                      </label>
                    </div>

                    {/* rendering the options array which is stored in questions array */}
                    <div className={styles["poll-row4"]}>
                      {ques.options?.map((option, optionIndex) => {
                        return (
                          <React.Fragment key={option.id}>
                            {/* this radio button used to select the answer if quiz is QA type. If quiz if poll type then we don't show this button */}
                            <div className={styles["input-types"]}>
                              {quizType === "QA" && (
                                <input
                                  type="radio"
                                  name="options"
                                  value={option.id}
                                  checked={ques.correctAnswer === option.id}
                                  className="input-radio"
                                  style={{ accentColor: `${ques.correctAnswer === option.id ? "green" : ""}`, }}
                                  onChange={(e) => handleChange(e.target.value, "optionField", ques.qId, option.id, "answer")} />
                              )}
                              {/* render this input if option type selected is text */}
                              {ques.optionType === "text" && (
                                <input
                                  type="text"
                                  placeholder="Text"
                                  className={styles["input-box"]}
                                  value={option.optionTitle}
                                  style={{ background: `${ques.correctAnswer === option.id ? "#60B84B" : ""}`, }}
                                  onChange={(e) => handleChange(e.target.value, "optionField", ques.qId, option.id)} />
                              )}

                              {/* render this input if option type selected is image Url */}
                              {ques.optionType === "imgUrl" && (
                                <input
                                  type="text"
                                  placeholder="Image URL"
                                  className={styles["input-box"]}
                                  value={option.imgUrl}
                                  style={{ background: `${ques.correctAnswer === option.id ? "green" : ""}`, }}
                                  onChange={(e) => handleChange(e.target.value, "optionField", ques.qId, option.id)} />
                              )}

                              {/* render this input if option type selected is Text & Image URL */}
                              {ques.optionType === "text-imgUrl" && (
                                <>
                                  <input
                                    type="text"
                                    placeholder="Text"
                                    className={styles["input-box"]}
                                    value={option.optionTitle}
                                    style={{ background: `${ques.correctAnswer === option.id ? "green" : ""}`, }}
                                    onChange={(e) => handleChange(e.target.value, "optionField", ques.qId, option.id, "null", "text-field")} />
                                  <input
                                    type="text"
                                    placeholder="Image URL"
                                    className={styles["input-box"]}
                                    value={option.imgUrl}
                                    style={{ background: `${ques.correctAnswer === option.id ? "green" : ""}`, }} onChange={(e) => handleChange(e.target.value, "optionField", ques.qId, option.id, "null", "imgUrl-field")} />
                                </>
                              )}

                              {/* only show delete buttons with options if total options are more than 2 and show delete for option 3 and 4 only */}
                              {ques.options.length >= 3 &&
                                (optionIndex === 2 || optionIndex === 3) && (
                                  <button onClick={() => handleDeleteOptionBtn(ques.qId, option.id)} className={`${styles["delete-btn"]} ${selectedOption === "Text & Image URL" ? styles["delete-btn-img-text"] : ""}`}  >
                                    <img src={img} alt="" />
                                  </button>
                                )}
                            </div>
                          </React.Fragment>
                        );
                      })}

                      {/* Button for adding more option. Max options can only be 4 */}
                      {ques.options.length <= 3 && (
                        <button className={styles["add-btn"]} onClick={() => handleAddOptionBtn(ques.qId)}>Add option</button>
                      )}

                      {/* timer option for a particular question */}
                      {showTimerRow && (
                        <div className={styles["timer-row-4"]}>
                          <p>Timer</p>
                          <button onClick={() => handleChange("null", "timer", ques.qId)} className={ques.timer === "null" ? styles["selected-timer-btn"] : ""}>OFF</button>
                          <button onClick={() => handleChange("5", "timer", ques.qId)} className={ques.timer === "5" ? styles["selected-timer-btn"] : ""}>
                            5 sec
                          </button>
                          <button onClick={() => handleChange("10", "timer", ques.qId)} className={ques.timer === "10" ? styles["selected-timer-btn"] : ""}>
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
            <button onClick={onClose} className={styles["cancel-btn"]}>Cancel</button>
            <button className={styles["del-btn"]} onClick={handleSubmit}>Create Quiz</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poll;
