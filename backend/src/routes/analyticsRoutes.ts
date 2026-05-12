import express from "express";
import { 
  getOverviewAnalytics, 
  getBookingAnalytics, 
  getResourceAnalytics, 
  getMaintenanceAnalytics 
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

export default router;
