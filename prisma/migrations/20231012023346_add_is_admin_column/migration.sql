-- AlterTable
ALTER TABLE `User` ADD COLUMN `isAdmin` ENUM('TRUE', 'FALSE') NOT NULL DEFAULT 'FALSE';