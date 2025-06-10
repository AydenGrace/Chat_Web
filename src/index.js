import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import {connectionDB} from "./lib/db.js";

dotenv.config();
const app = express();

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running.");
  console.log("\x1b[36m%s\x1b[0m", `http://localhost:${process.env.PORT}/api/`);
  connectionDB();
});
