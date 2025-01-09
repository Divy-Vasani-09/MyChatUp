import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './component/Navbar';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar /></>, // Default route
    },
    
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App