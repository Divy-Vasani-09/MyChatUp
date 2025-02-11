import React, { useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import UserIcon from 'C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/profile.png';
import { IoCallOutline } from "react-icons/io5";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from 'react-router-dom';

export default function ChatBoxHeader({roomInfo}) {
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
                <div className="my-auto">{roomInfo.receiverInfo.UserName}</div>
            </div>
            <div className="flex justify-around">
                <Link className="my-auto mx-2 text-2xl rounded-full bg-slate-800 border-[0.01px] border-slate-600 p-1 hover:bg-slate-950 hover:border-slate-500 duration-300">
                    <IoCallOutline />
                </Link>
                <Link className="my-auto mx-2 text-2xl rounded-full bg-slate-800 border-[0.01px] border-slate-600 p-1 hover:bg-slate-950 hover:border-slate-500 duration-300">
                    <HiOutlineVideoCamera />
                </Link>
                <Link className="my-auto mx-2 text-2xl rounded-full bg-slate-800 border-[0.01px] border-slate-600 p-1 hover:bg-slate-950 hover:border-slate-500 duration-300">
                    <BsThreeDotsVertical />
                </Link>
            </div>
        </div >
    )
}
