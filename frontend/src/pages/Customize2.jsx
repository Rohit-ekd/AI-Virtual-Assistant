import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";


function Customize2() {
  const { userData,backendImage,selectedImage,serverUrl,setUserData } = useContext(userDataContext);
  const [ name, setName ] = useState(userData?.name || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const handleUpdateAssistant = async () => {
      setLoading(true);
    try{
        let formData = new FormData();
        formData.append("assistantName", name);
        if(backendImage){
        formData.append("assistantImage", backendImage);
        }
        else{
            formData.append("imageUrl", selectedImage);
        }
        const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials: true});
      setLoading(false)
        console.log(result.data);
        setUserData(result.data);
        navigate("/")
    }
    catch(error){
      setLoading(false)
        console.log("Error updating assistant:", error);
    }
}
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative">
<IoMdArrowRoundBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={()=>navigate("/customize")} />
      <h1 className="text-white text-[30px] text-center mb-[40px]">
        Enter Your <span className="text-blue-200"> Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="eg. Siri, Alexa, etc."
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder:text-gray-400 rounded-full px-[20px] mb-[20px] text-[20px]"
        required
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      {name && (
        <button
          className="bg-[#020236] text-white px-[20px] py-[10px] rounded-[10px] hover:bg-[#020266] transition duration-300 cursor-pointer mt-[20px]" disabled={loading}
          onClick={() => {
            handleUpdateAssistant();
          }}
        >
          {!loading? "Create" : "Loading..."}
        </button>
      )}
    </div>
  );
}
export default Customize2;
