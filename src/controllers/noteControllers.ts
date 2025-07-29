import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const createNote = async (req: AuthenticatedRequest, res: Response) => {
  const { title, synopsis, content } = req.body;

  if (!title || !content || !synopsis) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!req.userId) {
    return res.status(401).json({ error: "No user ID found from token" });
  }

  try {
    const note = await prisma.notes.create({
      data: {
        title,
        synopsis,
        content,
        author: {
          connect: { id: req.userId },
        },
      },
    });

    res.status(200).json({ message: "Note created", note });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Failed to create note", details: err.message });
  }
};

export const getAllNotes = async (_req: Request, res: Response) => {
  try {
    const notes = await prisma.notes.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json({ notes });
  } catch {
    res.status(400).json({ error: "Failed to fetch notes" });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  const noteId = req.params.noteId;

  try {
    const note = await prisma.notes.findUnique({
      where: { id: noteId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!note || note.isDeleted) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ note });
  } catch {
    res.status(500).json({ error: "Failed to fetch note" });
  }
};

export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
  const noteId = req.params.noteId;
  const userId = req.userId;

  const { title, synopsis, content } = req.body;

  if (!title || !content || !synopsis) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const noteExist = await prisma.notes.findUnique({
      where: { id: noteId },
    });

    if (!noteExist) {
      return res.status(404).json({ message: "Note does not exist!" });
    }

    if (noteExist.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can't edit this note." });
    }

    const updatedNote = await prisma.notes.update({
      where: { id: noteId },
      data: {
        title,
        synopsis,
        content,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({ message: "Note updated", note: updatedNote });
  } catch {
    res.status(500).json({ error: "Failed to update note" });
  }
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  const noteId = req.params.noteId;
  const userId = req.userId;

  try {
    const note = await prisma.notes.findUnique({ where: { id: noteId } });

    if (!note) {
      return res.status(404).json({ message: "Note does not exist!" });
    }

    if (note.authorId !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete" });
    }

    await prisma.notes.update({
      where: { id: noteId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ nessage: "Failed to delete note" });
  }
};

export const getDeletedNotes = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.userId;

  try {
    const deletedNotes = await prisma.notes.findMany({
      where: {
        authorId: userId,
        isDeleted: true,
      },
      orderBy: { deletedAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json({ notes: deletedNotes });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch deleted notes" });
  }
};

export const restoreNote = async (req: AuthenticatedRequest, res: Response) => {
  const noteId = req.params.noteId;
  const userId = req.userId;

  try {
    const note = await prisma.notes.findUnique({ where: { id: noteId } });

    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.authorId !== userId)
      return res.status(403).json({ message: "Unauthorized to restore" });

    const restoredNote = await prisma.notes.update({
      where: { id: noteId },
      data: { isDeleted: false, deletedAt: new Date() },
    });

    res
      .status(200)
      .json({ note: restoredNote, message: "Note restored successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to restore note" });
  }
};
