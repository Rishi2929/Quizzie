import { useEffect } from "react";
import trophyImg from "../../../assets/trophy.png";
import styles from "./QuizCompleted.module.scss";
import axios from "axios";
import { server } from "../../../App";

const QuizCompleted = ({ response, correctAnswers, quizId }) => {

  useEffect(() => {
    updateUserResponse();
  }, [])

  const updateUserResponse = async () => {
    try {
      console.log("ccccccccccccc")
      const res = await axios.post(`${server}/quiz/userRes/${quizId}`)
    } catch (error) {
      console.error(error);
    }
  }

  let score = 0;
  response?.questions?.forEach((question) => {
    if (
      correctAnswers.some(
        (ansObj) =>
          ansObj.qId === question.qId &&
          ansObj.correctAnswer === question.optionId
      )
    ) {
      score++;
    }
  });

  return (
    <div className={styles["qa-result-container"]}>
      <h1 className={styles["winner-msg"]}>Congrats Quiz is completed</h1>
      <img
        src={trophyImg}
        alt="image of trophy"
        className={styles["trophyImg"]}
      />
      <h1 className={styles["winner-msg"]}>
        Your Score is{" "}
        <span className={styles["score"]}>
          {score}/{response?.questions?.length}
        </span>
      </h1>
    </div>
  );
};

export default QuizCompleted;
