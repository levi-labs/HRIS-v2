/*
  Warnings:

  - You are about to alter the column `checkIn` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `checkOut` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `work_start` on the `office_schedules` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `work_end` on the `office_schedules` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `attendances` MODIFY `checkIn` TIMESTAMP NOT NULL,
    MODIFY `checkOut` TIMESTAMP NULL,
    MODIFY `status` ENUM('EARLY', 'OVERTIME', 'PRESENT', 'LATE', 'ABSENT', 'SICK', 'LEAVE') NOT NULL DEFAULT 'PRESENT';

-- AlterTable
ALTER TABLE `office_schedules` MODIFY `work_start` DATETIME NOT NULL,
    MODIFY `work_end` DATETIME NOT NULL;
