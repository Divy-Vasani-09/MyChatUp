import React from "react"
import { IoMdArrowBack } from "react-icons/io";
import { MdPhoneMissed } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { MdCall } from "react-icons/md";

export default function CallBox({ setIsCall, callInfo }) {
    const userData = JSON.parse(sessionStorage.getItem("userLoggedData"));

    const outgoing = callInfo.caller._id === userData._id;
    const callType = callInfo.callType;
    const fullDate = new Date(callInfo.updatedAt);
    const date = fullDate.toLocaleDateString();
    const time = fullDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const handleGoBack = () => {
        setIsCall(false);
    }

    return (
        <>
            <div className="w-full h-[10%] flex items-center p-3 font-bold bg-slate-800 rounded-t-xl border-b-[0.2px] border-slate-700">
                <div
                    onClick={handleGoBack}
                    className="cursor-pointer sm:hidden my-auto mx-1 text-2xl"
                >
                    <IoMdArrowBack />
                </div>
                Call info
            </div>
            <div className="w-full h-[90%] bg-slate-900">
                <div
                    className="w-full my-1 p-3 bg-slate-800 drop-shadow-xl"
                >
                    <div className="w-full flex justify-items-start items-center gap-2">
                        {outgoing ?
                            <>
                                <div>
                                    {!callInfo.receiver.DP ?
                                        <FaUserCircle className="text-[40px]" />
                                        :
                                        <img
                                            className="w-[40px] h-[40px] rounded-full"
                                            src={!callInfo.receiver.DP ? UserIcon : callInfo?.receiver?.DP}
                                        />
                                    }
                                </div>
                                <div>
                                    {callInfo.receiver.UserName}
                                </div>
                            </>
                            :
                            <>
                                <div>
                                    {!callInfo.caller.DP ?
                                        <FaUserCircle className="text-[40px]" />
                                        :
                                        <img
                                            className="w-[40px] h-[40px] rounded-full"
                                            src={!callInfo.caller.DP ? UserIcon : callInfo?.caller?.DP}
                                        />
                                    }
                                </div>
                                <div>
                                    {callInfo.caller.UserName}
                                </div>
                            </>
                        }
                    </div>

                    <div className="w-full text-sm my-2">
                        {date}
                    </div>

                    <div className="w-full flex justify-between items-center gap-1 ">
                        <div className="flex justify-center items-center gap-1">
                            {outgoing ? (
                                <>
                                    <MdCall className="text-lg" />
                                    <p>Outgoing</p>
                                </>
                            ) : (
                                callInfo.status === "missed" ?
                                    <>
                                        <MdPhoneMissed className="text-lg text-red-400" />
                                        <p>Incoming</p>
                                    </>
                                    :
                                    <>
                                        <MdCall className="text-lg" />
                                        <p>Incoming</p>
                                    </>
                            )}&nbsp;
                            {callType} call at {time}
                        </div>
                        <div className="">
                            {callInfo?.duration ? (
                                (() => {
                                    const totalSeconds = Math.floor(callInfo.duration);
                                    const hours = Math.floor(totalSeconds / 3600);
                                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                                    const seconds = totalSeconds % 60;

                                    return `${hours > 0 ? `${hours} hour ` : ""}${minutes > 0 ? `${minutes} minutes ` : ""}${seconds} seconds`;
                                })()
                            ) : (
                                "Unanswered"
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
