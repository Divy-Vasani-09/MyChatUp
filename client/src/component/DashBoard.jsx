import React, { useEffect, useRef, useState } from 'react';
import SideBar from './DashBoardComponent/SideBar';
import { Outlet, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ChatBox from './DashBoardComponent/ChatComponents/ChatBox';
import socketClient from 'socket.io-client'
import axios from 'axios';

export default function DashBoard() {
  const userData = JSON.parse(sessionStorage.getItem("userLoggedData"));
  const [receiverPass, setReceiverPass] = useState(false);
  const [roomInfo, setRoomInfo] = useState({});
  const [chats, setChats] = useState(null);
  const inputRef = useRef(null);
  const [newMessage, setNewMessage] = useState('');
  const [newImageMessage, setNewImageMessage] = useState([]);
  const [newVideoMessage, setNewVideoMessage] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket) return;

    const newSocket = socketClient('http://localhost:3002', {
      reconnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);
    setChats(null);

    newSocket.on("connect", () => {
      console.log("Socket Connected:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket Disconnected:", reason);
    });

    return () => {
      newSocket.disconnect();
      console.log("Socket Disconnected on Unmount");
    };
  }, [])

  useEffect(() => {
    if (!socket) return setChats(null);
    const handleBroadcast = (data) => {
      console.log(data);
    };
    socket.on('broadcast', handleBroadcast);

    return () => {
      socket.off('broadcast', handleBroadcast);
    };
  }, [userData]);

  useEffect(() => {
    if (!socket) return setChats(null);
    if (roomInfo?.conversation_id) {
      socket.emit('join room', roomInfo);
    }

  }, [roomInfo, socket]);

  useEffect(() => {
    if (!socket) return;
    const handleJoined = (data) => {
      const chat = data.messages[0].messages;
      setChats(chat);
      console.log("msg joined");
    };
    socket.on('joined', handleJoined);

    return () => {
      socket.off('joined', handleJoined);
    }
  });

  useEffect(() => {
    if (newMessage || newImageMessage.length > 0 || newVideoMessage.length > 0) {
      sendMessage();
    }

  }, [newMessage, newImageMessage, newVideoMessage]);

  const sendMessage = () => {
    // if (newMessage.trim() === '' && newImageMessage.length === 0 && newVideoMessage.length === 0) return console.log("return");
    // axios.post('http://127.0.0.1:3002/sendMessage', { newMessage, newImageMessage, newVideoMessage, roomInfo })
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(err => {
    //     console.log("Error in /sendMessage ", err);
    //   })
    socket.emit('sendNewMessage', { newMessage, newImageMessage, newVideoMessage, roomInfo });
    console.log("emit called");
    setNewImageMessage([]);
    setNewVideoMessage([]);
    setNewMessage('');
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      console.log("Received msg: ", data.receiveNewMessage);
      setChats((prev = []) => [...prev, data.receiveNewMessage]);
    };

    socket.on('receiveNewMessage', handleNewMessage);

    return () => {
      socket.off('receiveNewMessage', handleNewMessage);
    };
  });

  return (
    <div className='text-white flex bg-white'>
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
            context={{ setReceiverPass, setRoomInfo, inputRef }}
          />
        </div>
      </div>
      <div className="container w-9/12 flex min-h-[88vh] max-h-[89vh] p-1 py-2 gap-3 bg-slate-900 ">
        <ChatBox
          userData={userData}
          receiverPass={receiverPass}
          roomInfo={roomInfo}
          inputRef={inputRef}
          chats={chats}
          setNewMessage={setNewMessage}
          setNewImageMessage={setNewImageMessage}
          setNewVideoMessage={setNewVideoMessage}
        />
      </div>
    </div>
  )
}
