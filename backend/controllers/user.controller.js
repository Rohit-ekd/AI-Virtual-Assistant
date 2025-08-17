import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Get Current User Error" });
  }
};

// export const updateAssistant = async (req, res) => {
//   try {
//     // 7 images ka path direct database mein store karna hai or jo image upload use multer or cloudinary ke throught karenge
//     const { assistantName, imageUrl } = req.body;
//     let assistantImage;
//     if (req.file) {
//       assistantImage = await uploadOnCloudinary(req.file.path);
//     } else {
//       assistantImage = imageUrl; // agar image upload nahi hui to jo image url diya hai usi ko use karna hai
//     }

//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       { assistantImage, assistantName },
//       { new: true }
//     ).select("-password");
//     return res.status(200).json(user);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Update Assistant Error" });
//   }
// };

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      try {
        assistantImage = await uploadOnCloudinary(req.file.path);
      } catch (uploadErr) {
        console.error("Cloudinary Upload Error:", uploadErr);
        return res.status(500).json({ message: "Image upload failed" });
      }
    } else {
      assistantImage = imageUrl || null;
    }

    if (!req.userId) {
      return res.status(400).json({ message: "User ID not found in request" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantImage, assistantName },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Update Assistant Error:", err);
    return res.status(500).json({ message: "Update Assistant Error" });
  }
};


export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    // user.history.push(command)
    // user.save()
    if (!command || typeof command !== "string") {
      return res.status(400).json({ response: "Command is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    const userName = user.name || "User";
    const assistantName = user.assistantName || "Assistant";

    console.log("req.userId:", req.userId);
    console.log("command:", command);

    let result;
    try {
      result = await geminiResponse(command, assistantName, userName);
    } catch (err) {
      console.error("Gemini API error:", err);
      return res.status(500).json({ response: "Assistant service error" });
    }

    console.log("Gemini raw result:", result);

    // Validate the response from geminiResponse
    if (!result || typeof result !== "string") {
      return res.status(500).json({ response: "Invalid response from assistant" });
    }

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand" });
    }

    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      return res.status(400).json({ response: "Invalid assistant response format" });
    }

    const type = gemResult.type;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get-time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current Time is ${moment().format("hh:mm A")}`,
        });
      case "get-day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get-month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      default:
        return res.status(400).json({ response: "I didn't understand that command" });
    }
  } catch (error) {
    console.error("AskToAssistant error:", error);
    return res.status(500).json({ response: "Ask Assistant Error" });
  }
};
