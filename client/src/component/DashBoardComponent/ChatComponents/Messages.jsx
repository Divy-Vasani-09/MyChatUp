import React, { useEffect, useRef, useState } from 'react'

export default function Messages({ chats, userData }) {
  const messagesEndRef = useRef(null);

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
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  }, [chats])

  return (
    <div className='w-full h-full p-1 text-white'>
      {
        !chats || chats.length === 0
          ?
          <div className="container flex w-full h-full rounded-xl">
            <h1 className='w-full flex justify-center items-center font-bold'>
              No Messages
            </h1>
          </div>
          :
          <div className='w-full h-full overflow-y-auto scroll-smooth'>
            {(() => {
              let lastDate = null;

              return chats
                .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
                .map((result, id) => {
                  const now = new Date(result.updatedAt);
                  const date = now.toLocaleDateString();
                  const time = now.toLocaleTimeString();

                  const showHeader = date !== lastDate;
                  lastDate = date;

                  return (
                    <div className='' key={id}>
                      {
                        showHeader && (
                          <div className='flex justify-center'>
                            <h2 className='p-1 text-center text-sm text-slate-300 mx-auto bg-slate-800 rounded-md'>
                              {date}
                            </h2>
                          </div>
                        )}
                      {
                        result.sender._id === userData._id
                          ?
                          <div className='flex justify-self-end m-1 p-1 pr-2 bg-slate-700 rounded-lg'>
                            {
                              result.image
                                ?
                                <div className='flex flex-col'>
                                  <img src={result.image}
                                    ref={(el) => (imageRefs.current[id] = el)}
                                    onClick={() => handleFullscreenClick(id)} alt="" className='p-1 w-32 whitespace-pre-line' />
                                  <div className='text-xs text-slate-300 flex justify-end'>
                                    {time}
                                  </div>
                                </div>
                                :
                                result.video
                                  ?
                                  <div className='flex flex-col'>
                                    <video
                                      width="750"
                                      height="500"
                                      controls
                                      className='cursor-pointer p-1 w-40 h-44 whitespace-pre-line'
                                    >
                                      <source src={result.video} type="video/mp4" />
                                    </video>
                                    <div className='text-xs text-slate-300 flex justify-end'>
                                      {time}
                                    </div>
                                  </div>
                                  :
                                  <>
                                    <p className='p-1 whitespace-pre-line'>
                                      {result.message}
                                    </p>
                                    <div className='text-xs text-slate-300 flex flex-col-reverse'>
                                      {time}
                                    </div>
                                  </>
                            }
                          </div>
                          :
                          <div className='flex justify-self-start m-1 p-1 pr-2 bg-slate-800 rounded-lg'>
                            {
                              result.image
                                ?
                                <div className='flex flex-col'>
                                  <img src={result.image}
                                    ref={(el) => (imageRefs.current[id] = el)}
                                    onClick={() => handleFullscreenClick(id)} alt="" className='p-1 w-32 whitespace-pre-line' />
                                  <div className='text-xs text-slate-300 flex justify-end'>
                                    {time}
                                  </div>
                                </div>
                                :
                                result.video
                                  ?
                                  <div className='flex flex-col'>
                                    <video
                                      width="750"
                                      height="500"
                                      controls
                                      className='cursor-pointer p-1 w-40 h-44 whitespace-pre-line'
                                    >
                                      <source src={result.video} type="video/mp4" />
                                    </video>
                                    <div className='text-xs text-slate-300 flex justify-end'>
                                      {time}
                                    </div>
                                  </div>
                                  :
                                  <>
                                    <p className='p-1 whitespace-pre-line'>
                                      {result.message}
                                    </p>
                                    <div className='text-xs text-slate-300 flex flex-col-reverse'>
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
