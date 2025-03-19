/*
  Warnings:

  - You are about to alter the column `checkIn` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `checkOut` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the column `attendance_id` on the `geolocations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[attendanceId]` on the table `geolocations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attendanceId` to the `geolocations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `geolocations` DROP FOREIGN KEY `geolocations_attendance_id_fkey`;

-- DropIndex
DROP INDEX `geolocations_attendance_id_fkey` ON `geolocations`;

-- AlterTable
ALTER TABLE `attendances` MODIFY `checkIn` TIMESTAMP NOT NULL,
    MODIFY `checkOut` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `geolocations` DROP COLUMN `attendance_id`,
    ADD COLUMN `attendanceId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `geolocations_attendanceId_key` ON `geolocations`(`attendanceId`);

-- AddForeignKey
ALTER TABLE `geolocations` ADD CONSTRAINT `geolocations_attendanceId_fkey` FOREIGN KEY (`attendanceId`) REFERENCES `attendances`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
