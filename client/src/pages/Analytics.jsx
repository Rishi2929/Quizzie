import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import styles from "../styles/Analytics.module.scss";
import EditIcon from "../assets/EditIcon.svg";
import Delete from "../assets/Delete icon.svg";
import ShareIcon from "../assets/ShareIcon.svg";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../App";
import toast from "react-hot-toast";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Context } from "../main";

const Analytics = () => {
  const { setUser, setIsAuthenticated, setLoading, tableData, setTableData } = useContext(Context);
  const navigate = useNavigate();
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleDeletePopup = (id) => {
    setSelectedItemId(id);
    setDeletePopup(true);
    // console.log(id)

  }

  const handleDelete = async (id) => {
    try {
      console.log(id)
      const token = localStorage.getItem('token');
      await axios.delete(`${server}/quiz/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      setTableData(tableData.filter(item => item._id !== id));
      setDeletePopup(false);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleQuestionAnalysis = (id) => {
    navigate(`/ques-analysis/${id}`);
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
                    <td><button onClick={() => handleDeletePopup(row._id)} ><img src={Delete} alt="" /></button></td>
                    {/* {console.log(row._id)} */}



                    <td>
                      <CopyToClipboard text={`${window.location.origin}/quiz/${row._id}`}
                        onCopy={() => toast.success("Link copied successfully")}>
                        <button>
                          <img src={ShareIcon} alt="Share" />
                        </button>
                      </CopyToClipboard>
                    </td>
                    <td><button onClick={() => handleQuestionAnalysis(row._id)}>Question Wise Analysis</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {deletePopup && (
        <div className={styles["delete-parent-popup"]}>
          <div className={styles["delete-popup"]}>
            <p>Are you sure you<br /> want to delete this item?</p>
            <div className={styles["flex-btn"]}>
              <button onClick={() => handleDelete(selectedItemId)} className={styles["confirm-btn"]}>Confirm Delete</button>
              <button onClick={() => setDeletePopup(false)} className={styles["cancel-btn"]}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
