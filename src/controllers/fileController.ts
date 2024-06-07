import { Request, Response } from "express";
import prisma from "../plugins/prisma";
import path from "path";
import fs from "fs";

export const uploadFile = async (req: any, res: Response) => {
  const file = req.file;

  const user = req.user;

  if (!file) return res.status(400).send("No file uploaded");

  const fileData = {
    name: file.originalname,
    extension: path.extname(file.originalname),
    mimeType: file.mimetype,
    size: file.size,
    path: file.path,
    uploadDate: new Date(),
    userId: user.id,
  };

  const dbFile = await prisma.file.create({
    data: fileData,
  });

  res.json(dbFile);
};

export const listFiles = async (req: Request, res: Response) => {
  const { list_size = 10, page = 1 } = req.query;
  const offset = (+page - 1) * +list_size;

  const files = await prisma.file.findMany({
    take: +list_size,
    skip: offset,
  });

  res.json(files);
};

export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  const file = await prisma.file.findUnique({ where: { id: +id } });

  if (!file) return res.status(404).send("File not found");

  try {
    fs.unlinkSync(file.path);
    await prisma.file.delete({ where: { id: +id } });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to delete file");
  }
};

export const getFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  const file = await prisma.file.findUnique({ where: { id: +id } });

  if (!file) return res.status(404).send("File not found");

  res.json(file);
};

export const downloadFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = await prisma.file.findUnique({ where: { id: +id } });

  if (!file) return res.status(404).send("File not found");

  const filePath = path.join(__dirname, "..", "..", file.path);

  res.setHeader("Content-Type", file.mimeType);
  res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);

  res.sendFile(filePath);
};

export const updateFile = async (req: any, res: Response) => {
  const user = req.user;
  const { id } = req.params;

  const file = await prisma.file.findUnique({ where: { id: +id } });

  if (!file) return res.status(404).send("File not found");

  try {
    const newFile = req.file;

    if (!newFile) return res.status(400).send("No file uploaded");

    const fileData = {
      name: newFile.originalname,
      extension: path.extname(newFile.originalname),
      mimeType: newFile.mimetype,
      size: newFile.size,
      path: newFile.path,
      uploadDate: new Date(),
      userId: user.id,
    };

    fs.unlinkSync(file.path);

    const updatedFile = await prisma.file.update({
      where: { id: +id },
      data: fileData,
    });

    res.json(updatedFile);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update file");
  }
};
