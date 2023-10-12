/*
  Warnings:

  - You are about to alter the column `isAdmin` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `isAdmin` BOOLEAN NOT NULL DEFAULT false;
