import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../plugins/prisma";
import { Response } from "express";

dotenv.config();

export const secretKey = process.env.ACCESS_TOKEN_SECRET;
export const refreshTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const authenticateToken = async (req: any, res: Response, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" "[1])[0];

  const deviceId = req.headers["user-agent"] || "default-device-id";

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, secretKey!, deviceId);

    const dbToken = await prisma.token.findUnique({ where: { token } });

    if (!dbToken) return res.sendStatus(403);

    req.user = decoded;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
