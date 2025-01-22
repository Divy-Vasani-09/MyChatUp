import React, { useState } from 'react';
import { emailIdRegex, phoneNoRegex, passwordRegex } from './Regexes';
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

  const onSubmitValidation = () => {
    if (!emailIdRegex.test(inputValues.EmailIDOrPhoneNo) && !phoneNoRegex.test(inputValues.EmailIDOrPhoneNo)) {
      setInputValuesErr((prev) => ({ ...prev, EmailIDOrPhoneNo: true }))
      return
    }

    axios.post('http://127.0.0.1:3002/Login', inputValues)
      .then(result => {
        console.log(result)
        if (result.data === "Success") {
          navigate("/DashBoard")
        }
      })
      .catch(err => {
        console.log(err);
        const errMessage = err.response.data.message
        setErrorMessage(errMessage)
        if(errMessage === "No record existed"){
          setInputValuesErr((prev) => ({ ...prev, EmailIDOrPhoneNo: true }))
          console.log("hi")
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
      <div className='container text-white bg-slate-900 py-9 px-0 rounded-2xl  items-center text-center shadow-slate-500 drop-shadow shadow-md '>

        <div className="container">
          <h1 className='container mb-3 font-bold text-lg'>Login From</h1>
        </div>

        <div className="container">
          <input
            type='text'
            placeholder='Email ID or Phone Number'
            name='EmailIDOrPhoneNo'
            value={inputValues.EmailIDOrPhoneNo}
            onChange={inputValueHandler}
            className={` font-normal text-base bg-slate-950 my-2 mx-0 py-1 px-2 rounded-lg w-4/6 drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.EmailIDOrPhoneNo=== true ? showErrorInBorder : unShowErrorInBorder}`}
          >
          </input>
          {inputValuesErr.EmailIDOrPhoneNo=== true && <p className='text-red-600'>{inputValues.EmailIDOrPhoneNo=== '' ? 'Enter Your Email ID' : errorMessage !== '' ? errorMessage : 'Your Email ID is InValid'}</p>}
        </div>

        <div className="container">
          <input
            type='text'
            placeholder='Password'
            name='Password'
            value={inputValues.Password}
            onChange={inputValueHandler}
            className={` font-normal text-base bg-slate-950 my-2 mx-0 py-1 px-2 rounded-lg w-4/6 drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.Password === true ? showErrorInBorder : unShowErrorInBorder}`}
          >
          </input>
          {inputValuesErr.Password === true && <p className='text-red-600'>{inputValues.Password === '' ? 'Enter a Password': errorMessage}</p>}
        </div>

        <div className='text-center items-center m-3 mb-2'>
          <button type='submit' onClick={onSubmitValidation} className=' font-bold text-slate-300  bg-blue-800 hover:bg-blue-700 my-1 mx-0 p-1 px-4 rounded-lg w-[35vh]'>Submit </button>
        </div>

        <div className="container text-base text-center mb-1">
          <Link to="/ForgotPassword" className='text-base text-blue-600 hover:underline'>Forgot Password?</Link>
        </div>

        <div className="container text-sm text-center">
          Don't have an account? &nbsp;
          <Link to="/Registration" className='text-base text-blue-600 hover:underline'>SignUp!</Link>
        </div>

      </div>
    </div>
  )
}

export default login