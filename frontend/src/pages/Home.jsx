// import React, { useContext, useEffect } from "react";
// import { userDataContext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } =
//     useContext(userDataContext);
//   const navigate = useNavigate();
//   const handleLogout = async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/auth/logout`, {
//         withCredentials: true,
//       });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };

//   const speaks = (text) => {
//     const utterence = new SpeechSynthesisUtterance(text);
//     window.speechSynthesis.speak(utterence);
//   };

//   const handleCommand = (data) => {
//     const { type, userInput, response } = data;
//     speaks(response);

//     if (type === "google-search") {
//       const query = encodeURIComponent(userInput);
//       window.open(`https://www.google.com/search?q=${query}`, `_blank`);
//     }
//     if (type === "calculator-open") {
//       window.open(`https://www.google.com/search?q=calculator`, `_blank`);
//     }
//     if (type === "instagram-open") {
//      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
//     }
//     if (type === "facebook-open") {
//       window.open(`https://www.facebook.com/`, `_blank`, "noopener,noreferrer");
//     }
//     if (type === "weather-show") {
//       window.open(`https://www.goole.com/search?q=weather`, `_blank`);
//     }
//     if (type === "youtube-search" || type === "youtube-play") {
//       const query = encodeURIComponent(userInput || "");
//       openInNewTab(`https://www.youtube.com/results?search_query=${query}`,`_blank`);
//     }
//   };

//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webKitSpeechRecognition;

//     const recognition = new SpeechRecognition();
//     (recognition.continuous = true), (recognition.lang = "en-US");

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       console.log("heard : " + transcript);

//       if (
//         transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
//       ) {
//         const data = await getGeminiResponse(transcript);
//         console.log(data);
//         // speaks(data.response);
//         handleCommand(data);
//       }
//     };

//     recognition.start();
//   }, []);

//   return (
//     <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center  flex-col gap-[20px] relative cursor-pointer">
//       <button
//         className="min-w-[150px] h-[50px] mt-[30px]
//           text-black font-semibold bg-white rounded-full text-[19px] absolute top-[20px] right-[20px] cursor-pointer"
//         onClick={() => {
//           handleLogout();
//         }}
//       >
//         LogOut
//       </button>

//       <button
//         className="min-w-[200px] h-[50px] mt-[30px]
//           text-black font-semibold bg-white rounded-full text-[19px] absolute top-[100px] right-[20px] px-[20px] cursor-pointer"
//         onClick={() => {
//           navigate("/customize");
//         }}
//       >
//         Customize Assistant
//       </button>

//       <div className="w-[200px] h-[200px] flex justify-center items-center overflow-hidden rounded-full shadow-lg">
//         <img
//           src={userData?.assistantImage}
//           className="w-full h-full object-cover"
//           alt="Assistant"
//         />
//       </div>
//       <h1 className="text-white text-[20px] font-semibold">
//         {" "}
//         I'm {userData?.assistantName}
//       </h1>
//     </div>
//   );
// }
// export default Home;

