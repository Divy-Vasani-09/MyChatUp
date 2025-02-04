import React, { useState } from 'react';
import { userNameRegex, emailIdRegex, phoneNoRegex, passwordRegex } from '../Regexes';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditProfile() {
    const defaultInputValues = JSON.parse(sessionStorage.getItem("userLoggedData"));
    const defaultInputValuesErr = {
        UserName: false,
        EmailID: false,
        PhoneNo: false,
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

        axios.post('http://127.0.0.1:3002/editProfile', inputValues)
            .then(result => {
                console.log(result)
                const userData = JSON.stringify(result.data.user)
                sessionStorage.setItem("userLoggedData", userData)
                navigate("/DashBoard/profile")
            })
            .catch(err => console.log(err))

        setInputValues(defaultInputValues);
        setInputValuesErr(defaultInputValuesErr);
    }

    return (
        <div className="container mx-auto mt-2 h-[5.4in] ">
            <div className="container flex flex-col ">
                <div className="container mb-3 pl-1 bg-indigo-900 bg-opacity-50 rounded-2xl  rounded-s-sm">
                    <h1 className='text-lg font-bold'>
                        Edit Your Profile
                    </h1>
                </div>

                <div className="container">
                    <input
                        type='text'
                        maxLength={10}
                        placeholder='User Name'
                        name='UserName'
                        value={inputValues.UserName}
                        onChange={inputValueHandler}
                        className={` font-normal text-base bg-slate-900 my-2 mx-0 py-1 px-2 rounded-lg w-4/6 drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.UserName === true ? showErrorInBorder : unShowErrorInBorder}`}
                    >
                    </input>
                    {inputValuesErr.UserName === true && <p className='text-red-600'>{inputValues.UserName === '' ? 'Enter Your User Name' : 'Your UserName is inValid'}</p>}
                </div>

                <div className="container">
                    <div className='container'>Email ID</div>
                    <input
                        type='email'
                        placeholder='Email ID'
                        name='EmailID'
                        value={inputValues.EmailID}
                        onChange={inputValueHandler}
                        className={` font-normal text-base bg-slate-800 my-2 mx-0 py-1 px-2 rounded-lg w-4/6 drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.EmailID === true ? showErrorInBorder : unShowErrorInBorder}`}
                    >
                    </input>
                    {inputValuesErr.EmailID === true && <p className='text-red-600'>{inputValues.EmailID === '' ? 'Enter Your Email ID' : 'Your Email ID is InValid'}</p>}
                </div>

                <div className="container">
                    <input
                        type='text'
                        maxLength={10}
                        placeholder='Phone Number'
                        name='PhoneNo'
                        value={inputValues.PhoneNo}
                        onChange={inputValueHandler}
                        className={` font-normal text-base bg-slate-950 my-2 mx-0 py-1 px-2 rounded-lg w-4/6 drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid ${inputValuesErr.PhoneNo === true ? showErrorInBorder : unShowErrorInBorder}`}
                    >
                    </input>
                    {inputValuesErr.PhoneNo === true && <p className='text-red-600'>{inputValues.PhoneNo === '' ? 'Enter Your Phone Number' : 'Your Phone Number is InVaild'}</p>}
                </div>


                <div className="container flex justify-around mt-1">
                    <Link to="/DashBoard/profile">
                        <button type='submit' className='text-base font-bold text-slate-300  bg-blue-800 hover:bg-blue-700 my-1 p-2 px-4 rounded-lg h-9'>Go Back </button>
                    </Link>
                    <button type='submit' onClick={onSubmitValidation} className='text-base font-bold text-slate-300  bg-blue-800 hover:bg-blue-700 my-1 p-2 px-4 rounded-lg  h-9'>Submit </button>
                </div>

            </div>
        </div>
    )
}
