import React, { useState, useRef, useContext } from "react";
import Card from "../component/card";
import img1 from "../assets/a1.jpg";
import img2 from "../assets/a2.jpg";
import img3 from "../assets/a3.jpg";
import img4 from "../assets/a4.jpg";
import img5 from "../assets/a5.jpg";
import img6 from "../assets/a6.jpg";
import img7 from "../assets/a7.jpg";
import { IoMdImages } from "react-icons/io";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
function Customize() {
  const {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    handleCurrentUser,
  } = useContext(userDataContext);
  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const navigate = useNavigate();
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center  flex-col p-[20px]">
      <IoMdArrowRoundBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={()=>navigate("/")} />
        <h1 className="text-white text-[30px] text-center mb-[40px]">
          Select Your <span className="text-blue-200"> Assistant Image</span>
        </h1>{" "}
        <div className="w-full max-w-[70%] bg-cover flex justify-center items-center gap-[20px] flex-wrap ">
        <Card image={img1} />
        <Card image={img2} />
        <Card image={img3} />
        <Card image={img4} />
        <Card image={img5} />
        <Card image={img6} />
        <Card image={img7} />
        <div
          className={`w-[80px] h-[140px] lg:w-[150px] lg:h-[200px]  bg-gradient-to-t from-[black] to-[#020236] rounded-[15px] shadow-lg overflow-hidden hover:shadow-2xl hover:blue-950 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center ${
            selectedImage == "input"
              ? "border-4 border-white shadow-2xl shadow-blue-950"
              : null
          }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <IoMdImages className="text-white text-[30px]" />
          )}
          {frontendImage && (
          <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {selectedImage && <button className="bg-[#020236] text-white px-[20px] py-[10px] rounded-[10px] hover:bg-[#020266] transition duration-300 cursor-pointer mt-[20px]" onClick={() => navigate("/customize2")}>
        Next
      </button>}
    </div>
  );
}

export default Customize;
