import { set } from "mongoose";
import { userDataContext } from "../context/UserContext";
import React, { useContext } from "react";

function Card({ image }) {
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
  return (
    <div
      className={`w-[80px] h-[140px] lg:w-[150px] lg:h[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${
        selectedImage == image
          ? "border-4 border-white border-shadow-blue-950"
          : null
      }`}
      onClick={() => {
        setSelectedImage(image);
        setFrontendImage(null);
        setBackendImage(null);
      }}
    >
      <img src={image} className="w-full h-full object-cover rounded-[15px]" />
    </div>
  );
}

export default Card;
