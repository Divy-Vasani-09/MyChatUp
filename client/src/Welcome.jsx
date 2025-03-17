import React from 'react'
import { ToastContainer, toast } from 'react-toastify';

export default function Welcome() {
    return (
        <div className='container mt-[14rem] mx-auto text-center text-white '>
            <div>
                    <ToastContainer
                      stacked
                      position="top-center"
                      autoClose={2000}
                      // hideProgressBar
                      newestOnTop={false}
                      closeOnClick={true}
                      pauseOnFocusLoss={false}
                      draggable
                      pauseOnHover
                      theme="colored" />
                  </div>
            <h1 className='font-bold text-xl'>Welcome To MyChatMX Web🙂...</h1>
        </div>
    )
}
