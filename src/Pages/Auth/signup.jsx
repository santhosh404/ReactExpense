import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from '@chakra-ui/react';

import { useNavigate } from "react-router-dom";

import { register } from "../../Services/api";

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const registerFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please enter first name"),
      lastName: Yup.string().required("Please enter last name"),
      email: Yup.string()
        .required("Please enter email")
        .email("Please enter valid email"),
      password: Yup.string().required("Please enter password"),
    }),
    onSubmit: (values) => {
      setLoading(true)
      register(values.firstName, values.lastName, values.email, values.password).then(data => {
        setLoading(false)
        toast.success(data.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
          navigate("/login")
      }).catch(err => {
        console.log(err.message);
        toast.error(err.message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        setLoading(false)
      })
    },
  });
  return (
    <div className="container">
      <div className="registration form">
        <header>Signup</header>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            registerFormik.handleSubmit();
            return false;
          }}
        >
          <input
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            value={registerFormik.values.firstName}
            onChange={registerFormik.handleChange}
            onBlur={registerFormik.handleBlur}
          />
          <div className="errorDiv">
            {registerFormik.touched.firstName &&
              registerFormik.errors.firstName && (
                <p style={{ color: "red", float: "left" }}>
                  {registerFormik.errors.firstName}
                </p>
              )}
          </div>
          <input
            type="text"
            placeholder="Enter your last name"
            id="lastName"
            value={registerFormik.values.lastName}
            onChange={registerFormik.handleChange}
            onBlur={registerFormik.handleBlur}
          />
          <div className="errorDiv">
            {registerFormik.touched.lastName &&
              registerFormik.errors.lastName && (
                <p style={{ color: "red", float: "left" }}>
                  {registerFormik.errors.lastName}
                </p>
              )}
          </div>
          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            value={registerFormik.values.email}
            onChange={registerFormik.handleChange}
            onBlur={registerFormik.handleBlur}
          />
          <div className="errorDiv">
            {registerFormik.touched.email && registerFormik.errors.email && (
              <p style={{ color: "red", float: "left" }}>
                {registerFormik.errors.email}
              </p>
            )}
          </div>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={registerFormik.values.password}
            onChange={registerFormik.handleChange}
            onBlur={registerFormik.handleBlur}
          />
          <div className="errorDiv">
            {registerFormik.touched.password &&
              registerFormik.errors.password && (
                <p style={{ color: "red", float: "left" }}>
                  {registerFormik.errors.password}
                </p>
              )}
          </div>
          <button type="submit" className="button">{loading && <Spinner size="sm" mt={2} mr={2}/>}Signup </button>
        </form>
        <div className="signup">
          <span className="signup">
            Already have an account?&nbsp;
            <Link to="/login">Login</Link>
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
