import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "../styles/Dashboard.module.scss";
import Popup from "./Popup";
import { Context } from "../main";
import { server } from "../App";
import toast from 'react-hot-toast';
import axios from 'axios'


const Navbar = () => {
  const [activeBtn, setActiveBtn] = useState("dashboard");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } = useContext(Context);
  const navigate = useNavigate();

  console.log(isAuthenticated)

  const handleButtonClick = (btnName) => {
    setActiveBtn(btnName);
    if (btnName === "createQuiz") {
      setPopupVisible(true);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const logoutHandler = async () => {
    setLoading(true);
    try {
      await axios.get(`${server}/users/logout`, {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
      setIsAuthenticated(false);
      navigate('/')
    } catch (error) {
      // Handle errors if necessary
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles["nav-parent-cont"]}>
      <h1>QUIZZIE</h1>
      <div className={styles["nav-links"]}>
        <Link
          to="/dashboard"
          className={`${styles["nav-btn"]} ${activeBtn === "dashboard" ? styles["active-btn"] : ""
            }`}
          onClick={() => handleButtonClick("dashboard")}
        >
          Dashboard
        </Link>
        <Link
          to="/analytics"
          className={`${styles["nav-btn"]} ${activeBtn === "analytics" ? styles["active-btn"] : ""
            }`}
          onClick={() => handleButtonClick("analytics")}
        >
          Analytics
        </Link>
        <button
          className={`${styles["nav-btn"]} ${activeBtn === "createQuiz" ? styles["active-btn"] : ""
            }`}
          onClick={() => handleButtonClick("createQuiz")}
        >
          Create Quiz
        </button>


        {/* LOGOUT */}
        {
          isAuthenticated ?
            (<div className={styles['logout-div']}>
              <div className={styles['line']}></div>
              <button disabled={loading} onClick={logoutHandler} className='btn'>LOGOUT</button>
            </div>) : (null)
        }
      </div>

      {/* POPUP BUTTON */}
      <div className={styles["cont"]}>
        {isPopupVisible && (
          <Popup onClose={closePopup} isPopupVisible={isPopupVisible} />
        )}
      </div>

    </div>
  );
};

export default Navbar;
