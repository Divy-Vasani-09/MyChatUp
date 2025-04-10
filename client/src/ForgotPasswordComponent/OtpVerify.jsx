import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import API_URL from "../config";
// import API_URL from "../../config";

export default function OtpVerify({ EmailIDOrPhoneNo, step, setStep }) {
  const [otp, setOtp] = useState("");
  const [otpErr, setOtpErr] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 400); // Changes every 400ms

    return () => clearInterval(interval);
  }, []);

  const inputValueHandler = (otpValue) => {
    setOtpErr(false);
    setErrorMessage("");
    setOtp(otpValue);
  }

  const handleResendOtp = async () => {
    try {
      const result = await axios.post(`${API_URL}/ForgotPassword`, { EmailIDOrPhoneNo })
      console.log(result)
      if (result?.status === 200) {
        setResendDisabled(true);
        setTimeout(() => {
          toast.success(result.data?.message)
        }, 0);
        setTimeout(() => {
          setResendDisabled(false);
        }, 30000);
      }
    } catch (err) {
      console.log(err)
      if (err.response.data === "No record existed") {
        return
      }
    }
  }

  const onSubmitValidation = async () => {
    if (otp.length < 6) return setOtpErr(true);

    if (loading) return
    try {
      setLoading(true);
      const result = await axios.post(`${API_URL}/verify-otp`, { EmailIDOrPhoneNo, otp });
      console.log(result)
      if (result?.status === 200) {
        setStep(3)
        setTimeout(() => {
          toast.success(result.data?.message);
        }, 0);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      if (err.response.data?.message === "Invalid OTP") {
        setErrorMessage("Invalid OTP");
        setOtpErr(true);
        setLoading(false);
        return
      }
    } finally {
      setLoading(false);
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
          <h1 className="font-bold text-xl text-gray-300">Verify your email</h1>
          <h1 className="text-base my-1 text-gray-400">
            Enter code We've sent a code to your email.
          </h1>
        </div>
      </div>

      <div className="w-full space-y-3">
        {/* Email / Phone Input */}
        <div className="w-full mb-3">
          <div className="flex justify-center">
            <div
              className="flex items-center justify-center px-2 bg-gray- rounded-md duration-300 border-"
            >
              <OTPInput
                value={otp}
                onChange={inputValueHandler}
                numInputs={6}
                inputStyle={{
                  width: "50px",
                  height: "50px",
                  margin: "0px 6px",
                }}
                renderInput={(props) => (
                  <input
                    {...props}
                    type="number"
                    placeholder="0"
                    className="bg-[#0E0000] border border-white/10 text-center rounded-[10px] text-lg font-medium text-white tracking-[-0.24px] w-full outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-400 transition duration-300"
                    inputMode="numeric" // Ensures only numbers can be entered
                    pattern="[0-9]*" // Restricts to numeric input
                  />
                )}
              />
            </div>
          </div>

          {otpErr && (
            <p className="text-red-500">
              {otp === ""
                ? "Enter full otp"
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
          className="font-bold text-gray-200 bg-indigo-600 hover:text-gray-100 hover:bg-indigo-700 duration-300 py-2 w-5/6 rounded-lg"
        >
          {loading ? `Loading${dots}` : "Verify OTP"}
        </button>
      </div>
      <div className="flex items-center justify-center text-sm text-center text-gray-400">
        Didn't receive any code?&nbsp;
        <div
          onClick={handleResendOtp}
          disabled={resendDisabled}
          className={`text-base text-indigo-400 duration-300 ${resendDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:text-indigo-500 hover:underline"}`} >
          Resend!
        </div>
      </div>

    </>
  )
}
