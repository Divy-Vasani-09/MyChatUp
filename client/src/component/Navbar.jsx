import React from 'react'
import { Link } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";

export default function Navbar() {
  const userData = JSON.parse(sessionStorage.getItem("userLoggedData"));

  return (
    <div className='bg-slate-100'>
      <div className="flex justify-between w-full bg-slate-800 text-white py-2">
        <header>
          <div className='bg-slate-600 rounded-2xl rounded-es-lg p-1 px-2 flex col font-medium mx-2 text-slate-200 text-lg'>
            <h1 className='font-bold'>M</h1>
            <p className='text-base italic'>y</p>
            <h1 className='font-bold'>C</h1>
            <p className='italic'>hat</p>
            <h1 className='font-bold'>MX</h1>
          </div>
        </header>

        <ul className="flex gap-7 mx-9 my-1">
          {/* <NavLink className={(e) => { return e.isActive ? "font-bold pb-1 border-b-2 duration-100" : "" }} to="/DashBoard">
            <li className='cursor-pointer hover:font-bold transition-none duration-100'>Home</li>
          </NavLink> */}
          {
            !userData ?
              <>
                <Link to="/Login">
                  <button className=' hover:bg-slate-600 p-2 py-1 rounded-lg duration-200'>
                    SignIn
                  </button>
                </Link>
                <Link to="/registration">
                  <button className='bg-slate-600 hover:bg-slate-700 p-2 py-1 rounded-lg duration-200'>
                    SignUp
                  </button>
                </Link>
              </>
              :
              <button className='text-3xl text-slate-300 hover:bg-slate-950 hover:text-slate-50 rounded-full duration-200'>
                <FaRegCircleUser />
              </button>
          }
        </ul>
      </div>
    </div>
  )
}
