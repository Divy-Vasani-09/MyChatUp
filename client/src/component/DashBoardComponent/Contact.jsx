import React from 'react'
import UserIcon from 'C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/profile.png'

function Contact() {
    return (
        <div className="container mx-auto mt-2 h-[5.4in] ">
            <div className="container flex flex-col text-center items-center ">
                <div className="container text-left pl-1 bg-indigo-900 bg-opacity-50 rounded-2xl  rounded-s-sm">
                    <h1 className=' text-lg font-bold'>
                        Chat
                    </h1>
                </div>
                <div className="container flex mx-1 cursor-pointer p-1  gap-3 mt-3 rounded-xl bg-blue-500 bg-opacity-15 hover:bg-opacity-20">
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
