import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.scss";
import Popup from "./Popup";
import { Context } from "../main";
import { server } from "../App";
import toast from 'react-hot-toast';
import axios from 'axios';


const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, loading, setLoading, selected, setSelected } = useContext(Context);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = (btnName) => {
    if (btnName === "createQuiz") {
      setPopupVisible(true);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const logoutHandler = () => {
    setSelected(0);
    setLoading(true);
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate('/');
    toast.success("Logged out!");
  };


  return (
    <div className={styles["nav-parent-cont"]}>
      <h1>QUIZZIE</h1>
      <div className={styles["nav-links"]}>
        <Link
          to="/dashboard"
          className={`${styles["nav-btn"]} ${selected === 0 ? styles["active-btn"] : ""
            }`}
          onClick={() => {
            handleButtonClick("dashboard")
            setSelected(0)
          }}
        >
          Dashboard
        </Link>
        <Link
          to="/analytics"
          className={`${styles["nav-btn"]} ${selected === 1 ? styles["active-btn"] : ""
            }`}
          onClick={() => {
            handleButtonClick("analytics")
            setSelected(1)
          }}
        >
          Analytics
        </Link>
        <button
          className={`${styles["nav-btn"]}`}
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
