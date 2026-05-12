import express from "express";
import { 
  getOverviewAnalytics, 
  getBookingAnalytics, 
  getResourceAnalytics, 
  getMaintenanceAnalytics,
  getBookingTrends,
  getBookingStatus,
  getResourceBookings,
  getCategoryBookings,
  getResourceUtilization,
  getPeakUsage
} from "../controllers/analyticsCtrl";
import { verifyToken, requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// All analytics routes require admin access
router.use(verifyToken as express.RequestHandler);
router.use(requireAdmin as express.RequestHandler);

router.get("/overview", getOverviewAnalytics as any);
router.get("/bookings", getBookingAnalytics as any);
router.get("/resources", getResourceAnalytics as any);
router.get("/maintenance", getMaintenanceAnalytics as any);

// Specific Booking Statistics for Chart.js
router.get("/booking-trends", getBookingTrends as any);
router.get("/booking-status", getBookingStatus as any);
router.get('/resource-bookings', getResourceBookings as any);
router.get('/category-bookings', getCategoryBookings as any);

// Utilization and Peak Usage
router.get('/resource-utilization', getResourceUtilization as any);
router.get('/peak-usage', getPeakUsage as any);

export default router;
