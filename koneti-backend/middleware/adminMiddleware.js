import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { errorResponse } from '../utils/response.js';

export const authMiddleware = async (req, res, next) => {
  let token;

  // Prvo provjeri Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.adminToken) {
    // Ako nema u header-u, provjeri cookie
    token = req.cookies.adminToken;
  }

  if (!token) {
    return errorResponse(res, "Token nije dostavljen", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");
    if (!req.admin) {
      return errorResponse(res, "Neautorizovan", 401);
    }
    next();
  } catch (err) {
    return errorResponse(res, "Token nije validan", 401);
  }
};

export const protectAdmin = authMiddleware;
