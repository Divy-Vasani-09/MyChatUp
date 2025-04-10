import React, { useState } from "react";
import { emailIdRegex, phoneNoRegex, passwordRegex } from "./Regexes";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import API_URL from "../config";
import Step1 from "../ForgotPasswordComponent/Step1";
import OtpVerify from "../ForgotPasswordComponent/OtpVerify";

function ForgotPassword() {
    const defaultInputValues = {
        EmailIDOrPhoneNo: "",
        Password: "",
        ConfirmPassword: "",
    }
    const defaultInputValuesErr = {
        EmailIDOrPhoneNo: false,
        Password: false,
        ConfirmPassword: false,
    }

    const [step, setStep] = useState(1);
    const [inputValues, setInputValues] = useState(defaultInputValues);
    const [inputValuesErr, setInputValuesErr] = useState(defaultInputValuesErr);
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
        setErrorMessage("")
        setInputValues({
            ...inputValues,
            [name]: value
        })
    }

    const passwordVisibilityHandler = () => {
        { passwordVisibility ? setPasswordVisibility(false) : setPasswordVisibility(true) }
    }

    const onSubmitValidation = () => {
        setInputValuesErr(defaultInputValuesErr)
        if (!emailIdRegex.test(inputValues.EmailIDOrPhoneNo) && !phoneNoRegex.test(inputValues.EmailIDOrPhoneNo)) {
            setInputValuesErr((prev) => ({ ...prev, EmailIDOrPhoneNo: true }))
            return
        }
        if (!passwordRegex.test(inputValues.Password)) {
            setInputValuesErr((prev) => ({ ...prev, Password: true }))
            return
        }
        if (inputValues.Password !== inputValues.ConfirmPassword) {
            setInputValuesErr((prev) => ({ ...prev, ConfirmPassword: true }))
            return
        }

        setLoading(true);
        axios.post(`${API_URL}/set_new_password`, inputValues)
            .then(result => {
                console.log(result)
                if (result.data === "Success") {
                    setTimeout(() => toast.success("Successfully Change Password!"), 100);
                    navigate("/Login");
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(err)
                setErrorMessage(err.response.data)
                if (err.response.data === "No record existed") {
                    setInputValuesErr((prev) => ({ ...prev, EmailIDOrPhoneNo: true }))
                    return
                }
                if (err.response.data === "Password is Already Exist!") {
                    setInputValuesErr((prev) => ({ ...prev, Password: true }))
                    return
                }
            })
    }
    return (
        <div className="flex flex-col justify-center items-center min-h-screen mx-auto w-full px-2 sm:px-0 bg-gray-900">
            <div>
                <ToastContainer
                    stacked
                    position="top-right"
                    autoClose={2000}
                    newestOnTop={false}
                    closeOnClick
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
                    text-gray-300 
                    bg-gray-800
                    py-9 px-2 sm:px-10
                    rounded-2xl 
                    items-center 
                    text-center 
                    drop-shadow-lg shadow-gray-800
                    hover:shadow-gray-900 hover:shadow-[rgba(0,0,10,0.5)_1px_1px_90px_1px]
                    duration-500"
            >
                {
                    step === 1 && <Step1 setInputValues={setInputValues} step={step} setStep={setStep} />
                }
                {
                    step === 2 && <OtpVerify EmailIDOrPhoneNo={inputValues.EmailIDOrPhoneNo} step={step} setStep={setStep} />
                }
                {
                    step === 3 &&
                    <>
                        <div className="flex items-center justify-center mx-auto mb-1 space-x-1">
                            {/* Logo */}
                            <div className="flex items-center justify-center bg-gray-700 rounded-xl p-1 px-2 font-medium text-slate-200 text-lg shadow-slate-500 drop-shadow shadow-[rgba(0,0,10,0.5)_1px_1px_5px_1px]">
                                <h1 className="select-none font-bold ">M</h1>
                                <p className="select-none text-base italic">y</p>
                                <h1 className="select-none font-bold">C</h1>
                                <p className="select-none italic">hat</p>
                                <h1 className="select-none font-bold">MX</h1>
                            </div>
                        </div>

                        <div className="flex items-center justify-center mx-auto mb-6 space-x-1">
                            {/* Reset Password Form Title */}
                            <div className="text-left">
                                <h1 className="font-bold text-xl text-slate-300">
                                    Reset your Password
                                </h1>
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            {/* Email / Phone Input */}
                            <div className="w-full mb-3">
                                <div className={`flex px-2 bg-slate-950 rounded-md drop-shadow shadow-sm hover:shadow-slate-00 duration-300 border-2 ${inputValuesErr.EmailIDOrPhoneNo === true ? showErrorInBorder : unShowErrorInBorder}`}>
                                    <div className="flex items-center justify-center ml-1">
                                        <div className="flex text-xl items-center justify-center border-r border-slate-400 h-7 pr-2">
                                            <CiMail />
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Email ID or Phone Number"
                                        name="EmailIDOrPhoneNo"
                                        value={inputValues.EmailIDOrPhoneNo}
                                        // onChange={inputValueHandler}
                                        disabled
                                        className="flex-1 font-normal text-base text-gray-400 bg-slate-950 py-1.5 px-3 rounded-md outline-none"
                                    />
                                </div>
                                {inputValuesErr.EmailIDOrPhoneNo === true && <p className="text-red-600">{inputValues.EmailIDOrPhoneNo === "" ? "Enter Your Email ID or Phone No." : errorMessage !== "" ? errorMessage : "InValid Email Id"}</p>}
                            </div>

                            {/* Password */}
                            <div className="w-full mb-4">
                                <div className={`flex px-2 bg-slate-950 rounded-md drop-shadow shadow-sm hover:shadow-slate-300 duration-300 border-2 ${inputValuesErr.Password === true ? showErrorInBorder : unShowErrorInBorder}`}>
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
                                {inputValuesErr.Password === true && <p className="text-red-600">{errorMessage !== "" ? errorMessage : "Enter at least one UpperCase, LowerCase, Digit and any Symbol"}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="w-full  mb-4">
                                <div className={`flex px-2 bg-slate-950 rounded-md drop-shadow shadow-sm hover:shadow-slate-300 duration-300 border-2 ${inputValuesErr.ConfirmPassword === true ? showErrorInBorder : unShowErrorInBorder}`}>
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
                                {inputValuesErr.ConfirmPassword && <p className="text-red-600">Enter Same Password</p>}
                            </div>

                        </div>

                        {/* Submit Button */}
                        <div className="text-center w-full items-center my-4">
                            <button
                                type="submit"
                                onClick={onSubmitValidation}
                                className="font-bold text-slate-300 bg-blue-700 hover:text-slate-200 hover:bg-blue-800 duration-300 py-2 w-4/5 rounded-lg"
                            >
                                {loading ? `Loading${dots}` : "Let's Go"}
                            </button>
                        </div>
                    </>
                }


                <div className="text-sm text-center text-gray-400">
                    You remember Password?&nbsp;
                    <Link to="/Login" className="text-base text-indigo-400 hover:text-indigo-500 hover:underline duration-300">
                        Go Back!
                    </Link>
                </div>
            </div>
        </div>

    )
}

export default ForgotPassword