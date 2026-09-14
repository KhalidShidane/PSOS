import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMe, updateMe, changePassword } from "../controllers/userController.js";

const router = Router();

router.use(protect);

router.get("/me", getMe);
router.patch("/me", updateMe);
router.patch("/change-password", changePassword);

export default router;
