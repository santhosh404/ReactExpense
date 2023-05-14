import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  TableCaption,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Tfoot,
  Spinner,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { CloseIcon } from "@chakra-ui/icons";

import { groupedExpenses, getParticularExpense } from "../../Services/api";

export default function ExpenseSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const [groupedData, setGroupedData] = useState([]);
  const [particularData, setParticularData] = useState([]);
  const [totalExpense, setTotalExpense] = useState();
  const [expenseDate, setExpenseDate] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const userId = window.localStorage.getItem("UserID");
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    setLoading(true)
    groupedExpenses(userId, token)
      .then((data) => {
        setGroupedData(data);
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

  function handleClick(data) {
    setIsOpen(true);
    setLoading(true)
    console.log(data);
    getParticularExpense(token, userId, data._id)
      .then((response) => {
        setParticularData(response.todayExpense);
        setTotalExpense(response.totalExpense);
        setExpenseDate(data._id);
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
  }

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("UserID");
    navigate("/login");
  }

  return (
    <div>
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

      <Modal isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={{ textAlign: "center" }}>
            Expense summary
          </ModalHeader>
          <ModalBody>
            <TableContainer>
              <Table variant="striped" size="md" className="modalTable">
                <TableCaption>Expense summary of {expenseDate} </TableCaption>
                <Thead>
                  <Tr>
                    <Th>Expense Description</Th>
                    <Th>Expense Amount</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ margin: "10px" }}>
                  {particularData.map((data, i) => {
                    return (
                      <Tr>
                        <Td>{data.expenseName}</Td>
                        <Td>{data.expenseAmount}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>Total</Th>
                    <Th>{totalExpense}</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setIsOpen(false)}
              className="modalCloseButton"
              leftIcon={<CloseIcon />}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Container maxW="1000px" style={{ marginTop: "100px" }}>
        <TableContainer
          style={{
            border: "1px solid lightgray",
            borderRadius: "10px",
            padding: "10px",
            margin: "30px",
          }}
        >
          <Table size="lg">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Expense</Th>
              </Tr>
            </Thead>
            <Tbody>
              {groupedData.map((data, i) => {
                return (
                  <Tr key={i}>
                    <Td onClick={() => handleClick(data)} className="date">
                      {data._id}
                    </Td>
                    <Td>Rs.{data.totalExpense}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
      <ToastContainer />

      <div className="footer">
        <div className="footerItems">
          <Link className="footerIcons" to="/dashboard">
            <i class="fa-solid fa-house"></i> <small> Dashboard </small>{" "}
          </Link>
          <Link className="footerIcons" to="/addexpense">
            <i class="fa-solid fa-plus"></i> <small> Add expense </small>{" "}
          </Link>
          <Link className="footerIcons" to="/summary">
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
