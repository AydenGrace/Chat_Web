import express from "express";
import {
  checkAuth,
  signin,
  signout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import {protectRoute} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/signout", signout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
