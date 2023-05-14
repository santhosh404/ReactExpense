import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner } from '@chakra-ui/react'

import { login } from "../../Services/api";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const LoginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please enter email ID")
        .email("Please enter valid email"),
      password: Yup.string().required("Please enter password"),
    }),
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const { token, userId } = await login(values.email, values.password);
        localStorage.setItem("token", token);
        localStorage.setItem("UserID", userId);
        setLoading(false)
        navigate('/dashboard')
      } catch (err) {
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
        }
      }
  });

  return (
    <div className="container">
      <div className="login form">
        <header>Login</header>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            LoginFormik.handleSubmit();
            return false;
          }}
        >
          <input
            id="email"
            type="text"
            placeholder="Enter your email"
            value={LoginFormik.values.email}
            onChange={LoginFormik.handleChange}
            onBlur={LoginFormik.handleBlur}
          />

          <div className="errorDiv">
            {LoginFormik.touched.email && LoginFormik.errors.email && (
              <p style={{ color: "red", float: "left" }}>
                {LoginFormik.errors.email}
              </p>
            )}
          </div>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={LoginFormik.values.password}
            onChange={LoginFormik.handleChange}
            onBlur={LoginFormik.handleBlur}
          />

          <div className="errorDiv">
            {LoginFormik.touched.password && LoginFormik.errors.password && (
              <p style={{ color: "red", float: "left" }}>
                {LoginFormik.errors.password}
              </p>
            )}
          </div>
          <div className="loginContainer">
          <button type="submit" className="button">{loading && <Spinner size="sm" mt={2} mr={2}/>}Login </button>
          </div>
        </form>
        <div className="signup">
          <span className="signup">
            Don't have an account?&nbsp;
            <Link to="/signup">Signup</Link>
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
