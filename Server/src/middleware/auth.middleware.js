import jwt from "jsonwebtoken";
import Auth from "../models/auth.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.eMedsHubToken;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await Auth.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User with the role '${req.user.role}' not allowed to access this resource.`,
      });
    }
    next();
  };
};
