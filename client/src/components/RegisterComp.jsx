import React from "react";
import styles from "../styles/Login.module.scss";

const RegisterComp = () => {
  return (
    <div>
      <form className={styles["input-cont"]}>
        <div className={styles["input-fields"]}>
          <div className={styles["label-cont"]}>
            {" "}
            <label>Name</label>
          </div>
          <input type="text" placeholder="Name" />
        </div>

        <div className={styles["input-fields"]}>
          <div className={styles["label-cont"]}>
            {" "}
            <label>Email</label>
          </div>
          <input type="email" placeholder="Email" />
        </div>

        <div className={styles["input-fields"]}>
          <div className={styles["label-cont"]}>
            {" "}
            <label>Password</label>
          </div>
          <input type="password" placeholder="Password" />
        </div>

        <div className={styles["input-fields"]}>
          <div className={styles["label-cont"]}>
            {" "}
            <label>Confirm Password</label>
          </div>
          <input type="password" placeholder="Confirm Password" />
        </div>

        <button className={styles["btn1"]}>Sign-Up</button>
      </form>
    </div>
  );
};

export default RegisterComp;
