import React, { useState } from 'react';
import { emailIdRegex, phoneNoRegex, passwordRegex } from './Regexes';
import { Link } from 'react-router-dom';

function login() {
  const defaultInputValues = {
    UserName: '',
    EmailID: '',
    PhoneNo: '',
    Password: '',
    ConfirmPassword: ''
  }
  const defaultInputValuesErr = {
    UserName: false,
    EmailID: false,
    PhoneNo: false,
    Password: false,
    ConfirmPassword: false
  }

  const [inputValues, setInputValues] = useState(defaultInputValues);
  const [inputValuesErr, setInputValuesErr] = useState(defaultInputValuesErr)
  const showErrorInBorder = 'border-red-700';
  const unShowErrorInBorder = 'border-slate-950';

  const inputValueHandler = (e) => {
    const { name, value } = e.target;
    setInputValuesErr(defaultInputValuesErr)
    setInputValues({
      ...inputValues,
      [name]: value
    })
  }

  const onSubmitValidation = () => {
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
  }
  return (
    <div className='container center flex flex-col  mx-auto mt-9  w-1/2'>
      <div className='container text-white bg-slate-900 py-9 px-0 rounded-2xl  items-center text-center shadow-slate-500 drop-shadow shadow-md '>

        <div className="container">
          <h1 className='container mb-3 font-bold text-lg'>Login From</h1>
        </div>

        <div className="container">
          <input
            type='email'
            placeholder='Email ID'
            name='EmailID'
            value={inputValues.EmailID}
            onChange={inputValueHandler}
            className={` font-normal text-base bg-slate-950 my-2 mx-0 py-1 px-2 rounded-lg w-1/2 drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.EmailID === true ? showErrorInBorder : unShowErrorInBorder}`}
          >
          </input>
          {inputValuesErr.EmailID === true && <p className='text-red-600'>{inputValues.EmailID === '' ? 'Enter Your Email ID' : 'Your Email ID is InValid'}</p>}
        </div>

        <div className="container">
          <input
            type='text'
            placeholder='Phone Number'
            maxLength={10}
            name='PhoneNo'
            value={inputValues.PhoneNo}
            onChange={inputValueHandler}
            className={` font-normal text-base bg-slate-950 my-2 mx-0 py-1 px-2 rounded-lg w-1/2 drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.PhoneNo === true ? showErrorInBorder : unShowErrorInBorder}`}
          >
          </input>
          {inputValuesErr.PhoneNo === true && <p className='text-red-600'>{inputValues.PhoneNo === '' ? 'Enter Your Phone Number' : 'Your Phone Number is InVaild'}</p>}
        </div>

        <div className="container">
          <input
            type='text'
            placeholder='Password'
            name='Password'
            value={inputValues.Password}
            onChange={inputValueHandler}
            className={` font-normal text-base bg-slate-950 my-2 mx-0 py-1 px-2 rounded-lg w-1/2 drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.Password === true ? showErrorInBorder : unShowErrorInBorder}`}
          >
          </input>
          {inputValuesErr.Password === true && <p className='text-red-600'>Enter at least one UpperCase, LowerCase, Digit and any Symbol</p>}
        </div>

        <div className='text-center items-center m-3 mb-2'>
          <button type='submit' onClick={onSubmitValidation} className=' font-bold text-slate-300  bg-blue-800 hover:bg-blue-700 my-1 mx-0 p-1 px-4 rounded-lg w-[35vh]'>Submit </button>
        </div>

        <div className="container text-base text-center mb-1">
          <Link to="/Registration" className='text-base text-blue-600 hover:underline'>Forgot Password?</Link>
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