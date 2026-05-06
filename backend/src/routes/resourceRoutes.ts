import express from "express";
import {
  getResources,
  addResource,
  updateResource,
  deleteResource,
  importResources,
} from "../controllers/resourceCtrl";

const router = express.Router();

router.get("/", getResources);
router.post("/", addResource);
router.post("/import", importResources);
router.patch("/:id", updateResource);
router.delete("/:id", deleteResource);

export default router;