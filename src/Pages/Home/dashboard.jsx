import React, { useState, useEffect } from "react";
import { Container, Spinner, Avatar } from "@chakra-ui/react";
import Navbar from "./navbar";
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

import { getUserDetails, getTodayExpense } from "../../Services/api";

export default function Dashboard() {
  const [loggedUser, setLoggedUser] = useState([]);
  const [totalExpense, setTotalExpense] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const userId = window.localStorage.getItem("UserID");
    setLoading(true);
    getTodayExpense(token, userId)
      .then((data) => {
        setTotalExpense(data);
        setLoading(false);
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
        setLoading(false);
      });
    setLoading(true);
    getUserDetails(token)
      .then((data) => {
        setLoggedUser(data);
        setLoading(false);
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
        setLoading(false);
      });
  }, []);
  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("UserID");
    navigate("/login");
  }
  return (
    <div>
      <div className="design">
        <h1 className="greetings">Hello, {loggedUser.firstName}</h1>
      </div>
      <div className="greetingBox">
        <div className="headlines">
        <p className="totalExpTxt">Your's total expense for today</p>
        <p className="expense">₹{totalExpense.totalExpense}</p>
        </div>
        
      </div>
      <div>
        {loading && (
          <React.Fragment>
            <div className="loading">
              <div className="me-2" style={{ marginRight: "10px" }}>
                <Spinner />
              </div>
              <h1 style={{ display: "inline" }}> Loading</h1>
            </div>
            <div className="overlay"></div>
          </React.Fragment>
        )}
      </div>
      <Navbar />
      <Container
        className="dashboardCont"
        maxW="1000px"
        style={{ marginTop: "100px" }}
      >
        <h1 className="greetings">Good Morning, {loggedUser.firstName}</h1>
        <p className="totalExpTxt">Your's total expense for today</p>
        <p className="expense">Rs. {totalExpense.totalExpense}</p>
      </Container>
      <ToastContainer />

      <div className="footer">
        <div className="footerItems">
          <Link className="footerIcons" to='/dashboard'>
            <i class="fa-solid fa-house"></i> <small> Dashboard </small>{" "}
          </Link>
          <Link className="footerIcons" to='/addexpense'>
            <i class="fa-solid fa-plus"></i> <small> Add expense </small>{" "}
          </Link>
          <Link className="footerIcons" to='/summary'>
            <i class="fa-solid fa-circle-info"></i> <small>Summary</small>{" "}
          </Link>
          <div className="footerIcons" onClick={handleLogout}>
            <i class="fa-solid fa-arrow-right-from-bracket"></i>{" "}
            <small>Logout</small>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
