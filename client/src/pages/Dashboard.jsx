import React from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Dashboard.module.scss";

const Dashboard = () => {
  return (
    <div className={styles["dashboard-parent-cont"]}>
      <Navbar />
      <div className={styles["dashboard-child-cont"]}>
        <div className={styles["dashboard-flex-cont"]}>
          <div className={styles["dashboard-cont"]}>
            <h1 className={styles["heading-1"]}>
              12 <span>Quiz</span>
            </h1>
            <h1>
              <span>Created</span>
            </h1>
          </div>
          <div className={styles["dashboard-cont"]}>
            <h1 className={styles["heading-2"]}>
              12 <span>questions</span>
            </h1>
            <h1>
              <span>Created</span>
            </h1>
          </div>
          <div className={styles["dashboard-cont"]}>
            <h1 className={styles["heading-3"]}>
              12 <span>Total</span>
            </h1>
            <h1>
              <span>Impressions</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
