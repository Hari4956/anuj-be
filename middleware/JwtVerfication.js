const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { User } = require("../models/auth/UserModel");

exports.jwtVerification = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    return next(new ErrorHandler(" you are Unauthorized", 401));
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(new ErrorHandler("Invalied Token", 403));
    }
    console.log(decoded);
    req.user = await User.findById(decoded.userId);
    next();
  });
});
