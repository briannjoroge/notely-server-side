import { Router } from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  getDeletedNotes,
  restoreNote,
  updateNote,
} from "../controllers/noteControllers";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", verifyToken, getAllNotes);
router.get("/deleted", verifyToken, getDeletedNotes);
router.get("/:noteId", verifyToken, getNoteById);
router.post("/", verifyToken, createNote);
router.put("/:noteId", verifyToken, updateNote);
router.put("/restore/:noteId", verifyToken, restoreNote);
router.delete("/:noteId", verifyToken, deleteNote);

export default router;
