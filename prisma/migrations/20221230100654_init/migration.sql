/*
  Warnings:

  - You are about to drop the column `ownerId` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pets` DROP FOREIGN KEY `pets_ownerId_fkey`;

-- AlterTable
ALTER TABLE `pets` DROP COLUMN `ownerId`,
    ADD COLUMN `owner_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `isAdmin`,
    DROP COLUMN `lastName`,
    ADD COLUMN `is_admin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `pets` ADD CONSTRAINT `pets_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
