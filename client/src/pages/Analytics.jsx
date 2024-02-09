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
import CustomLoader from "../components/CurstomLoader";
import moment from 'moment';
import numeral from 'numeral';



const Analytics = () => {
  const { setUser, setIsAuthenticated, setLoading, loading } = useContext(Context);
  const navigate = useNavigate();
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleDeletePopup = (id) => {
    setSelectedItemId(id);
    setDeletePopup(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${server}/quiz/myQuiz`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setTableData(response.data.quiz);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
      finally {
        setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`${server}/quiz/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      setTableData(tableData.filter(item => item._id !== id));
      setDeletePopup(false);
      toast.success("Quiz deleted successfully")
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
      {loading ? (
        <CustomLoader />
      ) : (
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
                      <td>{moment(row.createdAt).format('DD MMM, YYYY')}</td>
                      <td>{numeral(row.quizCount).format('0.0a')}</td>
                      {/* {row.quizCount} */}
                      <td><Link to={`/editQuiz/${row._id}`} ><img src={EditIcon} alt="" /></Link></td>
                      <td><button onClick={() => handleDeletePopup(row._id)} ><img src={Delete} alt="" /></button></td>

                      <td>
                        <CopyToClipboard text={`${window.location.origin}/quiz/${row._id}`}
                          onCopy={() => toast.success("Link copied successfully")}>
                          <button>
                            <img src={ShareIcon} alt="Share" />
                          </button>
                        </CopyToClipboard>
                      </td>
                      <td><button onClick={() => handleQuestionAnalysis(row._id)} className={styles["btn-ques-anlys"]}>Question Wise Analysis</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {deletePopup && (
        <div className={styles["delete-parent-popup"]}>
          <div className={styles["delete-popup"]}>
            <p>Are you sure you<br /> want to delete this item?</p>
            <div className={styles["flex-btn"]}>
              <button onClick={() => handleDelete(selectedItemId)} className={styles["confirm-btn"]} >Confirm Delete</button>
              <button onClick={() => setDeletePopup(false)} className={styles["cancel-btn"]}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
