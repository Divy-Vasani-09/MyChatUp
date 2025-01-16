import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './component/Navbar';
import Registration from './component/registration';
import Login from './component/login';
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
      path: "/login",
      element: <><Navbar /><Login /></>, 
    },
    {
      path: "/DashBoard",
      element: <><Navbar /><DashBoard /></>, 
    },
    
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App