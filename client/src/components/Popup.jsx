import React, { useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import Analytics from "../pages/Analytics";
import Poll from "./Poll";

const Popup = ({ onClose, isPopupVisible }) => {
  const [quizName, setQuizName] = useState("");
  const [selectedQuizType, setSelectedQuizType] = useState("");

  const [continueClicked, setContinueClicked] = useState(false);
  const [error, setError] = useState({
    quizName: false,
    quizType: false,
  });

  // handling quiz name
  const handleChange = (value) => {
    setError({ ...error, quizName: false });
    setQuizName(value);
  };

  // handling quiz type
  const handleTypeButtonClick = (type) => {
    setError({ ...error, quizType: false });
    setSelectedQuizType(type);
  };

  // handling continue button click and setting error to true if any field is empty
  const handleSubmit = () => {
    if (quizName == "" && selectedQuizType == "") {
      setError({ quizName: true, quizType: true });
    } else if (quizName == "") {
      setError({ ...error, quizName: true });
    } else if (selectedQuizType == "") {
      setError({ ...error, quizType: true });
    } else {
      setContinueClicked(true);
    }
  };

  return isPopupVisible ? (
    <div className={styles["popup-parent-cont"]}>
      <div className={styles["popup-child-cont"]}>
        <div className={styles["popup-cont"]}>
          <div>
            <input
              type="text"
              placeholder="Quiz Name"
              className={styles["input-box"]}
              value={quizName}
              onChange={(e) => handleChange(e.target.value)}
            />
            {error.quizName && <p>Quiz name cannot be empty</p>}
          </div>

          <div className={styles["popup-details-row-2"]}>
            <label>Quiz Type</label>
            <button
              className={
                selectedQuizType === "QA" ? styles["selected-button"] : ""
              }
              onClick={() => handleTypeButtonClick("QA")}
            >
              Q & A
            </button>
            <button
              className={
                selectedQuizType === "Poll" ? styles["selected-button"] : "poll-button"
              }
              onClick={() => handleTypeButtonClick("Poll")}
            >
              Poll Type
            </button>
          </div>
          {error.quizType && <p>Please select quiz type</p>}

          <div className={styles["popup-details-row-3"]}>
            <button onClick={onClose} className={styles['cancel-btn']}>Cancel</button>
            <button className={styles["cont-btn"]} onClick={handleSubmit}>
              Continue
            </button>
          </div>
        </div>
      </div>

      {continueClicked && selectedQuizType === "QA" && (
        <Poll
          onClose={onClose}
          quizName={quizName}
          quizType={selectedQuizType}
          showTimerRow={true} // QA have timer option for each question
        />
      )}
      {continueClicked && selectedQuizType === "Poll" && (
        <Poll
          onClose={onClose}
          quizName={quizName}
          quizType={selectedQuizType}
          showTimerRow={false} //Poll don't have timer option for each question
        />
      )}
    </div>
  ) : null;
};

export default Popup;
