import React, { useEffect, useState } from 'react';
import SideBar from './DashBoardComponent/SideBar';
import { Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ChatBox from './DashBoardComponent/ChatComponents/ChatBox';
import socketIoClient from 'socket.io-client'

export default function DashBoard() {
  const socketIo = socketIoClient('http://localhost:3002');
  const [receiverPass, setReceiverPass] = useState(false);
  const [roomInfo, setRoomInfo] = useState({});

  useEffect(() => {
    socketIo.on('chat', (chats) => {
      setChats(chats)
    });
  });

  return (
    <div className='text-white flex'>
      <div>
        <ToastContainer
          stacked
          position="top-center"
          autoClose={2000}
          // hideProgressBar
          newestOnTop={false}
          closeOnClick={true}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="colored" />
      </div>
      <div className="container flex w-4/12 min-h-[88vh] max-h-[89vh] p-1 py-2 gap-3 bg-slate-900 ">
        <div className="container w-1/6 rounded-xl bg-slate-800 bg-opacity-75 shadow-slate-600 drop-shadow shadow-sm">
          <SideBar />
        </div>
        <div className="container w-5/6 rounded-xl bg-slate-800 bg-opacity-75 shadow-slate-600 drop-shadow shadow-sm">
          <Outlet
            context={{ setReceiverPass, setRoomInfo }}
          />
        </div>
      </div>
      <div className="container w-9/12 flex min-h-[88vh] max-h-[89vh] p-1 py-2 gap-3 bg-slate-900 ">
        <ChatBox receiverPass={receiverPass} roomInfo={roomInfo} />
      </div>
    </div>
  )
}
