// import jwt from "jsonwebtoken";

// const genToken = async (userId) => {
//   try {
//     const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//       expiresIn: "10d",
//     });
//     return token;
//   } catch (error) {
//     console.error("Error generating token:", error);
//     throw new Error("Token generation failed");
//   }
// };
// export default genToken;

// // This function generates a JWT token for the user using their ID and a secret key from environment variables.
// // The token is set to expire in 10 days. If an error occurs during token generation, it logs the error and throws an exception.


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
