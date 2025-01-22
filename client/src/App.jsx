import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './component/Navbar';
import Registration from './component/registration';
import Login from './component/login';
import ForgotPassword from './component/ForgotPassword';
import DashBoard from './component/DashBoard';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar /><Registration /></>, // Default route
    },
    {
      path: "/Registration",
      element: <><Navbar /><Registration /></>,
    },
    {
      path: "/Login",
      element: <><Navbar /><Login /></>,
    },
    {
      path: "/ForgotPassword",
      element: <><Navbar /><ForgotPassword /></>,
    },
    {
      path: "/DashBoard",
      element: <><Navbar /><DashBoard /></>,
    },

  ])
  return (
    <>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </>
  )
}

export default App