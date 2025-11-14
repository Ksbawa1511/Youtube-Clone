import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user: Please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Use `decoded.id` instead of `decoded.userId`
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user: Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({
      message: "Unauthorized user",
      error: error.message,
    });
  }
}

export async function optionalVerifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (user) {
      req.user = user._id; // Store user ID
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    // If token is invalid, just continue without user
    req.user = null;
    next();
  }
}
