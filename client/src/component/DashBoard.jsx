import React from 'react'
import SideBar from './DashBoardComponent/SideBar'
import Contact from './DashBoardComponent/Contact'

export default function DashBoard() {
  return (
    <div className='text-white flex '>
      <div className="container flex  w-1/4 min-h-[88vh] bg-blue-950 ">
        <div className="container w-1/6 bg-blue-900 bg-opacity-75">
          <SideBar />
        </div>
        <div className="container w-5/6 mx-2 bg-blue-950">
          <Contact />
        </div>
      </div>
      <div className="container w-3/4 bg-slate-900">Chat</div>
    </div>
  )
}
