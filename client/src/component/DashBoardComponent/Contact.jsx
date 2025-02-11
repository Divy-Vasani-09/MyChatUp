import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useOutletContext } from 'react-router-dom';
import SearchBarNewChat from './SearchBarNewChat';
import UserIcon from 'C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/profile.png';
import axios from 'axios';

function Contact() {
    const userData = JSON.parse(sessionStorage.getItem("userLoggedData"));
    const [newChat, setNewChat] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [chosenResult, setChosenResult] = useState('');
    const [conversationList, setConversationList] = useState([]);

    const { setReceiverPass } = useOutletContext();
    const { setRoomInfo } = useOutletContext();

    const newChatHandler = () => {
        setNewChat(true)
    }

    useEffect(() => {
        if (conversationList.length == 0 && userData !== '') {
            axios.post('http://127.0.0.1:3002/contact', { userData })
                .then(result => {
                    console.log(result);

                    for (let element of result.data.conversations) {
                        let newConversationData = {
                            conversation_id: element._id,
                            senderInfo: element.participants[0],
                            receiverInfo: element.participants[1],
                        };
                        setConversationList((prev) => [newConversationData, ...prev]);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [])

    const newChatChooseHandle = async (result) => {
        const newChosen = {
            _id: result._id,
            UserName: result.UserName,
            PhoneNo: result.PhoneNo,
            EmailID: result.EmailID,
        }
        setChosenResult(newChosen);
    }

    useEffect(() => {
        if (chosenResult !== '') {
            axios.post('http://127.0.0.1:3002/newChat', { chosenResult, userData })
                .then(result => {
                    console.log(result);
                    const newConversation = result.data.newConversation;
                    let newConversationData = {
                        conversation_id: newConversation._id,
                        senderInfo: newConversation.participants[0],
                        receiverInfo: newConversation.participants[1],
                    };
                    setConversationList((prev) => [newConversationData, ...prev]);
                })
                .catch(err => {
                    console.log(err);
                })
        }
        setNewChat(false);
        setSearchResults([])
        setChosenResult('')

    }, [chosenResult])

    const conversationHandler = async (result) => {
        setReceiverPass(true);
        console.log(result)
        setRoomInfo(result);
    }

    return (
        <div className="container mx-auto mt-2 h-[5.4in] ">
            <div className="container flex flex-col text-center items-center ">
                <div className="container text-left pl-2 bg-opacity-50 rounded-2xl rounded-s-sm">
                    <h1 className='text-lg font-bold'>
                        Chat
                    </h1>
                </div>
                <div className="container relative flex flex-col mx-1 p-1 gap-3 mt-2 rounded-xl  ">
                    {
                        newChat
                            ?
                            <>
                                <SearchBarNewChat
                                    setSearchResults={setSearchResults}
                                    userData={userData}
                                />
                                <div className="container">
                                    <div
                                        className="container result-List absolute top-12 flex flex-col items-center bg-slate-900 z-10 w-full max-h-52 py-1 mr-12 rounded-lg drop-shadow shadow-md"
                                    >
                                        {
                                            searchResults.slice(0, 5).map((result, id) => {
                                                return <button
                                                    key={id}
                                                    data-id={result._id}
                                                    data-username={result.UserName}
                                                    onClick={() => newChatChooseHandle(result)}
                                                    className="text-sm p-1 my-1 border-b-2 border-slate-400 rounded-md w-11/12 hover:bg-slate-700 "
                                                >
                                                    {result.UserName} &nbsp; {result.PhoneNo}
                                                </button>
                                            })
                                        }
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <button
                                    type='submit'
                                    onClick={newChatHandler}
                                    className='font-bold cursor-pointer text-slate-300 bg-blue-900 hover:bg-blue-800 my-1 mx-0 ml-1 p-1 px-4 rounded-lg w-1/2 duration-150'
                                >
                                    New Chat
                                </button>
                            </>
                    }
                </div>
                <div className="container overflow-y-scroll no-scrollbar scroll-smooth max-h-[4.2in] ">
                    {
                        conversationList.map((result, id) => {
                            return <div
                                key={id}
                                data={result}
                                className="container flex cursor-pointer p-2 gap-3 mt-3 mx-auto w-[95%] rounded-xl bg-slate-700 bg-opacity-95 shadow-slate-500 drop-shadow shadow-sm hover:bg-slate-800 duration-150"
                                onClick={() => { conversationHandler(result) }}
                            >
                                <div className="container w-1/6 rounded-full">
                                    <div className='curser-pointer mt-1 hover:font-bold transition-none duration-100 right-0'>
                                        <img
                                            className='w-9'
                                            src={UserIcon}
                                        />
                                    </div>
                                </div>
                                <div className="container flex flex-col w-5/6 text-left gap-1">
                                    <h1 className='text-base font-bold'>
                                        {result.receiverInfo.UserName}
                                    </h1>
                                    <p className='text-sm'>
                                        messages
                                    </p>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Contact