import React, { useContext, useEffect, useState, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [activated, setActivated] = useState(false); // wake-word activated
  

  // refs to keep state across renders without causing re-renders
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const activationTimerRef = useRef(null);

  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log("Logout error:", error);
    }
  };

  const clearActivationTimer = () => {
    if (activationTimerRef.current) {
      clearTimeout(activationTimerRef.current);
      activationTimerRef.current = null;
    }
  };

  const startActivationTimer = (ms = 1000) => {
    clearActivationTimer();
    activationTimerRef.current = setTimeout(() => {
      setActivated(false);
      activationTimerRef.current = null;
      console.log("Activation timed out — deactivated");
    }, ms);
  };

  const speaks = (text) => {
    if (!text || !synth) return;

    try {
      if (recognitionRef.current && isRecognizingRef.current) {
        recognitionRef.current.stop();
        isRecognizingRef.current = false;
        setListening(false);
      }
    } catch (e) {}

    const utterance = new SpeechSynthesisUtterance(text);

    // Find Hindi voice
    const voices = synth.getVoices();
    const hindiVoice =
      voices.find((v) => v.lang.toLowerCase().includes("hi-in")) || null;

    if (hindiVoice) {
      utterance.voice = hindiVoice;
      utterance.lang = "hi-IN";
    } else {
      console.warn("Hindi voice not found, using default voice");
      utterance.lang = "hi-IN"; // still set Hindi even if no specific voice
    }

    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      try {
        if (recognitionRef.current && !isRecognizingRef.current) {
          recognitionRef.current.start();
        }
      } catch (e) {
        if (e.name !== "InvalidStateError") {
          console.error("Error restarting recognition after speech:", e);
        }
      }
    };

    try {
      synth.speak(utterance);
    } catch (e) {
      console.error("SpeechSynthesis error:", e);
      isSpeakingRef.current = false;
    }
  };

  // open helper with safe flags
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // normalize type to hyphen-style (your backend uses hyphens like "google-search")
  const normalizeType = (s = "") =>
    (s || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

  const handleCommand = (data = {}) => {
    const { type, userInput, response } = data;
    if (response) speaks(response);

    const t = normalizeType(type);
    const q = encodeURIComponent(userInput || "");

    // 'general' is a spoken/informational response — no navigation
    if (t === "general") {
      return;
    }

    if (t === "google-search") {
      openInNewTab(`https://www.google.com/search?q=${q}`);
      return;
    }

    if (t === "calculator-open") {
      openInNewTab(`https://www.google.com/search?q=calculator`);
      return;
    }

    if (t === "instagram-open") {
      openInNewTab("https://www.instagram.com/");
      return;
    }

    if (t === "facebook-open") {
      openInNewTab("https://www.facebook.com/");
      return;
    }

    if (t === "weather-show") {
      openInNewTab(`https://www.google.com/search?q=weather`);
      return;
    }

    if (t === "youtube-search" || t === "youtube-play") {
      openInNewTab(`https://www.youtube.com/results?search_query=${q}`);
      return;
    }

    // debug unknown types
    const allowed = [
      "general",
      "google-search",
      "calculator-open",
      "instagram-open",
      "facebook-open",
      "weather-show",
      "youtube-search",
      "youtube-play",
    ];
    if (!allowed.includes(t)) {
      console.warn("Unknown action type:", type, "(normalized:", t + ")");
    }
  };

  // helper to send the command text to backend and handle response
  const sendToAssistant = async (commandText) => {
    try {
      // ensure recognition stopped before awaiting response
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      isRecognizingRef.current = false;
      setListening(false);

      const data = await getGeminiResponse(commandText);
      if (!data) {
        console.error("No response from assistant service.");
        return;
      }
      console.log("assistant data:", data);
      handleCommand(data);
    } catch (err) {
      console.error("Error sending to assistant:", err);
    } finally {
      // clear any activation timer
      clearActivationTimer();
      setActivated(false);
    }
  };

  useEffect(() => {
    // Wait until assistant name available before starting recognition
    if (!userData?.assistantName) {
      console.warn(
        "Assistant name not available yet — speech recognition not started."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    const safeStart = () => {
      if (!recognitionRef.current) return;
      if (isSpeakingRef.current || isRecognizingRef.current) return;
      try {
        recognitionRef.current.start();
      } catch (error) {
        // ignore InvalidStateError (already started) but log others
        if (error.name !== "InvalidStateError") {
          console.error("Start recognition error:", error);
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      console.log("Recognition started");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      console.log("Recognition ended");
      // try to restart after a short delay (if appropriate)
      setTimeout(() => {
        if (!isSpeakingRef.current && !isRecognizingRef.current) {
          safeStart();
        }
      }, 500);
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      // attempt restart for non-fatal errors
      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => safeStart(), 1000);
      }
    };

    recognition.onresult = async (e) => {
      try {
        const transcript = e.results[e.results.length - 1][0].transcript.trim();
        console.log("heard:", transcript);

        const assistantName = userData?.assistantName;
        if (!assistantName) return;

        const lcTranscript = transcript.toLowerCase();
        const lcAssistant = assistantName.toLowerCase();

        // Case A: utterance contains assistant name
        if (lcTranscript.includes(lcAssistant)) {
          // remove assistant name from transcript (first occurrence)
          const regex = new RegExp(assistantName, "i");
          const commandPart = transcript.replace(regex, "").trim();

          if (commandPart.length > 0) {
            // user said name + command in same utterance -> handle immediately
            console.log(
              "Detected name + command in same utterance:",
              commandPart
            );
            // stop recognition and send the command part
            try {
              recognitionRef.current?.stop();
            } catch (e) {}
            isRecognizingRef.current = false;
            setListening(false);
            clearActivationTimer();
            setActivated(false);
            await sendToAssistant(commandPart);
            return;
          } else {
            // user only said the wake-word (assistant name) -> activate and wait
            console.log("Wake-word detected — activating");
            setActivated(true);
            // speak a short prompt to accept command
            speaks("Yes?");
            // start a short timer; if no follow-up, deactivate
            startActivationTimer(6000);
            return;
          }
        }

        // Case B: user didn't say name
        // If assistant is activated (wake-word previously spoken), treat this as command
        if (activated) {
          console.log(
            "Activated and heard follow-up -> treating as command:",
            transcript
          );
          // clear activation state & timer
          clearActivationTimer();
          setActivated(false);
          try {
            recognitionRef.current?.stop();
          } catch (e) {}
          isRecognizingRef.current = false;
          setListening(false);
          await sendToAssistant(transcript);
          return;
        }

        // Otherwise ignore (not wake-word, not activated)
      } catch (err) {
        console.error("Recognition onresult error:", err);
      }
    };

    // fallback to ensure recognition is running periodically if it stops
    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeStart();
      }
    }, 10000);

    // start recognition initially
    safeStart();

    return () => {
      clearInterval(fallback);
      clearActivationTimer();
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // ignore stop errors on cleanup
      }
      recognitionRef.current = null;
      isRecognizingRef.current = false;
      setListening(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.assistantName, getGeminiResponse]);

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col items-center justify-center gap-5 relative px-4">
      {/* Logout button */}
      <button
        className="absolute top-4 right-4 min-w-[120px] h-10 px-4 text-sm sm:text-base text-black font-semibold bg-white rounded-full shadow hover:scale-105 transition"
        onClick={handleLogout}
      >
        Log Out
      </button>

      {/* Customize button */}
      <button
        className="absolute top-16 right-4 min-w-[160px] sm:min-w-[200px] h-10 sm:h-12 px-4 text-sm sm:text-base text-black font-semibold bg-white rounded-full shadow hover:scale-105 transition"
        onClick={() => navigate("/customize")}
      >
        Customize Assistant
      </button>

      {/* Assistant image */}
      <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 flex justify-center items-center overflow-hidden rounded-full shadow-lg">
        <img
          src={userData?.assistantImage}
          className="w-full h-full object-cover"
          alt="Assistant"
        />
      </div>

      {/* Assistant name */}
      <h1 className="text-white text-lg sm:text-xl md:text-2xl font-semibold text-center mt-2">
        I'm {userData?.assistantName}
      </h1>

      {/* State indicator */}
      <div className="absolute bottom-4 text-white text-sm sm:text-base text-center">
        {activated ? <span>Active — listening for command…</span> : null}
        {!activated && listening ? <span>Listening…</span> : null}
      </div>
    </div>
  );
}

export default Home;
