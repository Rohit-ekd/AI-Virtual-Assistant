import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

import genToken from '../config/token.js';

// sign up
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }   
        if(password.length < 5) {
            return res.status(400).json({ message: "Password must be at least 5 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = await  genToken(newUser._id);
        res.cookie('token', token, {     
            httpOnly: true,
            secure:false,
            sameSite: 'strict',
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
        }); 
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Sign Up  error" });
    }
};


// inside auth.controller.js
export const signin = async (req, res) => {
  try {
    console.log("📩 Request body:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // IMPORTANT: include password explicitly because schema has select: false
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = genToken(user._id);
    if (!token) return res.status(500).json({ message: "Token generation failed" });

    // Set cookie (no password sent to client)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false
    });

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("❌ Signin error:", error);
    return res.status(500).json({ message: error.message || "Login error" });
  }
};


export const logout = async (req, res) => {
   try{
    res.clearCookie('token');
    return res.status(200).json({ message: "Logged out successfully" });
   }
   catch (error) {
    return res.status(500).json({ message: "LogOut error" });
   }
};
// This code defines the authentication controller for user signup, login, and logout functionalities.
// It uses bcrypt for password hashing and JWT for token generation. The controller interacts with the User model to manage user data in the database.