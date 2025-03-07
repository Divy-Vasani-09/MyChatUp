import React, { useEffect, useRef, useState } from 'react';
import SideBar from './DashBoardComponent/SideBar';
import { Outlet, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ChatBox from './DashBoardComponent/ChatComponents/ChatBox';
import socketClient from 'socket.io-client';
import axios from 'axios';

export default function DashBoard() {
  const userData = JSON.parse(sessionStorage.getItem("userLoggedData"));
  const userId = userData?._id;

  const [conversationList, setConversationList] = useState([]);

  const [receiverPass, setReceiverPass] = useState(false);
  const [roomInfo, setRoomInfo] = useState({});
  const [roomId, setRoomId] = useState()
  const [status, setStatus] = useState({
    online: false,
    lastSeen: null
  })
  const [chats, setChats] = useState(null);

  const [loadMoreMessage, setLoadMoreMessage] = useState(false)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [newImageMessage, setNewImageMessage] = useState([]);
  const [newVideoMessage, setNewVideoMessage] = useState([]);

  const inputRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket) return;

    const newSocket = socketClient('http://localhost:3002', {
      query: { userId: userData._id },
      reconnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);
    setChats(null);

    newSocket.on("connect", () => {
      console.log("Socket Connected:", newSocket.id);
      newSocket.emit('user_online', { userId });
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
    if (!socket) return;
    const handleNew_Message = async (data) => {
      // alert(data.receiveNewMessage.message + " from " + data.receiveNewMessage.sender.UserName);
      setConversationList(prevList =>
        prevList.map(obj =>
          obj.conversation_id === "67c00e48f46ebba7d880ef7d"
            ? { ...obj, latestMessage: data.receiveNewMessage, updatedAt: data.receiveNewMessage.updatedAt }
            : obj
        )
      );
    }

    socket.emit('join_chatApp', userId);
    socket.on('new_Message', handleNew_Message)

    return () => {
      socket.emit('leave_chatApp', userId);
    };
  }, [socket])


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
    setRoomId(roomInfo?.conversation_id)
    if (roomInfo?.conversation_id) {
      socket.emit('join room', roomInfo);
      console.log("lastSeen: ", roomInfo.receiverInfo.lastSeen);

      let lastSeen = roomInfo?.receiverInfo?.lastSeen
      const date = new Date(lastSeen).toLocaleDateString();
      const time = new Date(lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const tDate = new Date().toLocaleDateString();

      if (lastSeen) {
        lastSeen = `${date} ${time}`;
      }
      if (date == tDate) {
        lastSeen = `Today at ${time}`;
      }
      setStatus(prev => ({ ...prev, online: roomInfo.receiverInfo.online, lastSeen: lastSeen }));

      console.log(roomInfo.receiverInfo._id)
    }
  }, [roomInfo, socket]);

  useEffect(() => {
    if (!socket) return;
    const handleJoined = (data) => {
      const chat = data.messages[0].messages;
      setChats(chat);
      console.log("room joined");
    };

    if (loadMoreMessage) {
      socket.emit("load more messages", { roomId, page: page + 1 });

      socket.on("more messages", (data) => {
        if (data.messages.messages.length === 0) {
          setHasMore(false);
          setLoadMoreMessage(false);
        } else {
          
          const chat = data.messages.messages;
          setChats((prev) => [...chat, ...prev]);
          setPage((prev) => prev + 1);
          setLoadMoreMessage(false);
        }
      });
    }

    socket.on('joined', handleJoined);

    return () => {
      socket.off('joined', handleJoined);
    }
  });

  useEffect(() => {
    if (!socket || !roomInfo || !roomInfo.receiverInfo) {
      console.log("Socket or roomInfo is not ready");
      return;
    }
    console.log("Setting up user_online listener");

    const handleUser_online = async ({ userId, online, lastSeen }) => {
      console.log("online");

      if (userId === roomInfo.receiverInfo?._id) {
        const date = new Date(lastSeen).toLocaleDateString();
        const time = new Date(lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const tDate = new Date().toLocaleDateString();

        if (date == tDate) {
          console.log(date);

          lastSeen = `Today at ${time}`;
        }

        setStatus({
          online: online,
          lastSeen: !!lastSeen ? lastSeen : null
        })
      }
    }

    socket.on('user_online', handleUser_online)

    return () => {
      socket.off('user_online', handleUser_online);
    }
  })



  useEffect(() => {
    if (newMessage || newImageMessage.length > 0 || newVideoMessage.length > 0) {
      sendMessage();
    }

  }, [newMessage, newImageMessage, newVideoMessage]);

  const sendMessage = () => {
    socket.emit('sendNewMessage', { newMessage, newImageMessage, newVideoMessage, roomInfo });
    console.log("emit called");

    setNewImageMessage([]);
    setNewVideoMessage([]);
    setNewMessage('');
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (data) => {
      setConversationList(prevList =>
        prevList.map(obj =>
          obj.conversation_id === roomInfo.conversation_id
            ? { ...obj, latestMessage: data.receiveNewMessage, updatedAt: data.receiveNewMessage.updatedAt }
            : obj
        )
      );

      console.log("Received msg: ", data.receiveNewMessage);
      setChats((prev = []) => [...prev, data.receiveNewMessage]);
    };

    socket.on('receiveNewMessage', handleNewMessage);

    return () => {
      socket.off('receiveNewMessage', handleNewMessage);
    };
  });

  // useEffect(() => {

  //   const handleUserOnline = ({ userId, online }) => {
  //     console.log("User Online Event Received:", userId, online);
  //     console.log("Current Room Info:", roomInfo);

  //     if (roomInfo?.receiverInfo?._id === userId) {
  //       console.log("Receiver is online: ", online);
  //     }
  //   };

  //   return () => {
  //     console.log("Removing user_online listener");
  //     socket.off("user_online", handleUserOnline);
  //   };
  // }, [socket, roomInfo]);


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
            context={{ conversationList, setConversationList, setReceiverPass, setRoomInfo, inputRef }}
          />
        </div>
      </div>
      <div className="container w-9/12 flex min-h-[88vh] max-h-[89vh] p-1 py-2 gap-3 bg-slate-900 ">
        <ChatBox
          userData={userData}
          receiverPass={receiverPass}
          roomInfo={roomInfo}
          status={status}
          chats={chats}
          loadMoreMessage={loadMoreMessage}
          setLoadMoreMessage={setLoadMoreMessage}
          hasMore={hasMore}
          setNewMessage={setNewMessage}
          setNewImageMessage={setNewImageMessage}
          setNewVideoMessage={setNewVideoMessage}
          inputRef={inputRef}
        />
      </div>
    </div>
  )
}
