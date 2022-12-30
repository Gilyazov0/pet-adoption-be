/*
  Warnings:

  - You are about to alter the column `type` on the `pets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `adoption_status` on the `pets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `pets` MODIFY `type` ENUM('Dog', 'Cat', 'Other') NOT NULL,
    MODIFY `adoption_status` ENUM('Adopted', 'Available', 'Fostered') NOT NULL;
