import axios from "axios";
import { useEffect, useState, createContext } from "react";
// export const userDataContext = createContext();
export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "https://ai-virtual-assistant-pzwr.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("Current user data:", result.data);
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    getGeminiResponse,
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
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;

