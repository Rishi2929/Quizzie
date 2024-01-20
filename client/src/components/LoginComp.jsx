import React from "react";
import styles from "../styles/Login.module.scss";
import { useNavigate } from "react-router-dom";

const Logincomp = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("first");
    navigate("/dashboard");
  };
  return (
    <div>
      <form className={styles["input-cont"]} onSubmit={handleLogin}>
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

        <button type="submit" className={styles["btn1"]}>
          Log In
        </button>
      </form>
    </div>
  );
};

export default Logincomp;
