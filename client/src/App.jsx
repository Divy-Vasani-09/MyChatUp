import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './component/Navbar';
import Registration from './component/registration';
import Login from './component/login';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar /><Registration /></>, // Default route
    },
    {
      path: "/Registration",
      element: <><Navbar /><Registration /></>, // Default route
    },
    {
      path: "/login",
      element: <><Navbar /><Login /></>, 
    },
    
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App