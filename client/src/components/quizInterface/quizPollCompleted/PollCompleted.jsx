import axios from "axios";
import styles from "./PollCompleted.module.scss";
import { server } from "../../../App";
import { useEffect } from "react";
import toast from "react-hot-toast";

const PollCompleted = ({ response, quizId }) => {

  useEffect(() => {
    updateUserResponse();
  }, []);

  const updateUserResponse = async () => {
    try {
      const res = await axios.post(`${server}/quiz/userRes/${quizId}`, response);
      if(res && res?.data?.success) {
        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className={styles["poll-msg-container"]}>
      <h1 className={styles["thanks-msg"]}>
        Thank you for participating in the Poll
      </h1>
    </div>
  );
};

export default PollCompleted;
