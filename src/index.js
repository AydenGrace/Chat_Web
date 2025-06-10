import express from "express";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server is running.");
  console.log("\x1b[36m%s\x1b[0m", `http://localhost:5000/api/`);
});
