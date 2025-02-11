import React, { useState } from 'react'
import axios from 'axios';
import { FaRegSmile } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";

export default function ChatInput({roomInfo}) {
    const [inputOfMessage, setInputOfMessage] = useState('');

    const inputValueHandler = (e) => {
        setInputOfMessage(e.target.value)

    }
    const sendMessageHandler = () => {
        console.log(inputOfMessage.length);
        if (inputOfMessage.length !== 0) {
            axios.post('http://127.0.0.1:3002/sendMessage', { inputOfMessage, roomInfo } )
                .then(result => {
                    console.log(result)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    return (
        <div className='container w-full h-full flex justify-between'>
            <div
                className={`
                    flex justify-around
                    w-11/12 
                    mx-auto 
                    bg-slate-800 
                    rounded-lg 
                    drop-shadow shadow-sm hover:shadow-slate-300 
                    border-[0.1px] border-slate-600 
                    duration-300 
                `
                }
            >
                <div className="cursor-pointer my-auto items-center mx-2 text-xl text-slate-200 rounded-full bg-slate-800 p-1 border-[0.1px] border-slate-900 hover:bg-slate-950 duration-300">
                    <FaRegSmile />
                </div>
                <input
                    type='text'
                    placeholder='Write a message'
                    name='Message'
                    value={inputOfMessage}
                    onChange={inputValueHandler}
                    className='font-normal text-base bg-transparent py-1 px-2 rounded-lg w-11/12 outline-none'
                >
                </input>
            </div>
            <div
                className='flex justify-around rounded-lg border-[0.1px] border-slate-600'
                onClick={sendMessageHandler}
            >
                <div
                    className="my-auto mx-2 text-2xl bg-slate-800 p-1 hover:bg-slate-950 duration-300"
                >
                    <IoSendSharp />
                </div>
            </div>
        </div>
    )
}
