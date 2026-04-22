import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app: Application = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
import resourceRoutes from "./routes/resourceRoutes";

app.use("/api/resources", resourceRoutes);

// ✅ Health Check Route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "URMS Backend is running",
  });
});

// ✅ 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// ✅ Export app
export default app;