import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { updateSpace, deleteSpace } from "../controllers/parkingSpacesController";

const router = Router();

router.put("/:id", requireAuth, requireRole("OWNER"), updateSpace);
router.delete("/:id", requireAuth, requireRole("OWNER"), deleteSpace);

export default router;
