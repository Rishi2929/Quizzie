import React from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Analytics.module.scss";
import EditIcon from "../assets/EditIcon.svg"
import Delete from "../assets/Delete icon.svg"
import ShareIcon from "../assets/ShareIcon.svg"
import { Link } from "react-router-dom";

const Analytics = () => {
  const tableData = [
    { id: 1, quizName: "Introduction to React", createdOn: "2024-01-01", impression: 1200 },
    { id: 2, quizName: "JavaScript Fundamentals", createdOn: "2024-01-02", impression: 1500 },
    { id: 3, quizName: "CSS Mastery", createdOn: "2024-01-03", impression: 800 },
    { id: 4, quizName: "HTML5 Essentials", createdOn: "2024-01-04", impression: 950 },
    { id: 5, quizName: "Node.js Basics", createdOn: "2024-01-05", impression: 1100 },
    { id: 6, quizName: "React Hooks Explained", createdOn: "2024-01-06", impression: 1300 },
    { id: 7, quizName: "Advanced JavaScript Concepts", createdOn: "2024-01-07", impression: 1800 },
    { id: 8, quizName: "Responsive Web Design", createdOn: "2024-01-08", impression: 900 },
    { id: 9, quizName: "MongoDB Basics", createdOn: "2024-01-09", impression: 1000 },
    { id: 10, quizName: "GraphQL Introduction", createdOn: "2024-01-10", impression: 1200 },
    { id: 11, quizName: "Webpack Fundamentals", createdOn: "2024-01-11", impression: 950 },
    { id: 12, quizName: "Docker for Beginners", createdOn: "2024-01-12", impression: 1100 },
    { id: 13, quizName: "TypeScript Crash Course", createdOn: "2024-01-13", impression: 1300 },
    { id: 14, quizName: "Data Structures in JavaScript", createdOn: "2024-01-14", impression: 1500 },
    { id: 15, quizName: "Web Security Best Practices", createdOn: "2024-01-15", impression: 1200 },
    { id: 16, quizName: "AWS Cloud Essentials", createdOn: "2024-01-16", impression: 1800 },
    { id: 17, quizName: "Jest Testing Framework", createdOn: "2024-01-17", impression: 1000 },
    { id: 18, quizName: "React Native Basics", createdOn: "2024-01-18", impression: 1100 },
    { id: 19, quizName: "Python Programming Fundamentals", createdOn: "2024-01-19", impression: 1200 },
    { id: 20, quizName: "Machine Learning Basics", createdOn: "2024-01-20", impression: 1500 },
  ];

  return (
    <div className={styles["analytics-parent-cont"]}>
      <Navbar />
      <div className={styles["analytics-child-cont"]}>
        <div className={styles['quiz-table']}>
          <div className={styles['Analytics-heading']}>
            <h1>Quiz Analysis</h1>
          </div>
          <div className={styles['table-cont']}>
            <table className={styles['table']}>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Quiz Name</th>
                  <th>Created On</th>
                  <th>Impression</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.quizName}</td>
                    <td>{row.createdOn}</td>
                    <td>{row.impression}</td>
                    <td><Link><img src={EditIcon} alt="" /></Link></td>
                    <td><button><img src={Delete} alt="" /></button></td>
                    <td><button><img src={ShareIcon} alt="" /></button></td>
                    <td><Link>Question Wise Analysis</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
