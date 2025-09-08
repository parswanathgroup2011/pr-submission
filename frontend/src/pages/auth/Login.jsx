import React, { useState } from "react";
import {Link,useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, handleSuccess } from "../../utils";
import './Login.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock,faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { loginUser } from '../../services/auth';



function Login() {
  const [loginInfo,setLoginInfo] =useState({
    email:"",
    password:""
  })

  const navigate=useNavigate();
  const handleChange = (e) => {
    const {name,value} =e.target;
    console.log(name,value);

    const copyLoginInfo ={...loginInfo};
    copyLoginInfo[name] =value;
    setLoginInfo(copyLoginInfo)
}

console.log("Login info =>..",loginInfo)

const handleLogin = async (e) => {
  e.preventDefault();
  const { email, password } = loginInfo;

  if (!email || !password) {
    return handleError("Email and password required");
  }

  try {
   const { success, message, token, name, role, error } = await loginUser(loginInfo);

    if (success) {
      handleSuccess(message);
      localStorage.setItem("authToken", token);
      localStorage.setItem("loggedInUser", name);
      localStorage.setItem("userRole",role)
      setTimeout(() => {
        if(role === "admin"){
          navigate("/admin")
        }else{
          navigate("/home")
        }
      },1000)
    } else if (error) {
      const details = error?.details[0]?.message;
      handleError(details);
    } else if (!success) {
      handleError(message);
    }
  } catch (error) {
    handleError(error?.response?.data?.message || "Something went wrong");
  }
};


  return (
    <div className="container">
      <h1 className="login-name">Sign In</h1>
      <h2 className="extra-name">Welcome, We’re happy to see you again. Log in to your account below</h2>
      <form onSubmit={handleLogin}>
        
        <label htmlFor="email">Email</label>
          
        <div className="input-container">
        <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <input
          onChange={handleChange}
          type="email"
          name="email"
          autoFocus
          placeholder="Enter your email"
          value={loginInfo.email}
          />
        </div>

        
        <div>
          <label htmlFor="password">Password</label>
          <div className="input-container">
          <FontAwesomeIcon icon={faLock} className="icon" />
          <input
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="Enter Your password"
          value={loginInfo.password}
          /></div>
        </div>
      <div className="login-button"><button type="submit">Login</button></div>
      <span >
        Forgot password? <Link className="space"  to="/forgot-password"> Forgot Password</Link>
      </span>
      <span> 
        Didn't have an account?<Link className="space" to="/signup"> Signup</Link>
      </span>
      </form>
      
    <ToastContainer />
    </div>
  );
}

export default Login;
