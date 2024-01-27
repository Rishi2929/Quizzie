import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import styles from "../styles/Analytics.module.scss";
import EditIcon from "../assets/EditIcon.svg";
import Delete from "../assets/Delete icon.svg";
import ShareIcon from "../assets/ShareIcon.svg";
import { Link } from "react-router-dom";
import { server } from "../App";

const Analytics = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${server}/quiz/myQuiz`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        setTableData(response.data.quiz);
        // console.log(response.data.quiz);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [tableData]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`${server}/quiz/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      // Filter out the deleted item from the table data
      setTableData(tableData.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };



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
                {tableData.map((row, index) => (
                  <tr key={row._id}>
                    <td>{index + 1}</td>
                    <td>{row.quizName}</td>
                    <td>{row.createdOn}</td>
                    <td>{row.impression}</td>
                    <td><Link><img src={EditIcon} alt="" /></Link></td>
                    <td><button onClick={() => handleDelete(row._id)}><img src={Delete} alt="" /></button></td>
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
