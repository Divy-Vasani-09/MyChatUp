import axios from 'axios';
import React, { useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const userData = JSON.parse(sessionStorage.getItem("userLoggedData"));
  const navigate = useNavigate();

  const logOutHandle = () => {
    sessionStorage.removeItem("userLoggedData")
    navigate("/Login")
  }

  return (
    <div className="container mx-auto mt-2 h-[5.4in] w-full">
      <div className="container flex flex-col text-center items-center mx-auto">
        <div className="container text-left pl-3 bg-indigo-900 bg-opacity-50 rounded-2xl  rounded-s-sm">
          <h1 className='text-lg font-bold'>
            Profile
          </h1>
        </div>
        <div className="container flex flex-col text-7xl items-center p-1 mt-2 rounded-xl bg-opacity-15 hover:bg-opacity-20">
          <FaUserCircle />
        </div>
        <div className="container User-Name m-2 w-full ">
          <div className="container text-sm">User Name</div>
          <div className='container text-lg font-bold'>{userData.UserName}</div>
        </div>
        <div className="container Phone NUmber m-2 w-full ">
          <div className="container text-sm">Mobile Number</div>
          <div className='container text-lg font-bold'>{userData.PhoneNo}</div>
        </div>
        <div className="container Email ID m-2 w-full ">
          <div className="container text-sm">Email ID</div>
          <div className='container text-lg font-bold'>{userData.EmailID}</div>
        </div>
      </div>
      <div className="container flex justify-around">
        <button type='submit' onClick={logOutHandle} className='text-base font-bold text-red-300  bg-blue-800 hover:text-white hover:bg-blue-700 my-1 mr-14 p-1 px-2 rounded-xl '>Logout </button>
        <Link to="/DashBoard/editProfile">
          <button type='submit' className='text-xl font-bold text-slate-300  bg-blue-800 hover:bg-blue-700 my-1 ml-14 p-2 rounded-xl '><FaEdit /> </button>
        </Link>
      </div>
    </div>
  )
}

export default Profile
