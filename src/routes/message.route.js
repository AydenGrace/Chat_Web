import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  send,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, send);

export default router;
