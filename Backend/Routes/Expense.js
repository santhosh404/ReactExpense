const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const ExpenseSchema = require("../models/ExpenseModel");

//Adding new expense
router.post("/addexpense", authMiddleware, async (req, res) => {
  const { expenseName, expenseDescription, expenseAmount, expenseDate } = req.body;

  try {
    // Get the user ID from the request object (set by the authMiddleware)
    const userId = req.user;

    if(!userId) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    //adding the expense
    await ExpenseSchema.create({
      userId,
      expenseName,
      expenseDescription,
      expenseAmount,
      expenseDate
    });

    res.status(201).json({ message: "Expense added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error occurred" });
  }
});

//Getting particular expense
router.post("/getcurrentexpense/:userId", authMiddleware, async (req, res) => {
    const {userId} = req.params;
    const { date } = req.body;
    const formatedDate = new Date(date).toISOString().slice(0, 10);

    try {

        const todayExpense = await ExpenseSchema.find({userId: userId,expenseDate:formatedDate});

        var totalExpense = 0; 
        for(var i=0;i<todayExpense.length;i++) {
            totalExpense += todayExpense[i].expenseAmount
        }

        res.status(201).json({todayExpense, totalExpense})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ status: "error", message: "Server error occurred" })
    }
})

//Getting today's expense
router.get("/expenses/:userId/today", async (req, res) => {
  const { userId } = req.params;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const todayExpense = await ExpenseSchema.find({ userId, expenseDate: today });
    let totalExpense = 0;
    todayExpense.forEach((expense) => {
      totalExpense += expense.expenseAmount;
    });
    res.status(200).json({ totalExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error occurred" });
  }
});

//grouped by dates
router.get("/expenses/groupbydate/:userId", authMiddleware, async (req, res) => {
  const userId = req.params.userId;

  // var startDate;
  // var endDate;

  // if(new Date().getMonth % 2 == 0) {
  //   startDate = `${new Date().getFullYear}-${new Date().getMonth()}-01`
  //   endDate = `${new Date().getFullYear}-${new Date().getMonth()}-31`
  // }
  // else {
  //   if(new Date().getMonth==1) {
  //     startDate = `${new Date().getFullYear}-${new Date().getMonth()}-01`
  //     endDate = `${new Date().getFullYear}-${new Date().getMonth()}-29`
  //   }
  //   else {
  //     startDate = `${new Date().getFullYear}-${new Date().getMonth()}-01`
  //     endDate = `${new Date().getFullYear}-${new Date().getMonth()}-30`
  //   }
  // }

  try {
    const query = { userId: userId };

    // if (startDate && endDate) {
    //   query.expenseDate = { $gte: new Date(startDate).toISOString().slice(0, 10), $lte: new Date(endDate).toISOString().slice(0, 10) };
    // }

    const result = await ExpenseSchema.aggregate([
      //First stage of filtering by userId
      { $match: query },

      //Second stage of grouping the documents using date and summing the total expense of each grouped date.
      {
        $group: {
          _id: {$dateToString: { format: "%Y-%m-%d", date: "$expenseDate" }},
          totalExpense: { $sum: "$expenseAmount" }
        }
      }
    ]);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error occurred" });
  }
});




function authMiddleware(req, res, next) {
  // Getting the token from authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If the token not found its unauthorized
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Setting the userId in req
    req.user = decoded.id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = router;
