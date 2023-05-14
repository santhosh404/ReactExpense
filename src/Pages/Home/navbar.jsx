import React, { useState, useEffect } from "react";
import {
  Flex,
  Spacer,
  ButtonGroup,
  Avatar,
  Image,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { getUserDetails } from "../../Services/api";

export default function Navbar() {
  const [loggedUser, setLoggedUser] = useState([]);

  const navigate = useNavigate();

  function handleLogout() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("UserID");
    navigate("/login");
  }

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    getUserDetails(token)
      .then((data) => {
        setLoggedUser(data);
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
      });
  }, []);

  return (
    <div>
      <Flex
        minWidth="max-content"
        alignItems="end"
        gap="2"
        style={{ margin: "20px" }}
        className="navbar"
      >
        <Box mr={2}>
          <Link to="/dashboard">
            <Heading className="dashboradHeading">DashBoard</Heading>
          </Link>
        </Box>
        <Spacer />
        <Box mr={2}>
          <Link to="/addexpense">
            <Button className="addExpense">Add Expense</Button>
          </Link>
        </Box>
        <Box mr={2}>
          <Link to="/summary">
            <Button className="summary">Summary</Button>
          </Link>
        </Box>
        <ButtonGroup gap="2">
          <Menu>
            <MenuButton>
              <Avatar name={`${loggedUser.firstName} ${loggedUser.lastName}`} />
            </MenuButton>
            <MenuList minW="30px" style={{ padding: "10px" }}>
              <Text style={{textAlign:'center', margin:"10px", fontWeight: "bold"}}>
                {loggedUser.firstName} {loggedUser.lastName}
              </Text>
              <MenuItem className="menuItem" onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
      </Flex>
      <ToastContainer />
    </div>
  );
}
