import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getUserEmailUsername = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { username: true, email: true },
    });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

export const getUserNotes = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const notes = await prisma.notes.findMany({
      where: {
        authorId: req.userId,
        isDeleted: false,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ notes });
  } catch {
    res.status(500).json({ message: "Failed to fetch user notes" });
  }
};

export const updateUserInfo = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.userId;
  const { firstName, lastName, username, email, avatar } = req.body;

  try {
    const existingEmailUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmailUser && existingEmailUser.id !== userId) {
      return res
        .status(400)
        .json({ error: "Email address is already in use." });
    }

    const existingUsernameUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsernameUser && existingUsernameUser.id !== userId) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        username,
        email,
        avatar: avatar || null,
        lastProfileUpdate: new Date(),
      },
    });

    res.status(200).json({
      message: "User information updated",
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        dateJoined: updatedUser.dateJoined,
        lastProfileUpdate: updatedUser.lastProfileUpdate,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to update profile data!" });
  }
};

export const updateUserPassword = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both passwords are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ messahe: "User not found!" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch {
    res.status(500).json({ error: "Password update failed" });
  }
};

export const checkPasswordMatch = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { currentPassword } = req.body;
  const userId = req.userId;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(currentPassword, user.password);
  res.status(200).json({ valid: match });
};
