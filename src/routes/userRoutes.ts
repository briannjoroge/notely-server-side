import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import {
  checkPasswordMatch,
  getUserNotes,
  getUserEmailUsername,
  updateUserInfo,
  updateUserPassword,
} from "../controllers/userController";

const router = Router();

router.put("/", verifyToken, updateUserInfo);
router.get("/identity", getUserEmailUsername);
router.get("/notes", verifyToken, getUserNotes);
router.put("/password", verifyToken, updateUserPassword);
router.post("/password/check-match", verifyToken, checkPasswordMatch);

export default router;
