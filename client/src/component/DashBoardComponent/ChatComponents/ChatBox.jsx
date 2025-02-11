import React, { useState } from 'react'
import ChatBoxHeader from './ChatBoxHeader'
import ChatInput from './ChatInput';

export default function ChatBox({ receiverPass, roomInfo }) {
  const [receiver, setReceiver] = useState({});
  // console.log(roomInfo)

  return (
    <div className='container relative mx- mx-1 min-h-[84.6vh] max-h-[84.6vh] rounded-xl border-[0.1px] border-slate-700'>
      {
        receiverPass
          ?
          <>
            <div className="container w-full h-[0.5in] mx-auto p-1 bg-slate-800 rounded-t-xl border-b-[0.2px] border-slate-700">
              <ChatBoxHeader roomInfo={roomInfo}/>
            </div>
            <div className="container w-full h-5/6 p-1">
              Show Messages
            </div>
            <div className="container w-full h-[0.5in] mx-auto p-1 bg-slate-800 rounded-b-xl border-t-[0.2px] border-slate-700">
              <ChatInput roomInfo={roomInfo}/>
            </div>
          </>
          :
          <div className="container flex w-full h-full rounded-xl">
            <h1 className='w-full flex justify-center items-center font-bold'>
              No Messages
            </h1>
          </div>
      }
    </div>
  )
}
