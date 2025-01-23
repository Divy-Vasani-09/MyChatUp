import React, { useState } from 'react'
import UserIcon from 'C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/profile.png'
import { NavLink } from 'react-router-dom'

function Contact() {
    const [newChat, setNewChat] = useState(false);

    const newChatHandler = () => {
        setNewChat(true)
    }
    const searchHandler = () => {

    }
    const topFiveMatched = (e) => {
        const { name, value } = e.target;
        setInputValues({
            ...inputValues,
            [name]: value
        });
        const optionS = document.getElementById('optionS').value;
    };

    return (
        <div className="container mx-auto mt-2 h-[5.4in] ">
            <div className="container flex flex-col text-center items-center ">
                <div className="container text-left pl-1 bg-indigo-900 bg-opacity-50 rounded-2xl  rounded-s-sm">
                    <h1 className='text-lg font-bold'>
                        Chat
                    </h1>
                </div>
                <div className="container relative flex flex-col mx-1  p-1 gap-3 mt-2 rounded-xl bg-opacity-15 hover:bg-opacity-20">
                    {
                        newChat
                            ?
                            <>
                                <input
                                    type='text'
                                    placeholder='Search'
                                    name='Search'
                                    // value={inputValues.EmailIDOrPhoneNo}
                                    onChange={searchHandler}
                                    className="absolute right-0 font-normal text-slate-100 text-base bg-slate-950 my-2 mx-0 py-1 px-2 rounded-lg rounded-b-sm w-full drop-shadow shadow-md hover:shadow-blue-600 duration-150 "
                                >
                                </input>
                                <select
                                    required
                                    name='topFiveMatched'
                                    value=""
                                    // onChange={handleChange}
                                    className="text-base font-normal text-slate-400 my-2 mx-0 py-1 px-2 mt-10 w-full border-none rounded-lg rounded-t-sm bg-slate-950 cursor-pointer"
                                >
                                    <option value="" disabled hidden>Please Choose </option>
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="China">China</option>
                                    <option value="Canada">Canada</option>
                                    <option value="UK">UK</option>
                                </select>
                            </>
                            :
                            <>
                                <button type='submit' onClick={newChatHandler} className='absolute right-0 font-bold cursor-pointer text-slate-300 bg-blue-800 hover:bg-blue-700 my-1 mx-0 p-1 px-4 rounded-lg w-1/2 duration-150'>
                                    New Chat
                                </button>
                                <div className="container mx-1 p-1 mt-8"></div>
                            </>
                    }
                </div>
                <div className="container flex mx-1 cursor-pointer p-1 gap-3 mt-3 rounded-xl bg-blue-500 bg-opacity-15 hover:bg-opacity-20 duration-75">
                    <div className="container w-1/6 rounded-full">
                        <div className='curser-pointer mt-1 hover:font-bold transition-none duration-100 right-0'>
                            <img className='w-9' src={UserIcon}></img>
                        </div>
                    </div>
                    <div className="container flex flex-col w-5/6 text-left">
                        <h1 className='text-lg font-bold'>Contact</h1>
                        <p className='text-sm'>msg</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact