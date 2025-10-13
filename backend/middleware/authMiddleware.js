import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export async function verifyToken(req, res, next) {
  try {
    // Optional: Debug logs (remove in production)
    console.log("Cookies received:", req.cookies);

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user: Please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Should include 'id'

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
