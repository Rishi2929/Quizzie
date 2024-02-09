import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from "../styles/Login.module.scss";
import toast from 'react-hot-toast';
import axios from "axios";
import { server } from "../App";

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});


const RegisterComp = () => {
  const [loader, setLoader] = useState(false)
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  // console.log(loading)

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      setLoader(true);
      const { name, email, password } = values; // Destructure values
      const response = await axios.post(
        `${server}/users/new`, { name, email, password }
      );
      toast.success("User Registered Successfully");
    } catch (error) {
      // toast.error("Register Failed", error.response);
      toast.error(error.response.data.message);
      // console.error("Register failed", error);
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
        onSubmit={handleSubmit}
      >
        <Form className={styles["input-cont"]}>
          <div className={styles["input-fields"]}>
            <div className={styles["label-cont"]}>
              <label htmlFor="name">Name</label>
            </div>
            <Field type="text" id="name" name="name" placeholder="Name" />
            <ErrorMessage name="name" component="div" className={styles["error-message"]} />
          </div>

          <div className={styles["input-fields"]}>
            <div className={styles["label-cont"]}>
              <label htmlFor="email">Email</label>
            </div>
            <Field type="email" id="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" className={styles["error-message"]} />
          </div>

          <div className={styles["input-fields"]}>
            <div className={styles["label-cont"]}>
              <label htmlFor="password">Password</label>
            </div>
            <Field type="password" id="password" name="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" className={styles["error-message"]} />
          </div>

          <div className={styles["input-fields"]}>
            <div className={styles["label-cont"]}>
              <label htmlFor="confirmPassword" className={styles["confirm-label"]}>Confirm Password</label>
            </div>
            <Field type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" />
            <ErrorMessage name="confirmPassword" component="div" className={styles["error-message"]} />
          </div>

          <button type="submit" disabled={loader} className={styles["btn1"]}>
            {loader ? (
              "Loading....."
            ) : (
              "Sign-Up"
            )}
          </button>

        </Form>
      </Formik>
    </div>
  );
};

export default RegisterComp;



