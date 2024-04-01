import { auth } from "./firebase.config";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

const App2 = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null);
  function handlePasswordReset() {
    // Call onPasswordReset function passing the phoneNumber value
    onPasswordReset(ph);
  }

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  async function onSignup() {
    setLoading(true);
    onCaptchVerify();

    // Remove any non-digit characters from the phone number
    const cleanedPh = ph.replace(/\D/g, "");

    // Ensure the phone number is in the international format
    const formatPh = "+" + cleanedPh;

    try {
      // Send the phone number in the request body
      const response = await fetch(
        "http://localhost:5000/api/user/checkuserfound/",
        {
          method: "POST", // Use POST method instead of GET
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber: formatPh }), // Send phone number in the request body
        }
      );

      const data = await response.json();

      if (response.ok) {
        // User found in the database, proceed with sending OTP
        const appVerifier = window.recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formatPh,
          appVerifier
        );
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      } else {
        // Check if the error message indicates user not found
        if (data.error === "User not found") {
          // User not found in the database, display error message
          toast.error(data.error);
        } else {
          // Other error occurred, display generic error message
          toast.error("Failed to check user");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      toast.error("Failed to check user");
      setLoading(false);
    }
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
        setShowPasswordReset(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  function onPasswordReset(phoneNumber) {
    setLoading(true);

    // Format the phone number with the country code prefix
    const formatPh = "+" + phoneNumber;

    // Make a POST request to your backend API endpoint to reset the password
    fetch("http://localhost:5000/api/user/resetpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: formatPh, // Pass the formatted phone number
        newPassword: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Password reset successful
          // You may want to handle any additional logic here, such as redirecting the user
          toast.success("Password reset successfully!");
        } else {
          // Handle errors from your backend API
          throw new Error("Failed to reset password");
        }
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        toast.error("Failed to reset password");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <div>
            {showPasswordReset ? (
              <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
                <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
                  Reset Your Password
                </h1>
                <label
                  htmlFor="password"
                  className="font-bold text-xl text-white text-center"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                />
                <label
                  htmlFor="confirmPassword"
                  className="font-bold text-xl text-white text-center"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                />
                <button
                  onClick={handlePasswordReset}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Reset Password</span>
                </button>
              </div>
            ) : (
              <h2 className="text-center text-white font-medium text-2xl">
                👍Login Success
              </h2>
            )}
          </div>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
              Welcome to <br /> CODE A PROGRAM
            </h1>
            {showOTP ? (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-white text-center"
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container "
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsTelephoneFill size={30} />
                </div>
                <label
                  htmlFor=""
                  className="font-bold text-xl text-white text-center"
                >
                  Verify your phone number
                </label>
                <PhoneInput country={"in"} value={ph} onChange={setPh} />
                <button
                  onClick={onSignup}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App2;
