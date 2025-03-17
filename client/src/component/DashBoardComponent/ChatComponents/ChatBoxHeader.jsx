import React, { useEffect, useRef, useState } from 'react'
import UserIcon from 'C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/profile.png';
import { IoCallOutline } from "react-icons/io5";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from 'react-router-dom';
import axios from 'axios';
// import VoiceCall from './VoiceCall ';

export default function ChatBoxHeader({ socket, userData, roomInfo, setRoomInfo, status, chats, setChats }) {
    const userId = userData?._id;
    const receiverInfo = roomInfo?.receiverInfo;
    const blockIds = roomInfo.blockedIds;
    const checkBlockStatus = () => {
        if (blockIds.length < 0) {
            return false;
        }
        for (let element of blockIds) {
            if (element === receiverInfo._id) {
                return true;
            }
            return false;
        }
    }
    const isBlocked = checkBlockStatus();

    const [isThreeDots, setIsThreeDots] = useState(false);
    const threeDotsRef = useRef();

    const [isOverview, setIsOverview] = useState(false);
    const [isClearChat, setIsClearChat] = useState(false);

    const [isReport, setIsReport] = useState(false);
    const [report, setReport] = useState({
        reportMessage: '',
        reportMessageErr: false,
    });
    const [isBlock, setIsBlock] = useState(false);
    const [isUnBlock, setIsUnBlock] = useState(false);

    const defaultClearFor = {
        me: false,
        everyone: false
    };
    const [clearFor, setClearFor] = useState(defaultClearFor);
    const [unActiveIds, setUnActiveIds] = useState([])

    const handleThreeDots = () => {
        setIsThreeDots(!isThreeDots);
        setIsReport(false);
        setIsBlock(false);
        setIsClearChat(false);
        setIsOverview(true);
    }

    const handleOverview = () => {
        setIsClearChat(false);
        setIsOverview(true);
    }
    const handleClearChat = () => {
        setIsClearChat(true);
        setIsOverview(false);
        setIsReport(false);
        setIsBlock(false);
    }

    const imageRef = useRef();
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleFullscreenClick = () => {
        if (isFullscreen) {
            document.exitFullscreen();
        } else {
            imageRef.current?.requestFullscreen(); // Correctly accessing current
        }
        setIsFullscreen(!isFullscreen);
    };

    const onSubmitBlock = () => {
        axios.post('http://127.0.0.1:3002/block', { userId, roomInfo, blockedId: receiverInfo?._id })
            .then(result => {
                console.log(result)

                socket.emit('block', { userId, roomInfo, blockedId: result.data.updatedConversation.blockedIds });

                setIsBlock(false);
            })
            .catch(err => console.log(err));
    }

    const onSubmitReport = () => {
        if (report.reportMessage.length < 5) {
            return setReport((prev) => ({
                ...prev,
                reportMessageErr: true
            }));
        }

        axios.post('http://127.0.0.1:3002/report', { userId, roomInfo, reportedId: receiverInfo._id, reportMessage: report.reportMessage })
            .then(result => {
                console.log(result)
                setIsReport(false);
                setReport((prev) => ({
                    ...prev,
                    reportMessage: ''
                }));
            })
            .catch(err => console.log(err))
    }
    const onSubmitReportAndBlock = () => {
        onSubmitBlock();
        onSubmitReport();
    }

    const handleReportCancel = () => {
        setIsReport(false);
        setReport((prev) => ({
            ...prev,
            reportMessage: ''
        }));
    }
    const onSubmitUnBlock = () => {
        console.log(roomInfo.conversation_id);

        axios.post('http://127.0.0.1:3002/unblock', { userId, roomInfo, blockedId: receiverInfo?._id })
            .then(result => {
                console.log(result)
                socket.emit('unblock', { userId, roomInfo, blockedId: result.data.updatedConversation.blockedIds });
                setIsUnBlock(false)
            })
            .catch(err => console.log(err))
    }

    const handleClearChatForMe = () => {
        setClearFor((prev) => ({
            ...prev,
            me: true
        }))
        setUnActiveIds([userId])
    }
    const handleClearChatForEveryone = () => {
        setClearFor((prev) => ({
            ...prev,
            everyone: true
        }))
        setUnActiveIds([userId, receiverInfo?._id]);
    }
    useEffect(() => {
        setTimeout(() => {
            axios.post('http://127.0.0.1:3002/clearChat', { userId, roomInfo, unActiveIds, chats })
                .then(result => {
                    console.log(result)
                    socket.emit('clearChatEffect', { roomInfo, unActiveIds, clearFor })
                    setIsThreeDots(!isThreeDots);
                    setIsClearChat(false);
                    setClearFor(defaultClearFor);
                    setUnActiveIds([]);
                })
                .catch(err => console.log(err))
          }, 100);

    }, [clearFor])

    useEffect(() => {
        if (!socket) return;
        const handleClearChat = (data) => {
            const chat = data.messages[0].messages;
            setChats(chat);
            console.log("Clear chat!");
        };

        socket.on('clearChat', handleClearChat)

        return () => {
            socket.off('clearChat', handleClearChat);
        }
    }, [clearFor]);

    useEffect(() => {
        socket.on('block', async (data) => {
            setRoomInfo((prev) => ({
                ...prev,
                blockedIds: data.blockedId
            }));
        });

        socket.on('unblock', async (data) => {
            setRoomInfo((prev) => ({
                ...prev,
                blockedIds: data.blockedId
            }));
        });

        return () => {
            socket.off('block');
            socket.off('unblock');
        }
    }, [isBlock, isUnBlock])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (threeDotsRef.current && !threeDotsRef.current.contains(event.target)) {
                setIsThreeDots(false);
                setIsReport(false);
            }
        };

        if (isThreeDots) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isThreeDots]);

    return (
        <div className='w-full h-full flex justify-between' >
            <div className="flex justify-start w-1/2 ">
                <div className="cursor-pointer my-auto mx-2 text-xl">
                    <img
                        className='w-8 h-8 rounded-full'
                        src={!receiverInfo.DP ? UserIcon : receiverInfo.DP}
                    />
                </div>
                <div className="flex flex-col justify-center gap-0">
                    <div className='p-0 m-0 '>
                        {roomInfo.receiverInfo.UserName}
                    </div>
                    <div className={`text-xs p-0 m-0 ${!status?.online ? 'text-slate-200' : 'text-green-300'}`}>
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
            <div className="relative flex justify-end w-1/2 ">
                <div
                    className="cursor-pointer my-auto mx-2 text-2xl rounded-full bg-slate-800 border-[0.01px] border-slate-600 p-1 hover:bg-slate-950 hover:border-slate-500 duration-300"
                >
                    {/* <VoiceCall channelName={roomInfo?.conversation_id}/> */}
                    <IoCallOutline />
                </div>
                <div
                    className="cursor-pointer my-auto mx-2 text-2xl rounded-full bg-slate-800 border-[0.01px] border-slate-600 p-1 hover:bg-slate-950 hover:border-slate-500 duration-300"
                >
                    <HiOutlineVideoCamera />
                </div>
                <div
                    onClick={handleThreeDots}
                    className="cursor-pointer my-auto mx-2 text-2xl rounded-full bg-slate-800 border-[0.01px] border-slate-600 p-1 hover:bg-slate-950 hover:border-slate-500 duration-300"
                >
                    <BsThreeDotsVertical />
                </div>
                {isThreeDots && (
                    <div
                        ref={threeDotsRef}
                        className="absolute z-10 flex mt-12 w-full right-2 gap-1"
                    >
                        {
                            isOverview && (
                                isReport ? (
                                    <ul className="Report flex flex-col justify-center gap-4 w-full p-3 mx-auto bg-slate-800 rounded-md shadow-slate-950 drop-shadow shadow-md">
                                        <li className="w-full px-1">
                                            <h4 className="text-lg p-0 flex">
                                                Report to&nbsp;
                                                <p className='font-semibold'>M</p>
                                                <p className='text-base italic'>y</p>
                                                <p className='font-semibold'>C</p>
                                                <p className='italic'>hat</p>
                                                <p className='font-semibold'>MX</p>
                                            </h4>
                                            <p className="text-sm">The last 5 messages in this chat will be sent to MyChatMX.</p>
                                        </li>
                                        <div className="container w-full mx-auto flex flex-col justify-center">
                                            <input
                                                type='text'
                                                maxLength={50}
                                                placeholder='Enter Your Report'
                                                name='reportMessage'
                                                value={report.reportMessage}
                                                onChange={(e) => {
                                                    setReport((prev) => ({
                                                        ...prev,
                                                        reportMessage: e.target.value
                                                    }));
                                                }}
                                                className={`font-normal text-base bg-slate-950 mx-auto py-1 px-3 rounded-lg w-full outline-none drop-shadow shadow-sm hover:shadow-slate-300 border-2 border-solid border-slate-950 duration-300`}
                                            >
                                            </input>
                                            {/* {inputValuesErr.UserName === true && <p className='text-red-600'>{inputValues.UserName === '' ? 'Enter Your User Name' : 'Your UserName is inValid'}</p>} */}
                                        </div>
                                        <li className='flex justify-center'>
                                            <button
                                                onClick={onSubmitReportAndBlock}
                                                className='bg-slate-600 px-7 py-1 rounded hover:bg-slate-700 duration-150'
                                            >
                                                Report and Block
                                            </button>
                                        </li>
                                        <li className='flex justify-center gap-5'>
                                            <button
                                                onClick={onSubmitReport}
                                                className='bg-slate-600 px-4 py-1 rounded hover:bg-slate-700 duration-150'
                                            >
                                                Report
                                            </button>
                                            <button
                                                onClick={handleReportCancel}
                                                className='bg-slate-600 px-4 py-1 rounded hover:bg-slate-700 duration-150'
                                            >
                                                Cancel
                                            </button>
                                        </li>
                                    </ul>
                                ) : isBlock || isUnBlock ? (
                                    <ul className="Block flex flex-col justify-center gap-4 w-full p-3 mx-auto bg-slate-800 rounded-md shadow-slate-950 drop-shadow shadow-md">
                                        <li className="w-full flex flex-col p-0">
                                            <h4 className="text-base font-medium p-0">
                                                {isUnBlock && 'Un'}Block {receiverInfo.UserName}?
                                            </h4>
                                            <p className="text-sm">
                                                This person {isUnBlock ? 'now will' : "won't"} be able to message or call you.
                                            </p>
                                        </li>
                                        <li className='flex justify-evenly'>
                                            {isUnBlock ?
                                                <button
                                                    onClick={onSubmitUnBlock}
                                                    className='text-red-400 bg-slate-600 px-4 py-1 rounded hover:bg-slate-700 duration-150'
                                                >
                                                    UnBlock
                                                </button>
                                                :
                                                <button
                                                    onClick={onSubmitBlock}
                                                    className='text-red-400 bg-slate-600 px-4 py-1 rounded hover:bg-slate-700 duration-150'
                                                >
                                                    Block
                                                </button>
                                            }
                                            <button
                                                onClick={() => { setIsBlock(false), setIsUnBlock(false) }}
                                                className='bg-slate-600 px-4 py-1 rounded hover:bg-slate-700 duration-150'
                                            >
                                                Cancel
                                            </button>
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="Overview flex flex-col justify-center gap-4 w-full p-3 mx-auto bg-slate-800 rounded-md shadow-slate-950 drop-shadow shadow-md">
                                        <li className="w-full flex flex-col justify-center mx-auto">
                                            <div className="mx-auto">
                                                <img
                                                    src={!receiverInfo.DP ? UserIcon : receiverInfo.DP}
                                                    ref={imageRef}
                                                    onClick={handleFullscreenClick}
                                                    className="cursor-pointer h-[7rem] w-[7rem] resize object-cover rounded-full"
                                                />
                                            </div>
                                            <p className="text-lg mx-auto">{receiverInfo.UserName}</p>
                                        </li>
                                        <li className="w-full p-0">
                                            <h4 className="text-sm p-0">About</h4>
                                            <p className="text-base">{receiverInfo.About}</p>
                                        </li>
                                        <li className="w-full flex flex-col p-0">
                                            <h4 className="text-sm p-0">Phone Number</h4>
                                            <p className="text-base">+91 {receiverInfo.PhoneNo}</p>
                                        </li>
                                        <li className="flex gap-1 justify-around">
                                            {
                                                isBlocked ?
                                                    <button
                                                        onClick={() => setIsUnBlock(true)}
                                                        className="bg-slate-600 px-3 py-1 rounded hover:bg-slate-700"
                                                    >
                                                        UnBlock
                                                    </button>
                                                    :
                                                    <button
                                                        onClick={() => setIsBlock(true)}
                                                        className="bg-slate-600 px-3 py-1 rounded hover:bg-slate-700"
                                                    >
                                                        Block
                                                    </button>
                                            }
                                            <button
                                                onClick={() => setIsReport(true)}
                                                className="text-red-400 bg-slate-600 px-3 py-1 rounded hover:bg-slate-700"
                                            >
                                                Report contact
                                            </button>
                                        </li>
                                    </ul>
                                )
                            )
                        }
                        {
                            isClearChat &&
                            <ul className="flex flex-col justify-center gap-4 w-full p-3 mx-auto bg-slate-800 rounded-md shadow-slate-950 drop-shadow shadow-md">
                                <li
                                    className='w-full mb-1 flex flex-col'
                                >
                                    <p className='text-lg mx-auto flex justify-center'>
                                        Are you sure for clear chat?
                                    </p>
                                </li>

                                <li className='flex mx-auto justify-around w-full self-stretch'>
                                    <button
                                        onClick={handleClearChatForEveryone}
                                        className="cursor-pointer w-full py-1 rounded-md border-[1px] border-slate-500 hover:bg-slate-900 hover:border-slate-400 duration-200"
                                    >
                                        Clear for everyone
                                    </button>
                                </li>
                                <li className='flex mx-auto gap-2 justify-around w-full self-stretch'>
                                    <button
                                        onClick={handleClearChatForMe}
                                        className="cursor-pointer w-full py-1 rounded-md border-[1px] border-slate-500 hover:bg-slate-900 hover:border-slate-400 duration-200"
                                    >
                                        Clear for me
                                    </button>
                                    <button
                                        onClick={handleThreeDots}
                                        className="cursor-pointer w-full py-1 rounded-md border-[1px] border-slate-500 hover:bg-slate-900 hover:border-slate-400 duration-200"
                                    >
                                        Cancel
                                    </button>
                                </li>
                            </ul>
                        }
                        <ul className="flex flex-col w-8/12 ">
                            <div className='shadow-slate-950 drop-shadow shadow-md'>
                                <li
                                    onClick={handleOverview}
                                    className={`cursor-pointer ${!isOverview ? 'bg-slate-900' : 'bg-slate-800'}  w-full h-[35px] px-[24px] py-1 flex self-stretch border-b-[1px] border-slate-700 rounded-t-lg  hover:bg-slate-800 duration-200`}
                                >
                                    <p
                                        className="w-full mx-auto my-auto"
                                    >
                                        Overview
                                    </p>
                                    {
                                        isOverview &&
                                        <div className='bg-white rounded-lg h-5 w-1 mx-auto my-auto'>&nbsp;</div>
                                    }
                                </li>
                                <li
                                    onClick={handleClearChat}
                                    className={`cursor-pointer ${!isClearChat ? 'bg-slate-900' : 'bg-slate-800'} w-full h-[35px] px-[24px] py-1 flex self-stretch border-b-[1px] border-slate-700 rounded-b-lg hover:bg-slate-800 duration-200`}
                                >
                                    <p
                                        className="w-full mx-auto my-auto"
                                    >
                                        Clear chat
                                    </p>
                                    {
                                        isClearChat &&
                                        <div className='bg-white rounded-lg h-5 w-1 mx-auto my-auto'>&nbsp;</div>
                                    }
                                </li>
                            </div>
                        </ul>
                    </div>
                )}
            </div>
        </div >
    )
}
