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
    email: '',
    password: ''
  }

  const { isAuthenticated, setIsAuthenticated, loading, setLoading } = useContext(Context);

  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const { name, email, password } = values;

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
      setLoading(false);

    } catch (error) {
      toast.error(error.response.message)
      console.error("Login failed", error);
      setIsAuthenticated(false)
      setLoading(false);
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
            <ErrorMessage name="password" component="div" className={styles["error-message"]} />        </div>

          <button disabled={loading} type="submit" className={styles["btn1"]}>
            Log In
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Logincomp;
