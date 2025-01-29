import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBarNewChat from './SearchBarNewChat'
import UserIcon from 'C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/profile.png'


function Contact() {
    const [newChat, setNewChat] = useState(false);
    const [searchResults, setSearchResults] = useState([])

    const newChatHandler = () => {
        setNewChat(true)
    }

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
                                <SearchBarNewChat setSearchResults={setSearchResults} />
                                <div className="container">
                                    <div className="container result-List absolute top-12 flex flex-col items-center bg-blue-900 opacity-95 w-full max-h-44 mr-12 rounded-lg drop-shadow shadow-md">
                                        {
                                            searchResults.slice(0, 5).map((result, id) => {
                                                return <Link  key={id} className="text-sm my-1 border-b-2 border-slate-400 rounded-full w-11/12 hover:bg-blue-800 hover:opacity-95">{result.UserName }&nbsp; { result.PhoneNo}</Link>
                                            })
                                        }
                                    </div>
                                </div>
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