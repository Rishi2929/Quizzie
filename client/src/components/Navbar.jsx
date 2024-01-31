import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.scss";
import Popup from "./Popup";
import { Context } from "../main";
import { server } from "../App";
import toast from 'react-hot-toast';
import axios from 'axios';


const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } = useContext(Context);
  const [activeBtn, setActiveBtn] = useState("dashboard");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = (btnName) => {
    setActiveBtn(btnName);
    if (btnName === "createQuiz") {
      setPopupVisible(true);
    }
  };
  console.log("activeBtn: ", activeBtn)

  const closePopup = () => {
    setPopupVisible(false);
  };

  const logoutHandler = () => {
    setLoading(true);
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate('/');
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
          onClick={() => handleButtonClick("analytics")}
          to="/analytics"
          className={`${styles["nav-btn"]} ${activeBtn === "analytics" ? styles["active-btn"] : ""
            }`}
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
              <button onClick={logoutHandler} className='btn'>LOGOUT</button>
            </div>) : (
              null
            )
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
