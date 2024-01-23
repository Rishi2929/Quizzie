import React, { useContext, useState } from "react";
import styles from "../styles/Login.module.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../App";
import { Context } from "../main";
import toast from 'react-hot-toast';


const Logincomp = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } = useContext(Context);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${server}/users/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Logged In successfully")

      setIsAuthenticated(true)
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      setIsAuthenticated(false)

    }
  };
  return (
    <div>
      <form className={styles["input-cont"]} onSubmit={handleLogin}>
        <div className={styles["input-fields"]}>
          <div className={styles["label-cont"]}>
            {" "}
            <label>Email</label>
          </div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className={styles["input-fields"]}>
          <div className={styles["label-cont"]}>
            {" "}
            <label>Password</label>
          </div>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button type="submit" className={styles["btn1"]}>
          Log In
        </button>
      </form>
    </div>
  );
};

export default Logincomp;
