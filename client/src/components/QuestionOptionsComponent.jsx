// QuestionOptionsComponent.jsx
import React from "react";
import styles from "../styles/Dashboard.module.scss";
import img from "../assets/Delete icon.svg";

const QuestionOptionsComponent = ({
  handleDeleteOption,
  selectedOption,
  inputCount,
  handleOptionChange,
}) => {
  return (
    <div className={styles["poll-row4"]}>
      {[...Array(inputCount)].map((_, index) => (
        <div key={index} className={styles["input-types"]}>
          {selectedOption === "Text" ? (
            <>
              <input type="radio" name="options" />
              <input
                type="text"
                placeholder="Text"
                className={styles["input-box"]}
              />
            </>
          ) : selectedOption === "Image URL" ? (
            <>
              <input type="radio" name="options" />
              <input
                type="text"
                placeholder="Image URL"
                className={styles["input-box"]}
              />
            </>
          ) : selectedOption === "Text & Image URL" ? (
            <div className={styles["img-text"]}>
              <input type="radio" name="options" />
              <input
                type="text"
                placeholder="Text"
                className={styles["input-box"]}
              />
              <input
                type="text"
                placeholder="Image URL"
                className={styles["input-box"]}
              />
            </div>
          ) : null}
          {(index === 2 || index === 3) && (
            <button
              onClick={() => handleDeleteOption(index)}
              className={`${styles["delete-btn"]} ${
                selectedOption === "Text & Image URL"
                  ? styles["delete-btn-img-text"]
                  : ""
              }`}
            >
              <img src={img} alt="" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionOptionsComponent;
