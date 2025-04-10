import React, { useEffect, useState } from "react";
import { emailIdRegex, phoneNoRegex, passwordRegex } from "./Regexes";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import API_URL from "../config";

function login() {
  const defaultInputValues = {
    EmailIDOrPhoneNo: "",
    Password: ""
  }
  const defaultInputValuesErr = {
    EmailIDOrPhoneNo: false,
    Password: false
  }

  const [inputValues, setInputValues] = useState(defaultInputValues);
  const [inputValuesErr, setInputValuesErr] = useState(defaultInputValuesErr)
  const showErrorInBorder = "border-red-700";
  const unShowErrorInBorder = "border-slate-950";
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 400); // Changes every 400ms

    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const inputValueHandler = (e) => {
    const { name, value } = e.target;
    setInputValuesErr(defaultInputValuesErr)
    setInputValues({
      ...inputValues,
      [name]: value
    })
  }

  const passwordVisibilityHandler = () => {
    { passwordVisibility ? setPasswordVisibility(false) : setPasswordVisibility(true) }
  }

  const onSubmitValidation = () => {
    if (!emailIdRegex.test(inputValues.EmailIDOrPhoneNo) && !phoneNoRegex.test(inputValues.EmailIDOrPhoneNo)) {
      setInputValuesErr((prev) => ({ ...prev, EmailIDOrPhoneNo: true }))
      return
    }
console.log("api-------------------",API_URL)
    setLoading(true);
    axios.post(`${API_URL}/Login`, inputValues)
      .then(result => {
        console.log(result)
        if (result.data.success) {
          setTimeout(() => toast.success("Successfully LogIn!"), 50);
          const userData = JSON.stringify(result.data.user);
          sessionStorage.setItem("userLoggedData", userData);
          navigate("/DashBoard/contact");
          setLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
        const errMessage = err.response.data.message;
        setErrorMessage(errMessage)
        if (errMessage === "No record existed") {
          setInputValuesErr((prev) => ({ ...prev, EmailIDOrPhoneNo: true }));
          return
        }
        if (errMessage === "Password is incorrect!") {
          setInputValuesErr((prev) => ({ ...prev, Password: true }));
          return
        }
      })
      .finally(() => {
        setLoading(false);
      })
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-screen mx-auto w-full px-2 sm:px-0">
      <div>
        <ToastContainer
          stacked
          position="top-right"
          autoClose={2000}
          // hideProgressBar
          newestOnTop={false}
          closeOnClick={true}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>

      <div
        className="
        w-full
        max-w-md
        text-white 
        bg-slate-800 
        py-9 px-2 sm:px-7
        rounded-2xl 
        items-center 
        text-center 
        border border-slate-700
        drop-shadow shadow-lg shadow-slate-900
        hover:shadow-slate-950 hover:shadow-[rgba(0,0,10,0.5)_1px_1px_90px_1px]
        duration-500"
      >
        <div className="flex items-center justify-center mx-auto mb-6 space-x-1">
          {/* Login Form Title */}
          <div className="text-left">
            <h1 className="font-bold text-lg text-slate-300">Welcome back to </h1>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center bg-gray-700 rounded-xl p-1 px-2 font-medium text-slate-200 text-lg shadow-slate-500 drop-shadow shadow-[rgba(0,0,10,0.5)_1px_1px_5px_1px]">
            {/* <h1 className="select-none font-bold ">M</h1>
            <p className="select-none text-base italic">y</p> */}
            <h1 className="select-none font-bold">C</h1>
            <p className="select-none italic">hat</p>
            <h1 className="select-none font-bold">MX</h1>
          </div>
        </div>

        {/* Email / Phone Input */}
        <div className="w-full mb-3">
          <div className={`flex px-2 bg-slate-950 rounded-md drop-shadow shadow-sm hover:shadow-slate-300 duration-300 border-2 ${inputValuesErr.EmailIDOrPhoneNo ? showErrorInBorder : unShowErrorInBorder}`}>
            <div className="flex items-center justify-center ml-1">
              <div className="flex text-xl items-center justify-center border-r border-slate-400 h-7 pr-2">
                <CiMail />
              </div>
            </div>
            <input
              type="email"
              placeholder="Email ID or Phone Number"
              name="EmailIDOrPhoneNo"
              value={inputValues.EmailIDOrPhoneNo}
              onChange={inputValueHandler}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSubmitValidation();
                }
              }}
              className="flex-1 font-normal text-base bg-slate-950 py-1.5 px-3 rounded-md outline-none"
            />
          </div>
          {inputValuesErr.EmailIDOrPhoneNo && <p className="text-red-600 mt-1 text-sm">{inputValues.EmailIDOrPhoneNo === "" ? "Enter Your Email ID" : errorMessage || "Your Email ID is Invalid"}</p>}
        </div>

        {/* Password Input */}
        <div className="w-full">
          <div className={`flex px-2 bg-slate-950 rounded-md drop-shadow shadow-sm hover:shadow-slate-300 duration-300 border-2 ${inputValuesErr.Password ? showErrorInBorder : unShowErrorInBorder}`}>
            <div className="flex items-center justify-center ml-1">
              <div className="flex text-xl items-center justify-center border-r border-slate-400 h-7 pr-2">
                <CiLock />
              </div>
            </div>
            <input
              type={passwordVisibility ? "text" : "password"}
              maxLength={16}
              placeholder="Password"
              name="Password"
              value={inputValues.Password}
              onChange={inputValueHandler}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSubmitValidation();
                }
              }}
              className="flex-1 font-normal text-base bg-slate-950 py-1.5 px-3 rounded-md outline-none"
            />
            <div className="cursor-pointer w-10 flex items-center justify-center" onClick={passwordVisibilityHandler}>
              {passwordVisibility ? <IoMdEyeOff /> : <IoEye />}
            </div>
          </div>
          {inputValuesErr.Password && <p className="text-red-600 mt-1 text-sm">{inputValues.Password === "" ? "Enter a Password" : errorMessage}</p>}
        </div>

        {/* Links */}
        <div className="text-base text-right mb-1 mr-2">
          <Link to="/ForgotPassword" className="text-slate-400 hover:text-blue-600 duration-300">Forgot Password?</Link>
        </div>

        {/* Submit Button */}
        <div className="text-center items-center my-4">
          <button
            type="submit"
            onClick={onSubmitValidation}
            className="font-bold text-slate-300 bg-blue-700 hover:text-slate-200 hover:bg-blue-800 duration-300 py-2 w-4/5 rounded-lg"
          >
            {loading ? `Loading${dots}` : "Submit"}
          </button>
        </div>

        <div className="text-sm text-center text-slate-300">
          Don"t have an account?&nbsp;
          <Link
            to="/registration"
            className="text-base text-blue-600 hover:text-blue-700 hover:underline duration-300"
          >
            Sign Up!
          </Link>
        </div>
      </div>
    </div>
  )
}

export default login