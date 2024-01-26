import styles from "./PollCompleted.module.scss";

const PollCompleted = () => {
  return (
    <div className={styles["poll-msg-container"]}>
      <h1 className={styles["thanks-msg"]}>
        Thank you for participating in the Poll
      </h1>
    </div>
  );
};

export default PollCompleted;
