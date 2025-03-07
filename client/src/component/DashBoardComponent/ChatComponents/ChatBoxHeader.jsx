import React, { useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import UserIcon from 'C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/profile.png';
import { IoCallOutline } from "react-icons/io5";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from 'react-router-dom';

export default function ChatBoxHeader({ roomInfo, status }) {
    const [receiver, setReceiver] = useState({});
    const [receiverPass, setReceiverPass] = useState(false);

    return (
        <div className='container w-full h-full flex justify-between' >
            <div className="flex justify-around">
                <div className="cursor-pointer my-auto mx-2 text-xl">
                    <img
                        className='w-8'
                        src={UserIcon}
                    />
                </div>
                <div className="flex flex-col justify-center gap-0">
                    <div className='p-0 m-0 '>
                        {roomInfo.receiverInfo.UserName}
                    </div>
                    <div className={`text-xs p-0 m-0 ${!status?.online ? 'text-slate-200': 'text-green-300'}`}>
                        {
                            !!status?.online ?
                                'Online'
                                :
                                !!status?.lastSeen ?
                                    `Last seen: ${status.lastSeen}`
                                    :
                                    'Offline'
                        }
                    </div>
                </div>
            </div>
            <div className="flex justify-around">
                <div className="cursor-pointer my-auto mx-2 text-2xl rounded-full bg-slate-800 border-[0.01px] border-slate-600 p-1 hover:bg-slate-950 hover:border-slate-500 duration-300">
                    <IoCallOutline />
                </div>
                <div className="cursor-pointer my-auto mx-2 text-2xl rounded-full bg-slate-800 border-[0.01px] border-slate-600 p-1 hover:bg-slate-950 hover:border-slate-500 duration-300">
                    <HiOutlineVideoCamera />
                </div>
                <div className="cursor-pointer my-auto mx-2 text-2xl rounded-full bg-slate-800 border-[0.01px] border-slate-600 p-1 hover:bg-slate-950 hover:border-slate-500 duration-300">
                    <BsThreeDotsVertical />
                </div>
            </div>
        </div >
    )
}
