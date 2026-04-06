import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  console.log("JWT_SECRET (middleware):", process.env.JWT_SECRET);
  if (!header) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const token = header.split(" ")[1]; // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.sub,
    };

    next(); // continue to route
  } catch (err) {
    console.log("JWT VERIFY ERROR:", err.message);
    console.log("JWT_SECRET (middleware):", process.env.JWT_SECRET);
    console.log("AUTH HEADER:", req.headers.authorization);
    res.status(401).json({ error: "Invalid token" });
  }
}
