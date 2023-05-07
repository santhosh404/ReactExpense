import React, { useState } from "react";
import Navbar from "./navbar";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  Input,
  Textarea,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner } from '@chakra-ui/react';
import { ToastContainer, toast } from "react-toastify";

import { addExpense } from "../../Services/api";

export default function AddExpense() {
  const [loading, setLoading] = useState(false)
  const addExpenseFormik = useFormik({
    initialValues: {
      expenseName: "",
      expenseDescription: "",
      expenseAmount: "",
      expenseDate: "",
    },
    validationSchema: Yup.object({
      expenseName: Yup.string().required("Please enter expense name"),
      expenseAmount: Yup.number().required("Please enter expense amount"),
      expenseDate: Yup.date().required("Please enter expense date"),
    }),
    onSubmit: (values) => {
      setLoading(true)
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("UserID");
      addExpense(
        token,
        userId,
        values.expenseName,
        values.expenseDescription,
        values.expenseAmount,
        values.expenseDate
      )
        .then((data) => {
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
          setLoading(false)
        })
        .catch((err) => {
          console.error(err);
          toast.error(err, {
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
        addExpenseFormik.resetForm();
    },
  });
  return (
    <div>
      <Navbar />
      <Container maxW="500px">
        <Card style={{ marginTop: "50px" }}>
          <CardHeader>
            <Heading as="h3" style={{ textAlign: "center"}} className="addExpenseHeader">
              Add Expense
            </Heading>
          </CardHeader>
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addExpenseFormik.handleSubmit();
                return false;
              }}
            >
              <FormControl>
                <Input
                  type="text"
                  placeholder="Expense name"
                  id="expenseName"
                  value={addExpenseFormik.values.expenseName}
                  onChange={addExpenseFormik.handleChange}
                  onBlur={addExpenseFormik.handleBlur}
                />
              </FormControl>
              <div className="errorDiv">
                {addExpenseFormik.touched.expenseName &&
                  addExpenseFormik.errors.expenseName && (
                    <p style={{ color: "red", float: "left" }}>
                      {addExpenseFormik.errors.expenseName}
                    </p>
                  )}
              </div>

              <FormControl mt={4}>
                <Textarea
                  placeholder="Expense Description"
                  id="expenseDescription"
                  value={addExpenseFormik.values.expenseDescription}
                  onChange={addExpenseFormik.handleChange}
                  onBlur={addExpenseFormik.handleBlur}
                />
              </FormControl>

              <FormControl mt={4}>
                <Input
                  type="number"
                  placeholder="Expense Amount"
                  id="expenseAmount"
                  value={addExpenseFormik.values.expenseAmount}
                  onChange={addExpenseFormik.handleChange}
                  onBlur={addExpenseFormik.handleBlur}
                />
              </FormControl>
              <div className="errorDiv">
                {addExpenseFormik.touched.expenseAmount &&
                  addExpenseFormik.errors.expenseAmount && (
                    <p style={{ color: "red", float: "left" }}>
                      {addExpenseFormik.errors.expenseAmount}
                    </p>
                  )}
              </div>

              <FormControl mt={4}>
                <Input
                  type="date"
                  placeholder="Expense Date"
                  id="expenseDate"
                  value={addExpenseFormik.values.expenseDate}
                  onChange={addExpenseFormik.handleChange}
                  onBlur={addExpenseFormik.handleBlur}
                />
              </FormControl>
              <div className="errorDiv">
                {addExpenseFormik.touched.expenseDate &&
                  addExpenseFormik.errors.expenseDate && (
                    <p style={{ color: "red", float: "left" }}>
                      {addExpenseFormik.errors.expenseDate}
                    </p>
                  )}
              </div>
              <Button type="submit" className="expenseButton">
                {loading && <Spinner size="sm" mt={2} mr={2}/>} Add Expense
              </Button>
            </form>
          </CardBody>
        </Card>
      </Container>
      <ToastContainer />
    </div>
  );
}
