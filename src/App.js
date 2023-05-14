import "./App.css";
import {authProtectedRoutes, publicRoutes} from "./routes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProtector } from "./AuthProtected";
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((e, i) => (
          <Route path={e.path} key={i} element={e.component} />
        ))}
        {authProtectedRoutes.map((e, i) => (
          <Route
            path={e.path}
            key={i}
            element={<AuthProtector>{e.component}</AuthProtector>}
          />
        ))}
        <Route path="*" element={<Navigate to={"/dashboard"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
