import React, { useState } from 'react';
import { emailIdRegex, phoneNoRegex, passwordRegex } from './Regexes';
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function login() {
  const defaultInputValues = {
    EmailIDOrPhoneNo: '',
    Password: ''
  }
  const defaultInputValuesErr = {
    EmailIDOrPhoneNo: false,
    Password: false
  }

  const [inputValues, setInputValues] = useState(defaultInputValues);
  const [inputValuesErr, setInputValuesErr] = useState(defaultInputValuesErr)
  const showErrorInBorder = 'border-red-700';
  const unShowErrorInBorder = 'border-slate-950';
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

    axios.post('http://127.0.0.1:3002/Login', inputValues)
      .then(result => {
        console.log(result)
        if (result.data.success) {
          const userData = JSON.stringify(result.data.user)
          sessionStorage.setItem("userLoggedData", userData)
          navigate("/DashBoard/contact")
        }
      })
      .catch(err => {
        console.log(err);
        const errMessage = err.response.data.message
        setErrorMessage(errMessage)
        if (errMessage === "No record existed") {
          setInputValuesErr((prev) => ({ ...prev, EmailIDOrPhoneNo: true }))
          return
        }
        if (errMessage === "Password is incorrect!") {
          setInputValuesErr((prev) => ({ ...prev, Password: true }))
          return
        }
      })
  }
  return (
    <div className='container center flex flex-col  mx-auto mt-9  w-2/6'>
      <div className='container  items-center text-center text-white bg-slate-900 py-9 px-0 rounded-2xl shadow-slate-500 drop-shadow shadow-md '>

        <div className="container">
          <h1 className='container mb-3 font-bold text-lg'>Login From</h1>
        </div>

        <div className="container">
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
              className={` font-normal text-base bg-slate-950 py-1 px-2 rounded-lg w-11/12 outline-none`}
            >
            </input>
          </div>
          {inputValuesErr.EmailIDOrPhoneNo === true && <p className='text-red-600'>{inputValues.EmailIDOrPhoneNo === '' ? 'Enter Your Email ID' : errorMessage !== '' ? errorMessage : 'Your Email ID is InValid'}</p>}
        </div>

        <div className="container ">
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
          {inputValuesErr.Password === true && <p className='text-red-600'>{inputValues.Password === '' ? 'Enter a Password' : errorMessage}</p>}
        </div>

        <div className='text-center items-center m-3 mb-2'>
          <button type='submit' onClick={onSubmitValidation} className=' font-bold text-slate-300  bg-blue-800 hover:bg-blue-700 my-1 mx-0 p-1 px-4 rounded-lg w-[35vh]'>Submit </button>
        </div>

        <div className="container text-base text-center mb-1">
          <Link to="/ForgotPassword" className='text-base text-blue-600 hover:underline'>Forgot Password?</Link>
        </div>

        <div className="container text-sm text-center">
          Don't have an account? &nbsp;
          <Link to="/registration" className='text-base text-blue-600 hover:underline'>SignUp!</Link>
        </div>

      </div>
    </div>
  )
}

export default login