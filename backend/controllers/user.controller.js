import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function userRegister(req, res) {
  try {
    const { username, email, password, avatar, channels } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
      channels,
    });

    return res.status(201).json({
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "User registration failed", error: error.message });
  }
}

export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // true in prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Required for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    return res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "User login failed", error: error.message });
  }
}

export async function fetchUser(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("channels", "channelName description channelBanner videos owner subscribers");

    return res.status(200).json({ message: "Fetch user", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export async function updateUaer(req, res) {
  try {
    const userId = req.user.id;
    const channelId = req.params.channelId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { channels: channelId } }, // avoids duplicates
      { new: true }
    );

    return res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
