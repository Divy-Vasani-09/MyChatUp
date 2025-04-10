import React, { useEffect, useRef, useState } from "react";
import SideBar from "./DashBoardComponent/SideBar";
import { Outlet, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ChatBox from "./DashBoardComponent/ChatComponents/ChatBox";
import CallBox from "./DashBoardComponent/callComponents/callBox";
import socketClient from "socket.io-client";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import API_URL, { SOCKET_URL } from "../config";

export default function DashBoard() {
  const userData = JSON.parse(sessionStorage.getItem("userLoggedData"));
  const userId = userData?._id;

  const [conversationList, setConversationList] = useState([]);
  const [isChat, setIsChat] = useState(false);
  const [callList, setCallList] = useState([]);
  const [callInfo, setCallInfo] = useState({});
  const [isCall, setIsCall] = useState(false);

  const [receiverPass, setReceiverPass] = useState(false);
  const [roomInfo, setRoomInfo] = useState({});
  const [roomId, setRoomId] = useState();
  const [status, setStatus] = useState({
    online: false,
    lastSeen: null
  });
  const [chats, setChats] = useState(null);

  const [loadMoreMessage, setLoadMoreMessage] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [newImageMessage, setNewImageMessage] = useState([]);
  const [newVideoMessage, setNewVideoMessage] = useState([]);

  const inputRef = useRef();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket && !roomInfo) return console.log("socket true"); // Prevent duplicate connections
    console.log("Connecting to Socket.io at:", SOCKET_URL);

    // const newSocket = socketClient("http://localhost:3002", {
    const newSocket = socketClient(SOCKET_URL, {
      transports: ["websocket"],
      query: { userId: userData._id },
      reconnection: true,    // This is true by default
      reconnectionAttempts: 5,    // This is Infinity by default 
      reconnectionDelay: 2000,    // This is 1s=1000 by default
      reconnectionDelayMax: 5000,    // This is 5s by default
      randomizationFactor: 0.5    // This is 50% by default
    });

    setSocket(newSocket);

    newSocket.on("connect", async () => {
      console.log("Socket Connected:", newSocket.id);
      console.log("Socket ID:", newSocket.id);
      console.log("Socket Connected?:", newSocket.connected);
      newSocket.emit("user_online", { userId });
    });

    if (roomInfo?.conversation_id && !socket) {
      newSocket.emit("join room", roomInfo);
      console.log("re join called");

      let lastSeen = roomInfo?.receiverInfo?.lastSeen
      const date = new Date(lastSeen).toLocaleDateString();
      const time = new Date(lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const tDate = new Date().toLocaleDateString();

      if (lastSeen) {
        lastSeen = `${date} ${time}`;
      }
      if (date == tDate) {
        lastSeen = `Today at ${time}`;
      }
      setStatus(prev => ({ ...prev, online: roomInfo.receiverInfo.online, lastSeen: lastSeen }));
    }

    newSocket.on("disconnect", (reason) => {
      console.log("Socket Disconnected:", reason);
      if (reason === "transport error" || reason === "ping timeout") {
        console.log("Reconnecting...");
        setTimeout(() => {
          socket.connect();
        }, 2000);
      }
    });

    newSocket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
    });

    newSocket.on("reconnect", (attempt) => {
      console.log(`Reconnected successfully after ${attempt} attempts`);
    });

    newSocket.on("reconnect_failed", () => {
      console.log("Reconnection failed");
    });

    return () => {
      console.log("Cleaning up socket...");
      newSocket.off(); // Removes all event listeners
      newSocket.disconnect();
    };
  }, []);


  useEffect(() => {
    if (!socket) return;
    const handleNew_Message = async (data) => {
      setConversationList(prevList =>
        prevList.map(obj =>
          obj.conversation_id === data.roomId
            ? { ...obj, latestMessage: data.receiveNewMessage, updatedAt: data.receiveNewMessage.updatedAt }
            : obj
        )
      );
      console.log("new msg :- ", data.receiveNewMessage)
    }

    socket.emit("join_chatApp", userId);
    socket.on("new_Message", handleNew_Message)

    return () => {
      socket.emit("leave_chatApp", userId);
    };
  }, [socket])


  useEffect(() => {
    if (!socket) return setChats(null);

    const handleBroadcast = (data) => {
      console.log(data);
    };

    socket.on("broadcast", handleBroadcast);

    return () => {
      socket.off("broadcast", handleBroadcast);
    };
  }, [userData]);

  useEffect(() => {
    if (!socket) return setChats(null);
    setRoomId(roomInfo?.conversation_id)
    if (roomInfo?.conversation_id) {
      socket.emit("join room", roomInfo);

      let lastSeen = roomInfo?.receiverInfo?.lastSeen
      const date = new Date(lastSeen).toLocaleDateString();
      const time = new Date(lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const tDate = new Date().toLocaleDateString();

      if (lastSeen) {
        lastSeen = `${date} ${time}`;
      }
      if (date == tDate) {
        lastSeen = `Today at ${time}`;
      }
      setStatus(prev => ({ ...prev, online: roomInfo.receiverInfo.online, lastSeen: lastSeen }));
    }
  }, [roomInfo, socket]);

  useEffect(() => {
    if (!socket) return;
    const handleJoined = (data) => {
      const chat = data.messages[0].messages;
      setChats(chat);
      console.log("room joined");
    };
    const handleClearChat = (data) => {
      const chat = data.messages[0].messages;
      setChats(chat);
      console.log("Clear chat!");
    };

    if (loadMoreMessage) {
      socket.emit("load more messages", { roomId, page: page + 1 });

      socket.on("more messages", (data) => {
        if (data.messages.messages.length === 0) {
          setHasMore(false);
          setLoadMoreMessage(false);
        }
        else {
          const chat = data.messages.messages;

          setChats((prev) => [...chat, ...prev]);
          setPage((prev) => prev + 1);
          setLoadMoreMessage(false);
        }
      });
    }

    socket.on("joined", handleJoined);
    socket.on("clearChat", handleClearChat);

    return () => {
      socket.off("joined", handleJoined);
      socket.off("clearChat", handleClearChat);
    }
  });

  useEffect(() => {
    if (!socket || !roomInfo || !roomInfo.receiverInfo) {
      console.log("Socket or roomInfo is not ready for status!");
      return;
    }

    const handleUser_online = async ({ userId, online, lastSeen }) => {
      console.log("online");

      if (userId === roomInfo.receiverInfo?._id) {
        const date = new Date(lastSeen).toLocaleDateString();
        const time = new Date(lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const tDate = new Date().toLocaleDateString();

        if (date == tDate) {
          lastSeen = `Today at ${time}`;
        }

        setStatus({
          online: online,
          lastSeen: !!lastSeen ? lastSeen : null
        })
      }
    }

    socket.on("user_online", handleUser_online)

    return () => {
      socket.off("user_online", handleUser_online);
    }
  })

  useEffect(() => {
    if (newMessage || newImageMessage.length > 0 || newVideoMessage.length > 0) {
      sendMessage();
    }

  }, [newMessage, newImageMessage, newVideoMessage]);

  const sendMessage = () => {
    socket.emit("sendNewMessage", { newMessage, newImageMessage, newVideoMessage, roomInfo });
    console.log("send message emit called");

    setNewImageMessage([]);
    setNewVideoMessage([]);
    setNewMessage("");
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

    socket.on("receiveNewMessage", handleNewMessage);

    return () => {
      socket.off("receiveNewMessage", handleNewMessage);
    };
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className={`text-white flex h-screen ${(isChat || isCall) && isMobile ? "hidden" : ""}`}>
        <div>
          <ToastContainer
            stacked
            position="top-right"
            autoClose={2000}
            // hideProgressBar
            newestOnTop={false}
            closeOnClick={true}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="colored" />
        </div>
        <div className="container flex w-full sm:w-4/12 h-full p-1 py-2 gap-3 bg-slate-900 ">
          <div className="container w-1/6 h-full rounded-xl bg-slate-800 bg-opacity-75 shadow-slate-600 drop-shadow shadow-sm">
            <SideBar />
          </div>
          <div className="container w-5/6 h-full rounded-xl bg-slate-800 bg-opacity-75 overflow-hidden shadow-slate-600 drop-shadow shadow-sm">
            <Outlet
              context={{ socket, conversationList, setConversationList, setReceiverPass, setRoomInfo, setIsChat, inputRef, callList, setCallList, callInfo, setCallInfo, setIsCall }}
            />
          </div>
        </div>
        <div className="container w-9/12 hidden sm:flex h-full p-1 py-2 gap-3 bg-slate-900">
          <div className="w-full h-full mx-1 rounded-xl border-[0.1px] border-slate-700">
            {
              isChat ?
                <ChatBox
                  socket={socket}
                  userData={userData}
                  receiverPass={receiverPass}
                  roomInfo={roomInfo}
                  setRoomInfo={setRoomInfo}
                  status={status}
                  chats={chats}
                  setChats={setChats}
                  loadMoreMessage={loadMoreMessage}
                  setLoadMoreMessage={setLoadMoreMessage}
                  hasMore={hasMore}
                  setNewMessage={setNewMessage}
                  setNewImageMessage={setNewImageMessage}
                  setNewVideoMessage={setNewVideoMessage}
                  inputRef={inputRef}
                />
                :
                isCall ?
                  <CallBox
                    callInfo={callInfo} />
                  :
                  <div className="flex w-full h-full rounded-xl">
                    <h1 className="w-full flex justify-center items-center font-bold">
                      No Messages
                    </h1>
                  </div>
            }
          </div>
        </div>
      </div>
      <div className={`container w-full h-full ${isChat || isCall ? "sm:hidden flex" : "sm:flex hidden"} p-1 py-2 gap-3 bg-slate-900 `}>
        <div className="w-full h-full mx-1 rounded-xl text-white border-[0.1px] border-slate-700 ">
          {
            isChat ?
              <ChatBox
                socket={socket}
                userData={userData}
                receiverPass={receiverPass}
                roomInfo={roomInfo}
                setRoomInfo={setRoomInfo}
                setIsChat={setIsChat}
                status={status}
                chats={chats}
                setChats={setChats}
                loadMoreMessage={loadMoreMessage}
                setLoadMoreMessage={setLoadMoreMessage}
                hasMore={hasMore}
                setNewMessage={setNewMessage}
                setNewImageMessage={setNewImageMessage}
                setNewVideoMessage={setNewVideoMessage}
                inputRef={inputRef}
              />
              :
              isCall ?
                <CallBox
                  setIsCall={setIsCall}
                  callInfo={callInfo}
                />
                :
                <div className="flex w-full h-full rounded-xl">
                  <h1 className="w-full flex justify-center items-center font-bold">
                    No Messages
                  </h1>
                </div>
          }
        </div>
      </div>
    </>
  )
}
