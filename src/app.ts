import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import userRoutes from "./routes/user";
import { connectGoldDataSocket } from "./services/goldData";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Morgan logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Colored output for development
} else {
  app.use(morgan("combined")); // Standard Apache combined log format for production
}

// Socket connections
connectGoldDataSocket();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);

// welcome page
app.get("/", (req, res) => {
  res.status(200).json({ status: "Welcome to Digital Gold App" });
});

//404 endpoint
// app.use("*", (req, res) => {
//   res.json({ message: "Invalid Endpoint" });
// });

export default app;