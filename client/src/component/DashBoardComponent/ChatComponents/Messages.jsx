import React, { useEffect, useRef, useState } from "react"
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { BsFillTelephoneOutboundFill } from "react-icons/bs";
import LoaderOfNewMessages from "./LoaderOfNewMessages";

export default function Messages({
  chats,
  userData,
  loadMoreMessage,
  setLoadMoreMessage,
  hasMore,
  scrollMessages,
  setScrollMessages,
}) {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRefs = useRef([]);

  const handleFullscreenClick = (id) => {
    {
      isFullscreen
        ?
        document.exitFullscreen()
        :
        imageRefs.current[id]?.requestFullscreen()
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (loadMoreMessage) return;

    setTimeout(() => {
      if (messagesEndRef.current && scrollMessages) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 500);
  }, [chats]);

  const handleScroll = async () => {
    if (chatContainerRef.current.scrollTop === 0 && hasMore) {
      setLoadMoreMessage(true);
      setScrollMessages(false)

      const chatContainer = chatContainerRef.current;
      const previousScrollHeight = chatContainer.scrollHeight;

      chatContainer.style.scrollBehavior = "auto";

      setTimeout(() => {
        setLoadMoreMessage(false);

        requestAnimationFrame(() => {
          const newScrollHeight = chatContainer.scrollHeight;
          chatContainer.scrollTop = newScrollHeight - previousScrollHeight;

          setTimeout(() => {
            chatContainer.style.scrollBehavior = "smooth";
          }, 100);
        });
      }, 500);
    }
  };

  return (
    <div className="w-full h-full p-1 text-white">
      {
        !chats || chats.length === 0
          ?
          <div className="container flex w-full h-full rounded-xl">
            <h1 className="w-full flex justify-center items-center font-bold">
              No Messages
            </h1>
          </div>
          :
          <div
            ref={chatContainerRef}
            id="chat-container"
            className="w-full h-full overflow-y-auto scroll-smooth "
            onScroll={handleScroll}
          >
            {
              loadMoreMessage && (
                <div className="flex justify-center">
                  <div className="p-1 text-center text-xs mx-auto ">
                    <LoaderOfNewMessages />
                  </div>
                </div>
              )
            }
            {(() => {
              let lastDate = null;

              return chats
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((result, id) => {
                  const now = new Date(result.createdAt);
                  const date = now.toLocaleDateString();
                  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                  const showHeader = date !== lastDate;
                  lastDate = date;

                  return (
                    <div className="" key={id}>
                      {
                        showHeader && (
                          <div className="flex justify-center my-1">
                            <h2 className="p-1 text-center text-sm text-slate-300 mx-auto bg-slate-800 hover:bg-slate-700 rounded-md">
                              {date}
                            </h2>
                          </div>
                        )}
                      {
                        result.sender._id === userData._id
                          ?
                          <div className="flex justify-self-end m-1 p-1 pr-2 bg-slate-700 rounded-lg">
                            {
                              result.messageType === "image"
                                ?
                                <div className="flex flex-col">
                                  <img
                                    src={result.image}
                                    ref={(el) => (imageRefs.current[id] = el)}
                                    onClick={() => handleFullscreenClick(id)}
                                    className="p-1 w-32 whitespace-pre-line"
                                  />
                                  {result.message ?
                                    <p className="p-1 whitespace-pre-line">
                                      {result.message}
                                    </p> : <></>
                                  }
                                  <div className="text-xs text-slate-300 flex justify-end">
                                    {time}
                                  </div>
                                </div>
                                :
                                result.messageType === "video"
                                  ?
                                  <div className="flex flex-col">
                                    <video
                                      width="750"
                                      height="500"
                                      controls
                                      className="cursor-pointer p-1 w-40 h-44 whitespace-pre-line"
                                    >
                                      <source src={result.video} type="video/mp4" />
                                    </video>
                                    {result.message ?
                                      <p className="p-1 whitespace-pre-line">
                                        {result.message}
                                      </p> : <></>
                                    }
                                    <div className="text-xs text-slate-300 flex justify-end">
                                      {time}
                                    </div>
                                  </div>
                                  :
                                  result.messageType === "VoiceCall"
                                    ?
                                    <div className="w-full flex flex-col">
                                      <div className="w-44 flex gap-2 items-center p-1">
                                        <div
                                          className="flex items-center rounded-full border-[1px] border-slate-500 p-2 "
                                        >
                                          <BsFillTelephoneOutboundFill />
                                        </div>
                                        <div className="w-full items-center">
                                          <div>
                                            {result?.call?.callType} call
                                          </div>
                                          <div className="text-xs">
                                            {result?.call?.duration ? (
                                              (() => {
                                                const totalSeconds = Math.floor(result.call.duration);
                                                const hours = Math.floor(totalSeconds / 3600);
                                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                                const seconds = totalSeconds % 60;

                                                return `${hours > 0 ? `${hours} hour ` : ""}${minutes > 0 ? `${minutes} minutes ` : ""}${seconds} seconds`;
                                              })()
                                            ) : (
                                              "No answer"
                                            )
                                            }
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-xs text-slate-300 flex justify-end">
                                        {time}
                                      </div>
                                    </div>
                                    :
                                    <>
                                      <p className="p-1 whitespace-pre-line">
                                        {result.message}
                                      </p>
                                      <div className="text-xs text-slate-300 flex flex-col-reverse">
                                        {time}
                                      </div>
                                    </>
                            }
                          </div>
                          :
                          <div className="flex justify-self-start m-1 p-1 pr-2 bg-slate-800 rounded-lg">
                            {
                              result.messageType === "image"
                                ?
                                <div className="flex flex-col">
                                  <img src={result.image}
                                    ref={(el) => (imageRefs.current[id] = el)}
                                    onClick={() => handleFullscreenClick(id)} alt="" className="p-1 w-32 whitespace-pre-line"
                                  />
                                  {result.message ?
                                    <p className="p-1 whitespace-pre-line">
                                      {result.message}
                                    </p> : <></>
                                  }
                                  <div className="text-xs text-slate-300 flex justify-end">
                                    {time}
                                  </div>
                                </div>
                                :
                                result.messageType === "video"
                                  ?
                                  <div className="flex flex-col">
                                    <video
                                      width="750"
                                      height="500"
                                      controls
                                      className="cursor-pointer p-1 w-40 h-44 whitespace-pre-line"
                                    >
                                      <source src={result.video} type="video/mp4" />
                                    </video>
                                    {result.message ?
                                      <p className="p-1 whitespace-pre-line">
                                        {result.message}
                                      </p> : <></>
                                    }
                                    <div className="text-xs text-slate-300 flex justify-end">
                                      {time}
                                    </div>
                                  </div>
                                  :
                                  result.messageType === "VoiceCall"
                                    ?
                                    <div className="w-full flex flex-col">
                                      <div className="w-44 flex gap-2 items-center p-1">
                                        <div
                                          className="flex items-center rounded-full border-[1px] border-slate-500 p-2 "
                                        >
                                          <BsFillTelephoneInboundFill className={`${result?.call?.status === "missed" && "text-red-400"}`} />
                                        </div>
                                        <div className="w-full items-center">
                                          <div>
                                            {result?.call?.status === "missed" && "Missed "}
                                            {result?.call?.callType} call
                                          </div>
                                          <div className="text-xs">
                                            {result?.call?.duration ? (
                                              (() => {
                                                const totalSeconds = Math.floor(result.call.duration);
                                                const hours = Math.floor(totalSeconds / 3600);
                                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                                const seconds = totalSeconds % 60;

                                                return `${hours > 0 ? `${hours} hour ` : ""}${minutes > 0 ? `${minutes} minutes ` : ""}${seconds} seconds`;
                                              })()
                                            ) : ( 
                                              result?.call?.status === "declined" ?
                                               "declined"
                                               :
                                              "Unanswered"
                                            )
                                            }
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-xs text-slate-300 flex justify-end">
                                        {time}
                                      </div>
                                    </div>
                                    :
                                    <>
                                      <p className="p-1 whitespace-pre-line">
                                        {result.message}
                                      </p>
                                      <div className="text-xs text-slate-300 flex flex-col-reverse">
                                        {time}
                                      </div>
                                    </>
                            }
                          </div>
                      }
                    </div>
                  )
                })
            })()}
            <div ref={messagesEndRef} />
          </div>
      }
    </div >
  )
}
