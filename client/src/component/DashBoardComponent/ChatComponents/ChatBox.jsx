import React, { useState } from 'react'
import ChatBoxHeader from './ChatBoxHeader'
import ChatInput from './ChatInput';
import Messages from './Messages';

export default function ChatBox({ userData, receiverPass, roomInfo, status, chats, loadMoreMessage, setLoadMoreMessage, hasMore, setNewMessage, setNewImageMessage, setNewVideoMessage, inputRef, }) {

  return (
    <div className='w-full h-full mx-1 rounded-xl border-[0.1px] border-slate-700'>
      {
        receiverPass
          ?
          <>
            <div className="w-full h-[8.4%] mx-auto p-1 bg-slate-800 rounded-t-xl border-b-[0.2px] border-slate-700">
              <ChatBoxHeader
                roomInfo={roomInfo}
                status={status}
              />
            </div>
            <div className="w-full h-5/6">
              <Messages
                chats={chats}
                userData={userData}
                loadMoreMessage={loadMoreMessage}
                setLoadMoreMessage={setLoadMoreMessage}
                hasMore={hasMore}
              />
            </div>
            <div className="w-full h-[8.4%] mx-auto p-1 bg-slate-800 rounded-b-xl border-t-[0.2px] border-slate-700">
              <ChatInput
                roomInfo={roomInfo}
                inputRef={inputRef}
                setNewMessage={setNewMessage}
                setNewImageMessage={setNewImageMessage}
                setNewVideoMessage={setNewVideoMessage}
                chats={chats}
              />
            </div>
          </>
          :
          <div className="flex w-full h-full rounded-xl">
            <h1 className='w-full flex justify-center items-center font-bold'>
              No Messages
            </h1>
          </div>
      }
    </div>
  )
}
