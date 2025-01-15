import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <div>
      <div className="container flex justify-between bg-slate-800 text-white py-3 shadow-lg">
        <header>
          <div className='bg-slate-600 rounded-2xl  rounded-es-lg p-1 px-2 flex col font-medium mx-2 text-slate-200 text-lg'>
            <h1 className='font-bold'>M</h1>
            <p className='text-base italic'>y</p>
            <h1 className='font-bold'>C</h1>
            <p className='italic'>hat</p>
            <h1 className='font-bold'>MX</h1>
          </div>
        </header>

        <ul className="flex gap-8 mx-9 my-1">
          {/* <NavLink className={(e) => { return e.isActive ? "font-bold " : "" }} to="/DashBoard">
            <li className='curser-pointer hover:font-bold transition-none duration-100'>Home</li>
          </NavLink> */}
          <NavLink className={(e) => { return e.isActive ? "font-bold" : "" }} to="/Login">
            <li className='curser-pointer hover:font-bold transition-none duration-100'>Login</li>
          </NavLink>
        </ul>
      </div>
    </div>
  )
}
