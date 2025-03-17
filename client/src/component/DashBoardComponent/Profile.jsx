import axios from 'axios';
import React, { useRef, useState } from 'react'
import UserIcon from 'C:/Users/Destiny/OneDrive/Desktop/MyChatUp/client/src/assets/profile.png';
import { FaUserCircle } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
// import { useStyleSheetContext } from 'styled-components/dist/models/StyleSheetManager';


function Profile() {
  const [userData, setUserData] = useState(() => {
    return JSON.parse(sessionStorage.getItem("userLoggedData"));
  });
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState([])
  const imageUploadRef = useRef();

  const handleEditDp = (e) => {
    e.preventDefault();
    imageUploadRef.current.click();
  }

  const handleImageInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const maxSize = 1 * 1024 * 1024; // 1MB size limit
      if (file.size > maxSize) {
        toast.error("Please upload images under 1MB!");
        return;
      }

      const convertToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

      convertToBase64(file)
        .then(base64Image => {
          setSelectedImage(base64Image);
          axios.post('http://127.0.0.1:3002/uploadDp', { selectedImage: base64Image, userData })
            .then(result => {
              console.log(result);

              const updatedUserData = { ...userData, DP: result.data.userDp };
              sessionStorage.setItem("userLoggedData", JSON.stringify(updatedUserData));
              setUserData(updatedUserData);
              setTimeout(() => toast.success("Successfully Updated!"), 50);
            })
            .catch(err => {
              console.log(err);
            })
        })
        .catch(error => console.error("Error converting images:", error));
    }
  };

  const logOutHandle = () => {
    sessionStorage.removeItem("userLoggedData");
    setTimeout(() => toast.success("Successfully Logout!"), 50);
    navigate("/");
  }

  return (
    <div className="container mx-auto mt-2 h-[5.4in] w-full">
      <div>
        <ToastContainer
          stacked
          position="top-center"
          autoClose={1000}
          // hideProgressBar
          newestOnTop={false}
          closeOnClick={true}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="colored" />
      </div>
      <div className="container flex flex-col text-center items-center mx-auto p-1">
        <div className="container flex mb-3 pl-2 ">
          <h1 className='text-lg font-bold ml-2'>
            Profile
          </h1>
        </div>
        <div
          className="container flex flex-col text-7xl items-center p-1 mt-2 rounded-xl bg-opacity-15 hover:bg-opacity-20">
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleEditDp}
            className={` cursor-pointer relative`}
          >
            {
              !userData?.DP ?
              <img
                  src={UserIcon}
                  className='h-[7rem] w-[7rem] resize object-cover rounded-full transition-opacity hover:opacity-30 duration-200'
                />
                :
                <img
                  src={userData.DP}
                  className='h-[7rem] w-[7rem] resize object-cover rounded-full transition-opacity hover:opacity-60 duration-200'
                />
            }
            <div className='absolute Image-Input-Button top-12 left-12' onClick={(e) => e.stopPropagation()}>
              <input
                type="file"
                accept="image/jpeg, image/png"
                ref={imageUploadRef}
                onChange={(e) => handleImageInput(e)}
                hidden
              />
              <div
                className={`text-sm text-white rounded-sm ${!isHovered && 'hidden'} duration-300`}
              >
                <FaPen />
              </div>
            </div>
          </div>
        </div>
        <div className="container User-Name m-2 w-full ">
          <div onClick={handleEditDp} className='container text-lg font-bold'>
            Hello, {userData.UserName}
          </div>
        </div>
        <div className="container Phone NUmber m-2 w-full ">
          <div className="container text-sm select-none">
            Mobile No.
          </div>
          <div className='container text-lg font-bold'>
            {userData.PhoneNo}

          </div>
        </div>
        <div className="container Email ID m-2 w-full ">
          <div className="container text-sm select-none">
            Email ID
          </div>
          <div className='container text-lg font-bold'>
            {userData.EmailID}
          </div>
        </div>
        <div className="container Email ID m-2 w-full ">
          <div className="container text-sm select-none">
            About
          </div>
          <div className='container text-lg font-bold'>
            {userData.About}
          </div>
        </div>
      </div>
      <div className="container flex justify-around">
        <button
          type='submit'
          onClick={logOutHandle}
          className='text-base font-bold text-red-200  bg-blue-800 hover:text-white hover:bg-blue-700 my-1 mr-14 p-1 px-2 rounded-xl duration-300'
        >
          Logout

        </button>
        <Link to="/DashBoard/editProfile">
          <button
            type='submit'
            className='text-xl font-bold text-slate-300 bg-blue-800 hover:bg-blue-700 my-1 ml-14 p-2 rounded-xl duration-300'
          >
            <FaEdit />
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Profile
