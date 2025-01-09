import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="container flex justify-between bg-slate-100 text-white py-3 shadow-lg">
        <header>
          <div className='bg-slate-300 rounded-2xl p-1 px-2 flex col font-medium mx-2 text-black text-lg'><h1 className='font-bold '>M</h1><p className='text-base italic'>y</p><h1 className='font-bold'>C</h1><p className='italic'>hat</p><h1 className='font-bold'>MX</h1></div>
        </header>
      </div>
    </>
  )
}

export default App