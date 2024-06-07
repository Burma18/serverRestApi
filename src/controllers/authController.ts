import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../plugins/prisma";
import { secretKey, refreshTokenSecret } from "../middleware/auth";
import { Request, Response } from "express";

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const deviceId = req.headers["user-agent"] || "default-device-id";

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const user = await prisma.user.create({
      data: {
        id: email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id, deviceId }, secretKey!, {
      expiresIn: "10m",
    });
    const refreshToken = jwt.sign(
      { id: user.id, deviceId },
      refreshTokenSecret!
    );

    await prisma.token.create({
      data: {
        userId: user.id,
        token,
        deviceId,
      },
    });

    res.json({ token, refreshToken });
  } catch (error) {
    res.status(400).send("User already exists");
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const deviceId = req.headers["user-agent"] || "default-device-id";

  const user = await prisma.user.findUnique({ where: { id: email } });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id, deviceId }, secretKey!, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign({ id: user.id, deviceId }, refreshTokenSecret!);

  await prisma.token.create({
    data: {
      userId: user.id,
      token,
      deviceId,
    },
  });

  res.json({ token, refreshToken });
};

export const newToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    refreshTokenSecret!,
    async (err: any, decoded: any) => {
      if (err) return res.sendStatus(403);

      const { id: userId, deviceId } = decoded;

      const token = jwt.sign({ id: userId, deviceId }, secretKey!, {
        expiresIn: "10m",
      });

      await prisma.token.create({
        data: {
          userId: userId,
          token,
          deviceId,
        },
      });
      res.json({ token });
    }
  );
};

export const logOut = async (req: any, res: Response) => {
  const { id, deviceId } = req.user;

  await prisma.token.deleteMany({
    where: { userId: id, deviceId },
  });

  res.sendStatus(204);
};

export const getUser = async (req: any, res: Response) => {
  const { id } = req.user;

  const userId = await prisma.user.findUnique({ where: { id } });

  if (!userId) res.status(404).send("User not found");

  res.json(userId);
};
