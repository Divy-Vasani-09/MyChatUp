import React, { useState } from "react";
import { userNameRegex, emailIdRegex, phoneNoRegex, passwordRegex } from "./Regexes";
import { CiUser } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { CiLock } from "react-icons/ci";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import logo from "C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/newLogo.jpg";
import axios from "axios";
import API_URL from "../config";

function registration() {

    const defaultInputValues = {
        UserName: "",
        EmailID: "",
        PhoneNo: "",
        Password: "",
        ConfirmPassword: ""
    }
    const defaultInputValuesErr = {
        UserName: false,
        EmailID: false,
        PhoneNo: false,
        Password: false,
        ConfirmPassword: false
    }

    const [inputValues, setInputValues] = useState(defaultInputValues);
    const [inputValuesErr, setInputValuesErr] = useState(defaultInputValuesErr);
    const showErrorInBorder = "border-red-700";
    const unShowErrorInBorder = "border-slate-950";
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const onSubmitValidation = async () => {
        if (!userNameRegex.test(inputValues.UserName)) {
            setInputValuesErr((prev) => ({ ...prev, UserName: true }))
            return
        }
        if (!emailIdRegex.test(inputValues.EmailID)) {
            setInputValuesErr((prev) => ({ ...prev, EmailID: true }))
            return
        }
        if (!phoneNoRegex.test(inputValues.PhoneNo)) {
            setInputValuesErr((prev) => ({ ...prev, PhoneNo: true }))
            return
        }
        if (!passwordRegex.test(inputValues.Password)) {
            setInputValuesErr((prev) => ({ ...prev, Password: true }))
            return
        }
        if (inputValues.Password !== inputValues.ConfirmPassword) {
            console.log(inputValues.Password, inputValues.ConfirmPassword)
            setInputValuesErr((prev) => ({ ...prev, ConfirmPassword: true }))
            return
        }

        setLoading(true);
        axios.post(`${API_URL}/Registration`, inputValues)
            .then(result => {
                console.log(result)
                setTimeout(() => toast.success("Successfully Registered!"), 50);
                navigate("/Login");

                setLoading(false)
            })
            .catch(err => {
                toast.error(err.response.data.message);
                console.log(err)
            })

        setInputValues(defaultInputValues);
        setInputValuesErr(defaultInputValuesErr);
    }
    return (
        <div className="flex flex-col justify-center items-center min-h-screen mx-auto w-full px-2 sm:px-0">
            <div>
                <ToastContainer
                    stacked
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar
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
                sm:max-h-full
                text-white 
                bg-slate-800 
                py-9 px-2 sm:px-11
                rounded-2xl 
                flex flex-col items-center 
                text-center 
                border border-slate-700
                drop-shadow shadow-lg shadow-slate-900
                hover:shadow-slate-950 hover:shadow-[rgba(0,0,10,0.5)_1px_1px_90px_1px]
                duration-500"
            >
                {/* Header */}
                {/* <div className="w-full">
                    <div className="w-28 flex bg-gray-700 rounded-xl p-1 px-2 font-medium text-slate-200 text-lg shadow-slate-500 drop-shadow shadow-[rgba(0,0,10,0.5)_1px_1px_5px_1px]">
                        <h1 className="select-none font-bold">M</h1>
                        <p className="select-none text-base italic">y</p>
                        <h1 className="select-none font-bold">C</h1>
                        <p className="select-none italic">hat</p>
                        <h1 className="select-none font-bold">MX</h1>
                    </div>
                    <div className=" w-full">
                        <h1 className="mb-4 text-left font-bold text-lg">
                            Create new account
                        </h1>
                    </div>
                </div> */}
                <div className="flex items-center justify-center mx-auto mb-1 space-x-1">

                    {/* Logo */}
                    <div className="flex items-center justify-center bg-gray-00 rounded-xl p-1 px-2 font-medium text-slate-200 text-lg shadow-slate-800 drop-shadow shadow-[rgba(0,0,10,0.5)_1px_1px_5px_1px]">
                        {/* <h1 className="select-none font-bold ">M</h1>
                        <p className="select-none text-base italic">y</p> */}
                        {/* <h1 className="select-none font-bold">C</h1>
                        <p className="select-none italic">hat</p>
                        <h1 className="select-none font-bold">MX</h1> */}
                        <img src={logo} alt="" className="w-[65px] h-[65px] rounded-xl"/>
                    </div>
                </div>
                <div className="flex items-center justify-center mx-auto mb-6 space-x-1">
                    {/* registration Form Title */}
                    <div className="text-left">
                        <h1 className="font-bold text-xl text-slate-300">
                            Create new account
                        </h1>
                    </div>

                    {/* Logo */}
                    <div className="flex items-center justify-center bg-gray-700 rounded-xl p-1 px-2 font-medium text-slate-200 text-lg shadow-slate-500 drop-shadow shadow-[rgba(0,0,10,0.5)_1px_1px_5px_1px]">
                        {/* <h1 className="select-none font-bold ">M</h1>
                        <p className="select-none text-base italic">y</p> */}
                        {/* <h1 className="select-none font-bold">C</h1>
                        <p className="select-none italic">hat</p>
                        <h1 className="select-none font-bold">MX</h1> */}
                        {/* <img src={logo} alt="" className="w-[65px] h-[65px] rounded-xl"/> */}
                    </div>
                </div>

                {/* Fields */}
                <div className="w-full space-y-3">

                    {/* Username */}
                    <div className="w-full mb-4">
                        <div className={`flex px-2 bg-slate-950 rounded-md drop-shadow shadow-sm hover:shadow-slate-300 duration-300 border-2 ${inputValuesErr.UserName ? showErrorInBorder : unShowErrorInBorder}`}>
                            <div className="flex items-center justify-center ml-1">
                                <div className="flex text-xl items-center justify-center border-r border-slate-400 h-7 pr-2">
                                    <CiUser />
                                </div>
                            </div>
                            <input
                                type="text"
                                maxLength={20}
                                placeholder="User Name"
                                name="UserName"
                                value={inputValues.UserName}
                                onChange={inputValueHandler}
                                className="flex-1 font-normal text-base bg-slate-950 py-1.5 px-3 rounded-md outline-none"
                            />
                        </div>
                        {inputValuesErr.UserName && <p className="text-red-600 text-sm">{inputValues.UserName === "" ? "Enter Your User Name" : "Your UserName is inValid"}</p>}
                    </div>

                    {/* Email */}
                    <div className="w-full mb-4">
                        <div className={`flex px-2 bg-slate-950 rounded-md drop-shadow shadow-sm hover:shadow-slate-300 duration-300 border-2 ${inputValuesErr.EmailID ? showErrorInBorder : unShowErrorInBorder}`}>
                            <div className="flex items-center justify-center ml-1">
                                <div className="flex text-xl items-center justify-center border-r border-slate-400 h-7 pr-2">
                                    <CiMail />
                                </div>
                            </div>
                            <input
                                type="email"
                                placeholder="Email ID"
                                name="EmailID"
                                value={inputValues.EmailID}
                                onChange={inputValueHandler}
                                className="flex-1 font-normal text-base bg-slate-950 py-1.5 px-3 rounded-md outline-none"
                            />
                        </div>
                        {inputValuesErr.EmailID && <p className="text-red-600 mt-1 text-sm">{inputValues.EmailID === "" ? "Enter Your Email ID" : "Your Email ID is Invalid"}</p>}
                    </div>

                    {/* Phone */}
                    <div className="w-full mb-4">
                        <div className={`flex px-2 bg-slate-950 rounded-md drop-shadow shadow-sm hover:shadow-slate-300 duration-300 border-2 ${inputValuesErr.PhoneNo ? showErrorInBorder : unShowErrorInBorder}`}>
                            <div className="flex items-center justify-center ml-1">
                                <div className="flex text-base text-slate-300 items-center justify-center border-r border-slate-400 h-7 pr-3">
                                    <FiPhone />
                                </div>
                            </div>
                            <input
                                type="text"
                                maxLength={10}
                                placeholder="Phone Number"
                                name="PhoneNo"
                                value={inputValues.PhoneNo}
                                onChange={inputValueHandler}
                                className="flex-1 font-normal text-base bg-slate-950 py-1.5 px-3 rounded-md outline-none"
                            />
                        </div>
                        {inputValuesErr.PhoneNo && <p className="text-red-600 text-sm">{inputValues.PhoneNo === "" ? "Enter Your Phone Number" : "Your Phone Number is InValid"}</p>}
                    </div>

                    {/* Password */}
                    <div className="w-full mb-4">
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
                                className="flex-1 font-normal text-base bg-slate-950 py-1.5 px-3 rounded-md outline-none"
                            />

                            <div className="cursor-pointer w-10 flex items-center justify-center" onClick={passwordVisibilityHandler}>
                                {passwordVisibility ? <IoMdEyeOff /> : <IoEye />}
                            </div>
                        </div>
                        {inputValuesErr.Password && <p className="text-red-600 text-sm">Enter at least one UpperCase, LowerCase, Digit and any Symbol</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="w-full  mb-4">
                        <div className={`flex px-2 bg-slate-950 rounded-md drop-shadow shadow-sm hover:shadow-slate-300 duration-300 border-2 ${inputValuesErr.PhoneNo ? showErrorInBorder : unShowErrorInBorder}`}>
                            <div className="flex items-center justify-center ml-1">
                                <div className="flex text-xl items-center justify-center border-r border-slate-400 h-7 pr-2">
                                    <CiLock />
                                </div>
                            </div>
                            <input
                                type={passwordVisibility ? "text" : "password"}
                                maxLength={16}
                                placeholder="Confirm Password"
                                name="ConfirmPassword"
                                value={inputValues.ConfirmPassword}
                                onChange={inputValueHandler}
                                className="flex-1 font-normal text-base bg-slate-950 py-1.5 px-3 rounded-md outline-none"
                            />
                        </div>
                        {inputValuesErr.ConfirmPassword && <p className="text-red-600 text-sm">Enter Same Password</p>}
                    </div>

                </div>

                {/* Submit Button */}
                <div className="text-center w-full items-center mt-5">
                    <button
                        type="submit"
                        onClick={onSubmitValidation}
                        className="font-bold text-slate-300 bg-blue-700 hover:text-slate-200 hover:bg-blue-800 duration-300 py-2 w-4/5 rounded-lg"
                    >
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </div>

                {/* Footer */}
                <div className="text-sm text-center mt-3">
                    Already have an account?&nbsp;
                    <Link
                        to="/Login"
                        className="text-base text-blue-600 hover:text-blue-700 hover:underline duration-300"
                    >
                        Login!
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default registration
