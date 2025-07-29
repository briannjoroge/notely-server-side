import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

// const JWT_SECRET = "123456";
const JWT_SECRET = process.env.JWT_SECRET as string;

const prisma = new PrismaClient();

export const defaultScreen = (_req: Request, res: Response) => {
  res.send("Notely backend is running!");
};

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: "Please fill all box fields!" });
  }

  try {
    const emailTaken = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (emailTaken) {
      return res
        .status(400)
        .json({ message: "Email is already taken. Pick another one!" });
    }

    const userNameTaken = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (userNameTaken) {
      return res
        .status(400)
        .json({ message: "Username is already taken. Pick another one!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Something Went Wrong!", err });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { loginCredentials, password } = req.body;

  if (!loginCredentials || !password) {
    return res
      .status(400)
      .json({ error: "Email/Username and password are required" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: loginCredentials }, { username: loginCredentials }],
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const userMatch = await bcrypt.compare(password, user.password);

    if (!userMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "12h" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        dateJoined: user.dateJoined,
        lastProfileUpdate: user.lastProfileUpdate,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", err });
  }
};
