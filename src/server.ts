import dotenv from "dotenv";
import connectDB from "./config/db";
import JobScheduler from "./cron";

dotenv.config();

import app from "./app";
// Initialize cron jobs when server starts
JobScheduler.initializeJobs();

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
  });
});
