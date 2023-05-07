const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type:String,
    required:true
  },
  expenseName: {
    type: String,
    required: true
  },
  expenseDescription: {
    type: String,
  },
  expenseAmount: {
    type:Number,
    require: true
  },
  expenseDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const ExpenseSchema = mongoose.model('ExpenseSchema', expenseSchema);

module.exports = ExpenseSchema;