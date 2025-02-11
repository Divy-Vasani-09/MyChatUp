import React from 'react';
import Navbar from './component/Navbar';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <Outlet />
    </>
  )
}

export default App