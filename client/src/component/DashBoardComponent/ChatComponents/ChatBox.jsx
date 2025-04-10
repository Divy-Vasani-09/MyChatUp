import React, { useEffect, useRef, useState } from "react"
import ChatBoxHeader from "./ChatBoxHeader"
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import ReceivedVoiceCall from "./Calling/ReceivedVoiceCall";
import UserIcon from "C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/profile.png";

export default function ChatBox({
  socket,
  userData,
  receiverPass,
  roomInfo,
  setRoomInfo,
  setIsChat,
  status,
  chats,
  setChats,
  loadMoreMessage,
  setLoadMoreMessage,
  hasMore,
  setNewMessage,
  setNewImageMessage,
  setNewVideoMessage,
  inputRef,
}) {
  const [scrollMessages, setScrollMessages] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [callerInfo, setCallerInfo] = useState();
  const [channelName, setChannelName] = useState();
  const [callDataId, setCallDataId] = useState("");
  const [joined, setJoined] = useState(false);

  const EndRef = useRef();

  const receiverInfo = roomInfo?.receiverInfo;

  useEffect(() => {
    if (!socket) return;
    const handleReceivedCall = (data) => {
      console.log("received :------------------------------------------------------>>", data.from);
      setChannelName(data.channelName);
      setCallerInfo(data.from);
      setCallDataId(data.callDataId);
      setShowPopup(true);
    }
    const handleCallDown = (data) => {
      console.log("call Down ----------------->", data.from);
      setCallDataId("");
      setChannelName(data.channelName);
      setCallerInfo(data.from);
      setShowPopup(false);
      setJoined(false);
    }

    socket.on("receivedCall", handleReceivedCall);
    socket.on("callDown", handleCallDown);

    return () => {
      socket.off("receivedCall", handleReceivedCall);
      socket.off("callDown", handleCallDown);
    }
  });
  useEffect(() => {
    EndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
  }, [inputRef]);

  return (
    <>
      {showPopup ?
        <div className="w-full h-full flex justify-center">
          <ReceivedVoiceCall
            channelName={channelName}
            socket={socket}
            userData={userData}
            roomInfo={roomInfo}
            receiverId={receiverInfo ? receiverInfo._id : callerInfo._id}
            callerInfo={callerInfo}
            setCallerInfo={setCallerInfo}
            callDataId={callDataId}
            setCallDataId={setCallDataId}
            joined={joined}
            setJoined={setJoined}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
          />
        </div>
        : (receiverPass &&
          <>
            <div className="w-full h-[8.4vh] mx-auto p-1 bg-slate-800 rounded-t-xl border-b-[0.2px] border-slate-700">
              <ChatBoxHeader
                socket={socket}
                userData={userData}
                roomInfo={roomInfo}
                setRoomInfo={setRoomInfo}
                setIsChat={setIsChat}
                status={status}
                chats={chats}
                setChats={setChats}
                joined={joined}
                setJoined={setJoined}
                showPopup={showPopup}
                setShowPopup={setShowPopup}
                setCallerInfo={setCallerInfo}
              />
            </div>
            <div className="w-full h-[81vh] sm:h-[81vh] overflow-y-auto scroll-smooth">
              <Messages
                chats={chats}
                userData={userData}
                loadMoreMessage={loadMoreMessage}
                setLoadMoreMessage={setLoadMoreMessage}
                hasMore={hasMore}
                scrollMessages={scrollMessages}
                setScrollMessages={setScrollMessages}
              />
            </div>
            <div className="w-full h-[8.4vh] mx-auto p-1 bg-slate-800 rounded-b-xl border-b-[0.2px] border-slate-700">
              <ChatInput
                userData={userData}
                roomInfo={roomInfo}
                inputRef={inputRef}
                setNewMessage={setNewMessage}
                setNewImageMessage={setNewImageMessage}
                setNewVideoMessage={setNewVideoMessage}
                chats={chats}
                setScrollMessages={setScrollMessages}
              />
            </div>
            <div ref={EndRef} />
          </>
        )
      }
    </>
  )
}
