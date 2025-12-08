import { json } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({success:false ,  message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({success:false ,  message: "Invalid email or password" });
    }

    // Successful login
    const token = jwt.sign({ id: user._id, role: user.role },process.env.JWT_SECRET , { expiresIn: "1h" });
    res.status(200).json({ success:true , token ,  message: "Login successful", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    
  } catch (error) {
    res.status(500).json({success:false ,  error:error.message  });
    
  }

}

const verify = (req, res) => {
  res.status(200).json({ success: true ,  message: "Token is valid", user: req.user });
}

export {login , verify};