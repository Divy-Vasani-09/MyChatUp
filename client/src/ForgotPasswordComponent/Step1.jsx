import React, { useEffect, useState } from "react";
import { emailIdRegex, phoneNoRegex } from "../component/Regexes";
import { ToastContainer, toast } from "react-toastify";
import { CiMail } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

export default function Step1({ setInputValues, step, setStep }) {

  const [EmailIDOrPhoneNo, setEmailIDOrPhoneNo] = useState("");
  const [EmailIDOrPhoneNoErr, setEmailIDOrPhoneNoErr] = useState(false);
  const showErrorInBorder = "border-red-700";
  const unShowErrorInBorder = "border-slate-950";
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 400); // Changes every 400ms

    return () => clearInterval(interval);
  }, []);

  const inputValueHandler = (e) => {
    setErrorMessage("")
    setEmailIDOrPhoneNoErr(false)
    setEmailIDOrPhoneNo(e.target.value)
  }

  const onSubmitValidation = async () => {
    setEmailIDOrPhoneNoErr(false)
    if (!emailIdRegex.test(EmailIDOrPhoneNo) && !phoneNoRegex.test(EmailIDOrPhoneNo)) {
      setEmailIDOrPhoneNoErr(true);
      return
    }

    if (loading) return
    try {
      setLoading(true)
      const result = await axios.post(`${API_URL}/ForgotPassword`, { EmailIDOrPhoneNo })
      console.log(result)
      if (result?.status === 200) {
        setStep(2)
        setTimeout(() => {
          toast.success(result.data?.message)
        }, 0);
        setLoading(false);
        // setInputValues({
        //   ...inputValues,
        //   EmailIDOrPhoneNo: EmailIDOrPhoneNo
        // })
        setInputValues((prev) => ({
          ...prev,
          EmailIDOrPhoneNo: EmailIDOrPhoneNo
        }))
      }
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response.data);
      if (err.response.data === "No record existed") {
        setEmailIDOrPhoneNoErr(true);
        setLoading(false);
        return
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex mx-auto mb-3 space-x-1">
        {/* Logo */}
        <div className="flex items-center justify-center bg-gray-700 rounded-xl p-1 px-2 font-medium text-gray-200 text-lg shadow-slate-500 drop-shadow shadow-[rgba(0,0,10,0.5)_1px_1px_5px_1px]">
          <h1 className="select-none font-bold">M</h1>
          <p className="select-none text-base italic">y</p>
          <h1 className="select-none font-bold">C</h1>
          <p className="select-none italic">hat</p>
          <h1 className="select-none font-bold">MX</h1>
        </div>
      </div>

      <div className="flex mx-auto mb-4 space-x-1">
        {/* Reset Password Form Title */}
        <div className="text-left my-1">
          <h1 className="font-bold text-xl text-gray-300">Forgot Password?</h1>
          <h1 className="text-base my-1 text-gray-400">
            No worries, we'll send you reset instructions.
          </h1>
        </div>
      </div>

      <div className="w-full space-y-3">
        {/* Email / Phone Input */}
        <div className="w-full mb-3">
          <div
            className={`flex px-2 bg-gray-950 rounded-md drop-shadow shadow-sm hover:shadow-gray-400 duration-300 border-2 ${EmailIDOrPhoneNoErr ? showErrorInBorder : unShowErrorInBorder
              }`}
          >
            <div className="flex items-center justify-center ml-1">
              <div className="flex text-xl items-center justify-center border-r border-gray-500 h-7 pr-2">
                <CiMail />
              </div>
            </div>
            <input
              type="text"
              placeholder="Email ID or Phone Number"
              name="EmailIDOrPhoneNo"
              value={EmailIDOrPhoneNo}
              onChange={inputValueHandler}
              className="flex-1 font-normal text-base bg-gray-950 py-1.5 px-3 rounded-md outline-none"
            />
          </div>
          {EmailIDOrPhoneNoErr && (
            <p className="text-red-500">
              {EmailIDOrPhoneNo === ""
                ? "Enter Your Email ID or Phone No."
                : errorMessage !== ""
                  ? errorMessage
                  : "Invalid Email ID or Phone No."}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center w-full items-center my-4">
        <button
          type="submit"
          onClick={onSubmitValidation}
          disabled={loading}
          className="font-bold text-gray-200 bg-indigo-600 hover:text-gray-100 hover:bg-indigo-700 duration-300 py-2 w-5/6 rounded-lg"
        >
          {loading ? `Loading${dots}` : "Verify Email"}
        </button>
      </div>

    </>
  )
}
