import express from "express";
import helmet from "helmet";
import { PORT } from "./config/server-config.js";
import connectDB from "./config/database.js";
import apiRoutes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error-middleware.js";

const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", apiRoutes);

// Error Handler
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
  });
}

startServer();
