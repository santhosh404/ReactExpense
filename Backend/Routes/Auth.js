const express = require("express");
const router = express.Router();
const usersSchema = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const encyptedPassword = await bcrypt.hash(password, 10);

  try {
    // Find user by email
    const isOldUser = await usersSchema.findOne({ email });

    // If user is not found, return error response
    if (isOldUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    //If user not found, create new user
    await usersSchema.create({
      firstName,
      lastName,
      email,
      password: encyptedPassword,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error occurred" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await usersSchema.findOne({ email });

    // If user is not found, return error response
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the entered password with the user's password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return error response
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token: token, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/userDetails', authMiddleware, async (req, res) => {
    try {
      // Get the user ID from the request object (set by the authMiddleware)
      const userId = req.user;
  
      // Fetch the user details from the database
      const user = await usersSchema.findById(userId).select('-password');
  
      // If the user is not found, return an error response
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user details in the response
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


function authMiddleware(req, res, next) {

    // Getting the token from authorization header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    
    // If the token not found its unauthorized
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Setting the userId in req
      req.user = decoded.id;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

module.exports = router;
