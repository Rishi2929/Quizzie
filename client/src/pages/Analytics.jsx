import React from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Analytics.module.scss";

const Analytics = () => {
  return (
    <div className={styles["analytics-parent-cont"]}>
      <Navbar />
      <div className={styles["analytics-child-cont"]}>
        <h1>Quiz Analysis</h1>
      </div>
    </div>
  );
};

export default Analytics;
