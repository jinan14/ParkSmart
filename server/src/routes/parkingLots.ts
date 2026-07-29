import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { listLots, getLot, createLot, listMyLots } from "../controllers/parkingLotsController";
import { addSpace } from "../controllers/parkingSpacesController";

const router = Router();

router.get("/", listLots);
router.get("/owned/mine", requireAuth, requireRole("OWNER"), listMyLots);
router.get("/:id", getLot);
router.post("/", requireAuth, requireRole("OWNER"), createLot);
router.post("/:lotId/spaces", requireAuth, requireRole("OWNER"), addSpace);

export default router;
