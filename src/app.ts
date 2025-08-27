import express from "express";
import cors from "cors";
import morgan from "morgan";

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

app.get("/", (req, res) => {
  res.status(200).json({ status: "Digital Gold API is healthy" });
});

export default app;