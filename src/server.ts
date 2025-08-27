import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
  });
});
