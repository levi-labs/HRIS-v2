/*
  Warnings:

  - You are about to alter the column `checkIn` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `checkOut` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `day` on the `office_schedules` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Enum(EnumId(4))`.
  - You are about to alter the column `work_start` on the `office_schedules` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Time`.
  - You are about to alter the column `work_end` on the `office_schedules` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Time`.

*/
-- AlterTable
ALTER TABLE `attendances` MODIFY `checkIn` TIMESTAMP NOT NULL,
    MODIFY `checkOut` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `office_schedules` MODIFY `day` ENUM('SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU') NOT NULL,
    MODIFY `work_start` TIME NOT NULL,
    MODIFY `work_end` TIME NOT NULL;
