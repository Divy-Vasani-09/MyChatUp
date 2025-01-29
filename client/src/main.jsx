import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './component/Navbar';
import Welcome from './Welcome.jsx';
import Registration from './component/registration';
import Login from './component/login';
import ForgotPassword from './component/ForgotPassword';
import DashBoard from './component/DashBoard';
import Contact from './component/DashBoardComponent/Contact';
import Call from './component/DashBoardComponent/Call.jsx';
import Setting from './component/DashBoardComponent/Setting.jsx';
import Profile from './component/DashBoardComponent/Profile';
import EditProfile from './component/DashBoardComponent/EditProfile.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Default route
    children: [
      {
        path: "/",
        element: <Welcome />, 
      },
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
            path: "call",
            element: <Call />
          },
          {
            path: "setting",
            element: <Setting />
          },
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "editProfile",
            element: <EditProfile />
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
