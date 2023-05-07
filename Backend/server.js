require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ExpenseRouter = require("./Routes/Expense");
const AuthRouter = require("./Routes/Auth");
const cors = require("cors");

mongoose.connect(process.env.DATABASE_URL);
// Handling the error and success.
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database Connected!"));

//Using cors
app.use(
  cors({
    origin: "http://localhost:3000", // replace with your frontend URL
    methods: ["GET", "POST"], // specify the allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // specify the allowed headers
  })
);

// Using JSON Data
app.use(express.json());

// Router Config
app.use("/api", ExpenseRouter);
app.use("/api", AuthRouter);

// Starting the server
app.listen(4000, () => console.log("Server Started."));
