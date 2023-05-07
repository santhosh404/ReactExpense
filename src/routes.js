import Login from "./Pages/Auth/login";
import Signup from "./Pages/Auth/signup";
import Dashboard from "./Pages/Home/dashboard";
import AddExpense from "./Pages/Home/addExpense";
import ExpenseSummary from "./Pages/Home/summary";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/addexpense", component: <AddExpense /> },
  { path: "/summary", component: <ExpenseSummary /> },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/signup", component: <Signup /> },
];

export { authProtectedRoutes, publicRoutes };
