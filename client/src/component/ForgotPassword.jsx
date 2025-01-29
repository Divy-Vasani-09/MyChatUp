import React, { useState } from 'react';
import { emailIdRegex, phoneNoRegex, passwordRegex } from './Regexes';
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
    const defaultInputValues = {
        EmailIDOrPhoneNo: '',
        Password: '',
        ConfirmPassword: '',
    }
    const defaultInputValuesErr = {
        EmailIDOrPhoneNo: false,
        Password: false,
        ConfirmPassword: false,
    }

    const [inputValues, setInputValues] = useState(defaultInputValues);
    const [inputValuesErr, setInputValuesErr] = useState(defaultInputValuesErr)
    const showErrorInBorder = 'border-red-700';
    const unShowErrorInBorder = 'border-slate-950';
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate();

    const inputValueHandler = (e) => {
        const { name, value } = e.target;
        setInputValuesErr(defaultInputValuesErr)
        setErrorMessage('')
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

        axios.post('http://127.0.0.1:3002/ForgotPassword', inputValues)
            .then(result => {
                console.log(result)
                if (result.data === "Success") {
                    navigate("/Login")
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
        <div className='container center flex flex-col  mx-auto mt-9  w-2/6'>
            <div className='container text-white bg-slate-900 py-9 px-0 rounded-2xl  items-center text-center shadow-slate-500 drop-shadow shadow-md '>

                <div className="container">
                    <h1 className='container mb-3 font-bold text-lg'>Reset Password</h1>
                </div>

                <div className="container EmailID-PhoneNo my-2">
                    <div className={`flex w-4/6 bg-slate-950 my-2 mx-auto rounded-lg  drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.EmailIDOrPhoneNo === true ? showErrorInBorder : unShowErrorInBorder}`}>
                        <div className=' border-r w-1/12 items-center my-auto ml-1'>
                            <CiMail />
                        </div>
                        <input
                            type='text'
                            placeholder='Email ID or Phone Number'
                            name='EmailIDOrPhoneNo'
                            value={inputValues.EmailIDOrPhoneNo}
                            onChange={inputValueHandler}
                            className={` font-normal text-base bg-slate-950 py-1 px-2 rounded-lg w-11/12 outline-none `}
                        >
                        </input>
                    </div>
                    {inputValuesErr.EmailIDOrPhoneNo === true && <p className='text-red-600'>{inputValues.EmailIDOrPhoneNo === '' ? 'Enter Your Email ID or Phone No.' : errorMessage !== '' ? errorMessage : 'InValid Email Id'}</p>}
                </div>

                <div className="container Password">
                    <div className={`flex w-4/6 bg-slate-950 my-2 mx-auto rounded-lg  drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.Password === true ? showErrorInBorder : unShowErrorInBorder}`}>
                        <div className='border-r w-1/12 items-center my-auto ml-1' >
                            <CiLock />
                        </div>
                        <div className='w-10/12 '>
                            <input
                                type={passwordVisibility ? 'text' : 'password'}
                                maxLength={16}
                                placeholder='Password'
                                name='Password'
                                value={inputValues.Password}
                                onChange={inputValueHandler}
                                className={` font-normal text-base text-left bg-slate-950 py-1 px-2 rounded-lg outline-none w-full`}
                            >
                            </input>
                        </div>
                        <div className='cursor-pointer w-1/12 items-center my-auto mx-auto' onClick={passwordVisibilityHandler}>
                            {passwordVisibility ? <IoMdEyeOff /> : <IoEye />}
                        </div>
                    </div>
                    {inputValuesErr.Password === true && <p className='text-red-600'>{errorMessage !== '' ? errorMessage : 'Enter at least one UpperCase, LowerCase, Digit and any Symbol'}</p>}
                </div>

                <div className="container Confirm-Password my-2">
                    <div className={`flex w-4/6 bg-slate-950 my-2 mx-auto rounded-lg  drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.ConfirmPassword === true ? showErrorInBorder : unShowErrorInBorder}`}>
                        <div className='text-slate-300 border-r w-1/12 items-center my-auto ml-1'>
                            <TbLockPassword />
                        </div>
                        <input
                            type={passwordVisibility ? 'text' : 'password'}
                            maxLength={16}
                            placeholder='Confirm Password'
                            name='ConfirmPassword'
                            value={inputValues.ConfirmPassword}
                            onChange={inputValueHandler}
                            className={` font-normal text-base bg-slate-950 py-1 px-2 rounded-lg w-11/12 outline-none`}
                        >
                        </input>
                    </div>
                    {inputValuesErr.ConfirmPassword === true && <p className='text-red-600'>Enter Same Password</p>}
                </div>

                <div className='text-center items-center m-3 mb-2'>
                    <button type='submit' onClick={onSubmitValidation} className=' font-bold text-slate-300  bg-blue-800 hover:bg-blue-700 my-1 mx-0 p-1 px-4 rounded-lg w-[35vh]'>Submit </button>
                </div>

                <div className="container text-base text-center mb-1">
                    <Link to="/Login" className=' text-base text-blue-600 hover:underline'>Go Back?</Link>
                </div>

            </div>
        </div>
    )
}

export default ForgotPassword