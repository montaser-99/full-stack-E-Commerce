// middlewares/auth.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const auth = async (req, res, next) => {
  try {


    const token = req.cookies?.accessToken;
    if (!token) {
      
      return res.status(401).json({ message: "Unauthorized", error: true, success: false });
    }

    const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
    const user = await User.findById(decoded?.id);
    if (!user) {

      return res.status(401).json({ message: "User not found", error: true, success: false });
    }

    req.user = user;
    req.userid = user._id;
   
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: true, success: false });
  }
};
