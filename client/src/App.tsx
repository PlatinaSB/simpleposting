import "./App.css";
import Navbar from "./navbar";
import Login from "./login";
import Register from "./register";
import Home from "./home";
import User from "./user";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

export const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {token && <Route path="/user" element={<User />} />}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

