import React, { useState } from 'react';
import { userNameRegex, emailIdRegex, phoneNoRegex, passwordRegex } from './Regexes';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function registration() {

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
        if (!passwordRegex.test(inputValues.Password)) {
            setInputValuesErr((prev) => ({ ...prev, Password: true }))
            return
        }
        if (inputValues.Password !== inputValues.ConfirmPassword) {
            console.log(inputValues.Password, inputValues.ConfirmPassword)
            setInputValuesErr((prev) => ({ ...prev, ConfirmPassword: true }))
            return
        }

        axios.post('http://127.0.0.1:3002/Registration', inputValues)
            .then(result => {
                console.log(result)
                navigate("/login")
            })
            .catch(err => console.log(err))

        setInputValues(defaultInputValues);
        setInputValuesErr(defaultInputValuesErr)
    }

    return (
        <div className='container center flex flex-col  mx-auto mt-9  w-1/2'>
            <div className='container text-white bg-slate-900 py-9 px-0 rounded-2xl  items-center text-center shadow-slate-500 drop-shadow shadow-md '>

                <div className="container">
                    <h1 className='container mb-3 font-bold text-lg'>Registration Form</h1>
                </div>

                <div className="container">
                    <input
                        type='text'
                        placeholder='User Name'
                        name='UserName'
                        value={inputValues.UserName}
                        onChange={inputValueHandler}
                        className={` font-normal text-base bg-slate-950 my-2 mx-0 py-1 px-2 rounded-lg w-1/2 drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.UserName === true ? showErrorInBorder : unShowErrorInBorder}`}
                    >
                    </input>
                    {inputValuesErr.UserName === true && <p className='text-red-600'>{inputValues.UserName === '' ? 'Enter Your User Name' : 'Your UserName is inValid'}</p>}
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

                <div className="container">
                    <input
                        type='text'
                        placeholder='Confirm Password'
                        name='ConfirmPassword'
                        value={inputValues.ConfirmPassword}
                        onChange={inputValueHandler}
                        className={` font-normal text-base bg-slate-950 my-2 mx-0 py-1 px-2 rounded-lg w-1/2 drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.ConfirmPassword === true ? showErrorInBorder : unShowErrorInBorder}`}
                    >
                    </input>
                    {inputValuesErr.ConfirmPassword === true && <p className='text-red-600'>Enter Same Password</p>}
                </div>

                <div className='text-center items-center m-3'>
                    <button type='submit' onClick={onSubmitValidation} className=' font-bold text-slate-300  bg-blue-800 hover:bg-blue-700 my-1 mx-0 p-1 px-4 rounded-lg w-[35vh]'>Submit </button>
                </div>

                <div className="container text-sm text-center">
                    Already have an account? &nbsp;
                    <Link to="/login" className='text-base text-blue-600 hover:underline'>Login!</Link>
                </div>

            </div>
        </div>
    )
}

export default registration
