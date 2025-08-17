import React, { useState, useContext } from "react";
import bg from "../assets/ai.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignIn() {
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.log(err);
      setUserData(null);
      setLoading(false);
      setErr(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

return (
  <div
    className="w-full min-h-screen bg-cover flex justify-center items-center px-4"
    style={{ backgroundImage: `url(${bg})` }}
  >
    <form
      className="w-full sm:w-[90%] md:w-[500px] max-w-[500px] bg-[#00000062] rounded-[15px] backdrop-blur shadow-black flex flex-col items-center justify-center gap-5 p-6 sm:p-8"
      onSubmit={handleSignIn}
    >
      <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-6 text-center">
        SignIn to <span className="text-blue-400">Virtual-Assistant</span>
      </h1>

      <input
        type="email"
        placeholder="Enter your Email"
        className="w-full h-12 rounded-full px-4 text-white bg-[#00000062] border border-gray-300 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
        required
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <div className="w-full h-12 rounded-full px-4 text-white bg-[#00000062] border border-gray-300 focus-within:border-blue-500 relative flex items-center">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your Password"
          className="w-full h-full bg-transparent text-white focus:outline-none text-sm sm:text-base"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {!showPassword ? (
          <IoEye
            className="absolute right-5 w-6 h-6 text-white cursor-pointer"
            onClick={() => setShowPassword(true)}
          />
        ) : (
          <IoEyeOff
            className="absolute right-5 w-6 h-6 text-white cursor-pointer"
            onClick={() => setShowPassword(false)}
          />
        )}
      </div>

      {err && <p className="text-red-500 text-sm sm:text-base">*{err}</p>}

      <button
        type="submit"
        className="w-full h-12 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300 mt-5 text-sm sm:text-base"
        disabled={loading}
      >
        {loading ? "Loading..." : "Sign In"}
      </button>

      <p
        className="text-white text-sm sm:text-base cursor-pointer mt-3 text-center"
        onClick={() => navigate("/signup")}
      >
        Want to Create New Account?{" "}
        <span className="text-blue-400 cursor-pointer">Sign Up</span>
      </p>
    </form>
  </div>
);

}
export default SignIn;
