import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";

// Initialize express app
const app = express();

// Create logs directory in temp location or skip on Render
const logDirectory =
  process.env.NODE_ENV === "production"
    ? "/tmp/logs" // Use /tmp on Render (ephemeral)
    : path.join(process.cwd(), "logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Create a write stream (append mode) for logging requests
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

// Use Morgan to log requests to the file and console
app.use(
  morgan("combined", {
    stream: accessLogStream,
  })
);
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allowed domains for CORS
const allowedDomains = [
  "https://example.com", // production domain
  "http://localhost:5173", // for development
  "http://localhost:5174", // for development
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedDomains.includes(origin)) {
        callback(null, true); // allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // block the request
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(helmet());

app.get("/", async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "The server is Running. 👍🏻",
  });
});

app.get("/logs", (req, res) => {
  const logFilePath = path.join(logDirectory, "access.log");

  // Read last 100 lines from the log file
  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error reading log file",
      });
    }

    const lines = data.trim().split("\n");
    const last100Lines = lines.slice(-100).join("\n");

    res.setHeader("Content-Type", "text/plain");
    res.send(last100Lines);
  });
});

// Import the routes
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import moderatorRoutes from "./routes/moderator.routes.js";

// Use the routes
app.use("/api/admin", adminRoutes);
app.use("/api/moderator", moderatorRoutes);
app.use("/api/user", userRoutes);

// Handle 404 errors
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
