import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) return res.status(401).json({message: "Accès non authorisé."});

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded)
      return res
        .status(401)
        .json({message: "Accès non authorisé. Token invalide."});

    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res
        .status(401)
        .json({message: "Accès non authorisé. Utilisateur inconnu."});

    req.user = user;
    next();
  } catch (error) {
    console.log("ProtectRoute error :", error);
    res.status(500);
  }
};
