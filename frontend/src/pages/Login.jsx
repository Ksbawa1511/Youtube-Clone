import { useDispatch } from "react-redux";
import axios from "axios";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { login } from "../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [isLogIn, setIsLogin] = useState(true);
  const [loginPage, setLoginPage] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const dispatch = useDispatch();
  const heading = useRef(null);

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-deployment-url.com";

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  // ✅ Login handler
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/api/login`, loginData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      // ✅ Fetch user after successful login
      const userRes = await axios.get(`${baseURL}/api/user`, {
        withCredentials: true,
      });
      dispatch(login(userRes.data));

      setLoginPage(false);
      setLoginData({ email: "", password: "" });
      heading.current.innerText = "User Logged in successfully";
      heading.current.style.color = "green";
      toast.success("User Logged in successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Try again.";
      heading.current.innerText = errorMessage;
      heading.current.style.color = "red";
      toast.error(errorMessage);
    }
  }

  // ✅ Sign-up handler
  async function handleSignUp(e) {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/api/register`, signUpData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setSignUpData({ username: "", email: "", password: "", avatar: "" });
      heading.current.innerText = "User Registered successfully";
      heading.current.style.color = "green";
      toast.success("User Registered successfully");

      // Switch to login after short delay
      setTimeout(() => setIsLogin(true), 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed.";
      heading.current.innerText = errorMessage;
      heading.current.style.color = "red";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="flex justify-center mt-17 flex-col items-center">
      <div className="md:w-[40vw] w-[90vw] p-4 text-xs md:text-base bg-gray-100 rounded-xl">
        <h3
          ref={heading}
          className="md:text-2xl text-xl text-black font-bold m-auto text-center mb-2 w-full"
        >
          {isLogIn ? "LogIn" : "SignUp"}
        </h3>

        {isLogIn ? (
          <form className="flex flex-col gap-2 p-2.5" onSubmit={handleLogin}>
            <label htmlFor="email" className="text-md font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder="Enter your email"
              required
              className="outline-none border border-gray-500 px-2.5 py-1 rounded-md font-semibold"
            />

            <label htmlFor="password" className="text-md font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="Enter your password"
              required
              className="outline-none border border-gray-500 px-2.5 py-1 rounded-md font-semibold"
            />

            <div className="flex justify-center gap-2.5 items-center">
              {loginPage ? (
                <button
                  type="submit"
                  className="text-white md:w-63 w-43 py-1 bg-green-700 cursor-pointer mt-2.5 rounded-md outline-none border border-gray-300 hover:bg-green-600"
                >
                  Log in
                </button>
              ) : (
                <Link to="/">
                  <button
                    type="button"
                    className="text-white w-43 py-1 bg-green-700 cursor-pointer mt-2.5 rounded-md outline-none border border-gray-300 hover:bg-green-600"
                  >
                    Go to Home
                  </button>
                </Link>
              )}
              <div
                onClick={() => setIsLogin(false)}
                className="text-blue-700 font-semibold cursor-pointer mt-1.5 hover:text-blue-900 hover:underline"
              >
                Go to SignUp
              </div>
            </div>
          </form>
        ) : (
          <form
            className="flex flex-col gap-2 p-2.5"
            onSubmit={handleSignUp}
            autoComplete="off"
          >
            <label htmlFor="username" className="text-md font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={signUpData.username}
              onChange={handleSignUpChange}
              placeholder="Enter your username"
              required
              className="outline-none border border-gray-500 px-2.5 py-1 rounded-md font-semibold"
            />

            <label htmlFor="email" className="text-md font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={signUpData.email}
              onChange={handleSignUpChange}
              placeholder="Enter your email"
              required
              className="outline-none border border-gray-500 px-2.5 py-1 rounded-md font-semibold"
            />

            <label htmlFor="password" className="text-md font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={signUpData.password}
              onChange={handleSignUpChange}
              placeholder="Enter your password"
              required
              className="outline-none border border-gray-500 px-2.5 py-1 rounded-md font-semibold"
            />

            <label htmlFor="userImage" className="text-md font-semibold text-gray-700">
              User Image
            </label>
            <input
              type="text"
              name="avatar"
              value={signUpData.avatar}
              onChange={handleSignUpChange}
              placeholder="Paste your image URL"
              className="outline-none border border-gray-500 px-2.5 py-1 rounded-md font-semibold"
            />

            <div className="flex justify-center gap-2.5 items-center">
              <button
                type="submit"
                className="text-white md:w-63 w-43 py-1 bg-green-700 cursor-pointer mt-2.5 rounded-md outline-none border border-gray-300 hover:bg-green-600"
              >
                SignUp
              </button>
              <div
                onClick={() => setIsLogin(true)}
                className="text-blue-700 font-semibold cursor-pointer mt-1.5 hover:text-blue-900 hover:underline"
              >
                Go to LogIn
              </div>
            </div>
          </form>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
