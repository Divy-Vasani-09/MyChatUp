import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useOutletContext } from 'react-router-dom';
import SearchBarNewChat from './SearchBarNewChat';
import { FaEdit } from "react-icons/fa";
import UserIcon from 'C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/profile.png';
import axios from 'axios';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

function Contact() {
    const userData = JSON.parse(sessionStorage.getItem("userLoggedData"));
    const [isOpen, setIsOpen] = useState(false);

    const [newChat, setNewChat] = useState(false);
    const [newGroup, setNewGroup] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [chosenResult, setChosenResult] = useState('');

    const [conversationList, setConversationList] = useState([]);

    const [allData, setAllData] = useState([]);
    const [newGroupData, setNewGroupData] = useState([]);
    const [next, setNext] = useState(false);
    const [groupName, setGroupName] = useState('');

    const { setReceiverPass } = useOutletContext();
    const { setRoomInfo } = useOutletContext();
    const { inputRef } = useOutletContext();

    const handleEdit = () => {
        setIsOpen(!isOpen)
        setNewChat(false);
        setNewGroup(false);
        setNext(false);
        setNewGroupData([]);
        setGroupName('');
    }

    const newChatHandler = () => {
        setIsOpen(false);
        setNewChat(true);
    }

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

                    setNewChat(false);
                    setSearchResults([])
                    setChosenResult('')
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }, [chosenResult])

    const newGroupHandler = () => {
        axios.post('http://127.0.0.1:3002/allRegisteredData', { userData })
            .then(result => {
                console.log(result.data.allData);
                const formattedData = result.data.allData.map(item => ({
                    value: item._id,
                    label: `${item.UserName} (${item.EmailID})`
                }));
                setAllData(formattedData);
            })
            .catch(err => {
                console.log("Error in /allRegisteredData ", err);
            })
        setIsOpen(false);
        setNewGroup(true);
    }
    const styles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: '#1E293B',
            marginBottom: '5px',
            border: 'none',
            cursor: 'text'
        }),
        input: (base) => ({
            ...base,
            color: 'white',
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: 'gray',
            cursor: 'pointer',
            '&:hover': {
                color: 'white',
            },
        }),
        clearIndicator: (base) => ({
            ...base,
            color: 'gray',
            cursor: 'pointer',
            '&:hover': {
                color: 'white',
            },
        }),
        option: (base, state) => ({
            ...base,
            cursor: 'pointer',
            color: 'white',
            backgroundColor: '#1E293B',
            borderBottom: '0.1px solid gray',
            '&:hover': {
                backgroundColor: '#1f212C',
            },
        }),
        menu: (base) => ({
            ...base,
            marginTop: '45px',
            border: 'none',
        }),
        menuList: (base) => ({
            ...base,
            paddingTop: 0,
            paddingBottom: 0,
        }),
    };

    const handleChange = (selectedOptions) => {
        setNewGroupData(selectedOptions);
    };
    const handleNext = () => {
        if (!newGroupData || newGroupData.length < 2) return;
        setNext(true);
    }

    const handleCancel = () => {
        setNext(false);
        setNewGroup(false);
        setNewGroupData([]);
        setGroupName('');
    }

    const handleGroupName = (e) => {
        setGroupName(e.target.value)
    }

    const handleCreateGroup = () => {
        console.log("!newGroupData", !newGroupData, "newGroupData.length", newGroupData.length)
        if (newGroupData.length < 2) return;
        console.log(groupName.length)
        if (groupName.length < 1) return;
        console.log("create")

        axios.post('http//127.0.0.1:3002/createGroup', { newGroupData, groupName, userData })
            .then(result => {
                console.log(result)
            })
            .catch(err => {
                console.log(err)
            })
    }


    useEffect(() => {
        if (conversationList.length == 0 && userData !== '') {
            axios.post('http://127.0.0.1:3002/contact', { userData })
                .then(result => {
                    console.log(result);
                    if (result.status === 204) return;
                    for (let element of result.data.conversations) {
                        if (element.participants[0].EmailID === userData.EmailID) {
                            let newConversationData = {
                                conversation_id: element._id,
                                senderInfo: element.participants[0],
                                receiverInfo: element.participants[1],
                            };
                            setConversationList((prev) => [newConversationData, ...prev]);
                        }
                        if (element.participants[1].EmailID === userData.EmailID) {
                            let newConversationData = {
                                conversation_id: element._id,
                                senderInfo: element.participants[1],
                                receiverInfo: element.participants[0],
                            };
                            setConversationList((prev) => [newConversationData, ...prev]);
                        }
                    }
                })
                .catch(err => {
                    console.log("Error in /contact ", err);
                })
        }
    }, [])


    const conversationHandler = async (result) => {
        setReceiverPass(true);
        setRoomInfo(result);
        if (inputRef?.current) {
            inputRef.current.focus();
        }
    }


    return (
        <div className="w-full mx-auto mt-2 min-h-[84.6vh] max-h-[84.6vh]">
            <div className="flex flex-col w-full text-center items-center ">
                <div className="flex flex-col w-full p-1 gap-3 rounded-xl">
                    <div className="relative cursor-text text-left my-[3px] h-[25px] rounded-[12px] w-full">
                        <div
                            id="dropdownDefaultButton"
                            className="cursor-default flex w-full h-full p-2 rounded-[12px] justify-between items-center self-stretch"
                        >
                            <div className="cursor-text text-white text-lg font-bold">
                                Chat
                            </div>
                            <div
                                onClick={handleEdit}
                                className="cursor-pointer text-xl rounded-full bg-slate-800 border-[0.01px] border-slate-600 p-2 hover:bg-slate-950 hover:border-slate-500 duration-300"
                            >
                                <FaEdit />
                            </div>
                        </div>
                        {isOpen && (
                            <div className="mt-2 bg-[#1d2024] w-full">
                                <ul className="absolute z-10 bg-[#1e2125] flex flex-col w-10/12 right-0 ">
                                    <li
                                        onClick={newChatHandler}
                                        className="cursor-pointer bg-slate-900 w-full h-[35px] px-[24px] py-1 flex self-stretch border-b-[1px] border-slate-700 hover:bg-slate-800"
                                    >
                                        <p
                                            className="w-full mx-auto my-auto"
                                        >
                                            New Chat
                                        </p>
                                    </li>
                                    <li
                                        onClick={newGroupHandler}
                                        className="cursor-pointer bg-slate-900 w-full h-[35px] px-[24px] py-1 self-stretch border-b-[1px] border-slate-700 hover:bg-slate-800"
                                    >
                                        <p
                                            className=" "
                                        >
                                            New Group
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        )}
                        {
                            newChat &&
                            <>
                                <div className="mt-2 bg-[#272B30] rounded-[12px] w-1/4">
                                    <ul className="absolute z-10 bg-[#272B30] w-full rounded-[12px]">
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
                                    </ul>
                                </div>
                            </>
                        }
                        {
                            newGroup &&
                            <>
                                <div className="mt-2 bg-slate-800 rounded-[12px] w-1/4">
                                    <div className="absolute z-10 bg-slate-800 w-full rounded-[12px]">
                                        {
                                            next
                                                ?
                                                <input
                                                    type='text'
                                                    placeholder='Enter Group Name...'
                                                    name='groupName'
                                                    value={groupName}
                                                    onChange={(e) => handleGroupName(e)}
                                                    autoFocus
                                                    autoComplete="off"
                                                    className="text-white bg-slate-800 my-1 py-1 px-2 w-full outline-none rounded-md border-[1px] border-slate-500 hover:bg-slate-900 hover:border-slate-400 duration-200"
                                                >
                                                </input>
                                                :
                                                < Select
                                                    closeMenuOnSelect={false}
                                                    components={animatedComponents}
                                                    isMulti
                                                    autoFocus
                                                    value={newGroupData}
                                                    onChange={handleChange}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleNext()
                                                            console.log("hi")
                                                        }
                                                    }}
                                                    options={allData}
                                                    styles={styles}
                                                />
                                        }
                                        <li
                                            className=" relative w-full h-[35px] gap-1 flex self-stretch"
                                        >
                                            {
                                                next
                                                    ?
                                                    <button
                                                        onClick={handleCreateGroup}
                                                        className="cursor-pointer w-full rounded-md border-[1px] border-slate-500 hover:bg-slate-900 hover:border-slate-400 duration-200"
                                                    >
                                                        Create
                                                    </button>
                                                    :
                                                    <button
                                                        onClick={handleNext}
                                                        className="cursor-pointer w-full rounded-md border-[1px] border-slate-500 hover:bg-slate-900 hover:border-slate-400 duration-200"
                                                    >
                                                        Next
                                                    </button>
                                            }
                                            <button
                                                onClick={handleCancel}
                                                className="cursor-pointer w-full rounded-md border-[1px] border-slate-500 hover:bg-slate-900 hover:border-slate-400 duration-200"
                                            >
                                                Cancel
                                            </button>

                                        </li>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
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