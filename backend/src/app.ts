/**
 * app.ts
 * ─────────────────────────────────────────────────────────────
 * Express application setup.
 * Health check now verifies Supabase connectivity.
 * ─────────────────────────────────────────────────────────────
 */
import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
import resourceRoutes from "./routes/resourceRoutes";
import maintenanceTicketRoutes from "./routes/maintenanceTicketRoutes";

app.use("/api/resources", resourceRoutes);
app.use("/api/maintenance-tickets", maintenanceTicketRoutes);

import { checkSupabaseConnection } from "./config/supabaseClient";

// ✅ Health Check Route
app.get("/api/health", async (req: Request, res: Response) => {
  const isDbConnected = await checkSupabaseConnection();
  res.status(isDbConnected ? 200 : 503).json({
    status:    isDbConnected ? "success" : "degraded",
    message:   isDbConnected
                 ? "URMS Backend is fully operational (Supabase)"
                 : "URMS Backend is running but Supabase is unavailable",
    database:  isDbConnected ? "connected" : "disconnected",
    provider:  "supabase",
    timestamp: new Date().toISOString()
  });
});

// ✅ 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status:  "error",
    message: "Route not found",
  });
});

export default app;