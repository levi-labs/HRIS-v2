/*
  Warnings:

  - You are about to alter the column `checkIn` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `checkOut` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `leaveType` to the `leave_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendances` MODIFY `checkIn` TIMESTAMP NOT NULL,
    MODIFY `checkOut` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `employee_offices` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `leave_requests` ADD COLUMN `leaveType` ENUM('ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'UNPAID', 'PERSONAL', 'BEREAVEMENT', 'MARRIAGE', 'STUDY', 'RELIGIOUS') NOT NULL;

-- CreateTable
CREATE TABLE `employee_work_schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `scheduleDate` DATETIME(3) NOT NULL,
    `workType` ENUM('WFO', 'WFH') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employee_work_schedules` ADD CONSTRAINT `employee_work_schedules_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
