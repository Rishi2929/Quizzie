import React, { useContext, useState } from "react";
import styles from "../styles/Login.module.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../App";
import { Context } from "../main";
import toast from 'react-hot-toast';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required'),
})

const Logincomp = () => {
  const initialValues = {
    email: '', password: ''
  }

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [loader, setLoader] = useState(false)

  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoader(true)
    try {
      const { name, email, password } = values;
      const response = await axios.post(`${server}/users/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate("/dashboard");
      toast.success("Logged In successfully")
      setIsAuthenticated(true)
    } catch (error) {
      toast.error(error.response.data.message)
      console.error("Login failed", error);
      setIsAuthenticated(false)
    }
    finally {
      setLoader(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}>
        <Form className={styles["input-cont"]}>
          <div className={styles["input-fields"]}>
            <div className={styles["label-cont"]}>
              {" "}
              <label>Email</label>
            </div>
            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" className={styles["error-message"]} />

          </div>

          <div className={styles["input-fields"]}>
            <div className={styles["label-cont"]}>
              {" "}
              <label>Password</label>
            </div>
            <Field type="password" id="password" name="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" className={styles["error-message"]} />
          </div>

          <button type="submit" disabled={loader} className={styles["btn1"]}>
            Log In
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Logincomp;
