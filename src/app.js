import express from "express";
import morgan from "morgan";
import {authenticate} from "./middlewares/auth.middleware.js";
import userRoutes from "./routes/user.routes.js"

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  res.send("Backend is running");
});

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);



export default app;
