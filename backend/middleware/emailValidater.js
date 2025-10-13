export function validateEmail(req, res, next) {
  const { email, password } = req.body;

  // Basic email validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Basic password rule: at least 6 characters
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  next();
}
