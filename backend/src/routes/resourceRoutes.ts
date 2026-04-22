import express from "express";
import {
  getResources,
  addResource,
  updateResource,
  deleteResource,
} from "../controllers/resourceCtrl";

const router = express.Router();

router.get("/", getResources);
router.post("/", addResource);
router.patch("/:id", updateResource);
router.delete("/:id", deleteResource);

export default router;