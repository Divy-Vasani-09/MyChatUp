import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './component/Navbar';
import Registration from './component/registration';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar /><Registration/></>, // Default route
    },
    
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App