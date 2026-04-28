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
import maintenanceTicketRoutes from "./routes/maintenanceTicketRoutes";
import userRoutes from "./routes/userRoutes";

app.use("/api/resources", resourceRoutes);
app.use("/api/maintenance-tickets", maintenanceTicketRoutes);
app.use("/api/users", userRoutes);

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