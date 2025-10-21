// middleware/adminMiddleware.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select("-password");
      if (!req.admin) {
        return res.status(401).json({ message: "Neautorizovan" });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: "Token nije validan" });
    }
  } else {
    res.status(401).json({ message: "Token nije dostavljen" });
  }
};

module.exports = { protectAdmin };
