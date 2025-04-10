import React, { useContext, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { BsFillTelephoneOutboundFill } from "react-icons/bs";
import axios from "axios";
import API_URL from "../../config";

export default function CallHistory() {
  const userData = JSON.parse(sessionStorage.getItem("userLoggedData"));

  const { socket } = useOutletContext();
  const { callList } = useOutletContext();
  const { setCallList } = useOutletContext();
  const { callInfo } = useOutletContext();
  const { setCallInfo } = useOutletContext();
  const { setIsCall } = useOutletContext();
  const { setIsChat } = useOutletContext();

  useEffect(() => {
    if (callList.length === 0 && userData !== "") {
      axios.post(`${API_URL}/callHistory`, { userData })
        .then(result => {
          console.log(result);
          if (result.status === 204) return;
          for (let element of result.data.calls) {
            if (element.caller._id === userData._id) {
              console.log(element.caller._id)
              let newCallData = {
                call_id: element._id,
                caller: element?.caller,
                receiver: element?.receiver,
                calling: "Outgoing",
                callType: element?.callType,
                status: element?.status,
                startedAt: element?.startedAt,
                endedAt: element?.endedAt,
                duration: element?.duration,
                createdAt: element?.createdAt,
                updatedAt: element?.updatedAt,
              };

              setCallList((prev) => [newCallData, ...prev]);
            }
            if (element.receiver._id === userData._id) {
              console.log(element.receiver._id)
              let newCallData = {
                call_id: element._id,
                caller: element?.caller,
                receiver: element?.receiver,
                calling: "Incoming",
                callType: element?.callType,
                status: element?.status,
                startedAt: element?.startedAt,
                endedAt: element?.endedAt,
                duration: element?.duration,
                createdAt: element?.createdAt,
                updatedAt: element?.updatedAt,
              };

              setCallList((prev) => [newCallData, ...prev]);
            }
          }
        })
        .catch(err => {
          console.log("Error in /callHistory ", err);
        })
    }
  }, [])

  const callHandler = async (result) => {
    setIsChat(false);
    setIsCall(true);
    setCallInfo(result);
  }

  return (
    <div className="w-full mx-auto mt-2 h-full">
      <div className="flex flex-col w-full h-full text-center items-center">
        <div className="flex flex-col w-full p-1 gap-3 rounded-xl">
          <div className="relative cursor-text text-left my-[3px] h-[25px] rounded-[12px] w-full">
            <div
              className="cursor-default flex w-full h-full p-2 rounded-[12px] justify-between items-center self-stretch"
            >
              <div className="cursor-text text-white text-lg font-bold">
                Calls
              </div>
            </div>
          </div>
        </div>
        <div className="container overflow-y-scroll no-scrollbar scroll-smooth p-1 w-full ">
          {(() => {
            let lastDate = null;

            return callList
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map((result, id) => {
                const now = new Date(result.updatedAt);
                const date = now.toLocaleDateString();
                const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

                lastDate = date;
                return <div
                  key={id}
                  data={result}
                  className="flex items-center cursor-pointer p-2 gap-3 mt-3 mx-auto w-[95%] rounded-xl bg-opacity-95 hover:shadow-slate-500 drop-shadow shadow-sm hover:bg-slate-700 duration-300"
                  onClick={() => { callHandler(result) }}
                >
                  <div className="w-[36px] h-[36px] rounded-full flex flex-col justify-center items-center ">
                    <div className="w-[30px] h-[30px] curser-pointer">
                      {
                        result.caller._id === userData._id ?
                          (
                            !result.receiver.DP ?
                              <FaUserCircle className="text-3xl" />
                              :
                              <img
                                className="w-[30px] h-[30px] rounded-full"
                                src={!result.receiver.DP ? UserIcon : result?.receiver?.DP}
                              />
                          ) : (
                            !result.caller.DP ?
                              <FaUserCircle className="text-3xl" />
                              :
                              <img
                                className="w-[30px] h-[30px] rounded-full"
                                src={!result.caller.DP ? UserIcon : result?.caller?.DP}
                              />
                          )
                      }
                    </div>
                  </div>
                  <div className="container flex flex-col w-4/6 text-left gap-1">
                    <h1 className="text-base sm:text-xs font-bold">
                      {
                        result.caller._id === userData._id ?
                          (result.receiver.UserName)
                          :
                          (result.caller.UserName)
                      }
                    </h1>
                    <div className={` flex items-center text-xs sm:text-[10px] truncate ${result.status === "missed" && result.calling === "Incoming" ? "text-red-400" : ""}`}>
                      {
                        result.calling === "Incoming" ?
                          <BsFillTelephoneInboundFill className="text-[10px]" />
                          :
                          <BsFillTelephoneOutboundFill className="text-[10px]" />
                      }&nbsp;
                      {
                        result.calling === "Incoming" ?
                          result.status === "missed" ?
                            result.status
                            :
                            result.calling
                          :
                          result.calling
                      }
                    </div>
                  </div>
                  <div className="container flex justify-end w-1/6 text-right bg-green-00 m-1 -mt-3 gap-1 ">
                    <h1 className="text-[11px]">
                      {date && date}
                    </h1>
                  </div>
                </div>
              })
          })()}
        </div>
      </div>
    </div>
  )
}
