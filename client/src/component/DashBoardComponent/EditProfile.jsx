import React, { useState } from "react";
import { userNameRegex, emailIdRegex, phoneNoRegex, passwordRegex } from "../Regexes";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import API_URL from "../../config";

export default function EditProfile() {
    const defaultInputValues = JSON.parse(sessionStorage.getItem("userLoggedData"));
    const defaultInputValuesErr = {
        UserName: false,
        EmailID: false,
        PhoneNo: false,
        About: false,
    }

    const [inputValues, setInputValues] = useState(defaultInputValues);
    const [inputValuesErr, setInputValuesErr] = useState(defaultInputValuesErr)
    const showErrorInBorder = "border-red-700";
    const unShowErrorInBorder = "border-slate-950";

    const navigate = useNavigate();

    const inputValueHandler = (e) => {
        const { name, value } = e.target;
        setInputValuesErr(defaultInputValuesErr)
        setInputValues({
            ...inputValues,
            [name]: value
        })
    }

    const onSubmitValidation = () => {
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

        axios.post(`${API_URL}/editProfile`, inputValues)
            .then(result => {
                console.log(result)
                const userData = JSON.stringify(result.data.user)
                sessionStorage.setItem("userLoggedData", userData)
                setTimeout(() => toast.success("Successfully Updated!"), 50);
                navigate("/DashBoard/profile")
            })
            .catch(err => console.log(err))

        setInputValues(defaultInputValues);
        setInputValuesErr(defaultInputValuesErr);
    }

    return (
        <div className="container mx-auto mt-2 h-[5.4in] w-full">
            <div className="container flex flex-col w-full h-full p-1">
                <div className="container flex mb-3 pl-2 ">
                    <Link to="/DashBoard/profile" className="text-xl sm:text-lg md:text-xl my-auto p-1 rounded-full hover:bg-slate-950 duration-200">
                        <IoArrowBack />
                    </Link>
                    <h1 className="text-lg font-bold ml-1">
                        Edit Your Profile
                    </h1>
                </div>

                <div className="container flex flex-col w-[97%] h-[88%] mx-auto rounded-lg border-slate-600 border-[0.01px]">
                    <div className="container w-full my-2 mx-auto flex flex-col justify-center">
                        <div className="text-xs ml-4 mt-1 font-bold text-slate-100">
                            User Name
                        </div>
                        <input
                            type="text"
                            maxLength={10}
                            placeholder="User Name"
                            name="UserName"
                            value={inputValues.UserName}
                            onChange={inputValueHandler}
                            className={`font-normal text-base bg-slate-950 mx-auto py-1 px-3 rounded-xl w-11/12 outline-none drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.UserName === true ? showErrorInBorder : unShowErrorInBorder} duration-300`}
                        >
                        </input>
                        {inputValuesErr.UserName === true && <p className="text-red-600">{inputValues.UserName === "" ? "Enter Your User Name" : "Your UserName is inValid"}</p>}
                    </div>

                    <div className="container w-full my-2 mx-auto flex flex-col justify-center">
                        <div className="text-xs ml-4 mt-1 font-bold text-slate-100">
                            Email ID
                        </div>
                        <input
                            type="email"
                            placeholder="Email ID"
                            name="EmailID"
                            value={inputValues.EmailID}
                            onChange={inputValueHandler}
                            className={`font-normal text-base bg-slate-950 mx-auto py-1 px-3 rounded-xl w-11/12 outline-none drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.EmailID === true ? showErrorInBorder : unShowErrorInBorder} duration-300`}
                        >
                        </input>
                        {inputValuesErr.EmailID === true && <p className="text-red-600">{inputValues.EmailID === "" ? "Enter Your Email ID" : "Your Email ID is InValid"}</p>}
                    </div>

                    <div className="container w-full my-2 mx-auto flex flex-col justify-center">
                        <div className="text-xs ml-4 mt-1 font-bold text-slate-100">
                            Phone No.
                        </div>
                        <input
                            type="text"
                            maxLength={10}
                            placeholder="Phone Number"
                            name="PhoneNo"
                            value={inputValues.PhoneNo}
                            onChange={inputValueHandler}
                            className={`font-normal text-base bg-slate-950 mx-auto py-1 px-3 rounded-xl w-11/12 outline-none drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.PhoneNo === true ? showErrorInBorder : unShowErrorInBorder} duration-300`}
                        >
                        </input>
                        {inputValuesErr.PhoneNo === true && <p className="text-red-600">{inputValues.PhoneNo === "" ? "Enter Your Phone Number" : "Your Phone Number is InValid"}</p>}
                    </div>

                    <div className="container w-full my-2 mx-auto flex flex-col justify-center">
                        <div className="text-xs ml-4 mt-1 font-bold text-slate-100">
                            About
                        </div>
                        <input
                            type="text"
                            maxLength={50}
                            placeholder="About"
                            name="About"
                            value={inputValues.About}
                            onChange={inputValueHandler}
                            className={`font-normal text-base bg-slate-950 mx-auto py-1 px-3 rounded-xl w-11/12 outline-none drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.UserName === true ? showErrorInBorder : unShowErrorInBorder} duration-300`}
                        >
                        </input>
                    </div>

                    <div className="container w-full my-3 mx-auto flex flex-col justify-center">
                        <button
                            type="submit"
                            onClick={onSubmitValidation}
                            className="text-base font-bold text-slate-300 bg-blue-800 hover:bg-blue-700 w-[90%] mx-auto p-2 px-4 rounded-xl h-9 duration-300"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
