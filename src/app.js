import express from "express";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  res.send("Backend is running");
});

app.use("/api/auth", authRoutes);
export default app;
