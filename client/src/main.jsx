import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './component/Navbar';
import Registration from './component/registration';
import Login from './component/login';
import ForgotPassword from './component/ForgotPassword';
import DashBoard from './component/DashBoard';
import Contact from './component/DashBoardComponent/Contact';
import Profile from './component/DashBoardComponent/Profile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Default route
    children: [
      {
        path: "/registration",
        element: <Registration />, 
      },
      {
        path: "/Login",
        element: <Login />,
      },
      {
        path: "/ForgotPassword",
        element: <ForgotPassword />,
      },
      {
        path: "/DashBoard",
        element: <DashBoard />,
        children: [
          {
            path: "contact",
            element: <Contact />
          },
          {
            path: "profile",
            element: <Profile />
          },
        ]
      },
    ]
  },

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
