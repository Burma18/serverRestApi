/*
  Warnings:

  - Added the required column `extension` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `file` ADD COLUMN `extension` VARCHAR(191) NOT NULL,
    ADD COLUMN `path` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `token` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
