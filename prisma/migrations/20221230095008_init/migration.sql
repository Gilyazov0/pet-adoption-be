/*
  Warnings:

  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_admin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `pet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_savedpets` DROP FOREIGN KEY `_SavedPets_A_fkey`;

-- DropForeignKey
ALTER TABLE `pet` DROP FOREIGN KEY `pet_owner_id_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `first_name`,
    DROP COLUMN `is_admin`,
    DROP COLUMN `last_name`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `pet`;

-- CreateTable
CREATE TABLE `pets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `adoption_status` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NOT NULL,
    `height` DOUBLE NOT NULL,
    `weight` DOUBLE NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `dietary` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `hypoallergenic` BOOLEAN NOT NULL,
    `breed` VARCHAR(191) NULL,
    `ownerId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pets` ADD CONSTRAINT `pets_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SavedPets` ADD CONSTRAINT `_SavedPets_A_fkey` FOREIGN KEY (`A`) REFERENCES `pets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
