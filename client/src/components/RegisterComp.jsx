import React from "react";
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
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const { name, email, password } = values; // Destructure values
      const response = await axios.post(
        `${server}/users/new`, { name, email, password }
      );
      toast.success("User Registered Successfully");
    } catch (error) {
      toast.error("Register Failed", error.message);
      console.error("Register failed", error);
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
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            <Field type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" />
            <ErrorMessage name="confirmPassword" component="div" className={styles["error-message"]} />
          </div>

          <button type="submit" className={styles["btn1"]}>Sign-Up</button>
        </Form>
      </Formik>
    </div>
  );
};

export default RegisterComp;



