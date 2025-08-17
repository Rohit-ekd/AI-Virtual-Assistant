import jwt from "jsonwebtoken";

const genToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  if (!userId) {
    throw new Error("User ID is required for token generation");
  }

  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Token generation failed");
  }
};

export default genToken;

