import React, { useState, useEffect } from "react";
import { Container, Spinner } from "@chakra-ui/react";
import Navbar from "./navbar";

import { ToastContainer, toast } from "react-toastify";

import { getUserDetails, getTodayExpense } from "../../Services/api";

export default function Dashboard() {
  const [loggedUser, setLoggedUser] = useState([]);
  const [totalExpense, setTotalExpense] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const userId = window.localStorage.getItem("UserID");
    setLoading(true)
    getTodayExpense(token, userId)
      .then((data) => {
        setTotalExpense(data);
        setLoading(false)
      })
      .catch((err) => {
        console.error(err.message);
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
      });
    setLoading(true)
    getUserDetails(token)
      .then((data) => {
        setLoggedUser(data);
        setLoading(false)
      })
      .catch((err) => {
        console.error(err.message);
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
      });
  }, []);
  return (
    <div>
      <div>
        {loading && (
          <React.Fragment>
            <div className="loading">
              <div className="me-2" style={{marginRight: "10px"}}>
                <Spinner />
              </div>
              <h1 style={{display:"inline"}}> Loading</h1>
            </div>
            <div className="overlay"></div>
          </React.Fragment>
        )}
      </div>
      <Navbar />
      <Container maxW="1000px" style={{ marginTop: "100px" }}>
        <h1 className="greetings">Good Morning, {loggedUser.firstName}</h1>
        <p className="totalExpTxt">Your's total expense for today</p>
        <p className="expense">Rs. {totalExpense.totalExpense}</p>
      </Container>
      <ToastContainer />
    </div>
  );
}
