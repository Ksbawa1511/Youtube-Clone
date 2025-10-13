import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={1700}
        theme="light"
        className=""
      />
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
