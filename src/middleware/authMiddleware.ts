import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res
      .status(500)
      .json({ error: "Server misconfiguration: JWT secret missing!" });
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err: unknown) {
    console.error(
      "verifyToken: Token verification FAILED in catch block!",
      err,
    );

    if (err instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ error: "Unauthorized: Token expired" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res
        .status(403)
        .json({ error: `Unauthorized: Invalid token (${err.message})` });
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized: Token verification failed" });
    }
  }
};
