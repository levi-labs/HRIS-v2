/*
  Warnings:

  - You are about to drop the column `approvedBy` on the `TransferRequest` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `TransferRequest` table. All the data in the column will be lost.
  - You are about to drop the column `fromOffice` on the `TransferRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requestDate` on the `TransferRequest` table. All the data in the column will be lost.
  - You are about to drop the column `toOffice` on the `TransferRequest` table. All the data in the column will be lost.
  - You are about to alter the column `checkIn` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `checkOut` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the column `employeeId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedAt` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `leave_requests` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `leave_requests` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `leave_requests` table. All the data in the column will be lost.
  - You are about to drop the column `leaveType` on the `leave_requests` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `leave_requests` table. All the data in the column will be lost.
  - You are about to alter the column `work_start` on the `office_schedules` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `work_end` on the `office_schedules` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `employeeId` on the `payrolls` table. All the data in the column will be lost.
  - You are about to drop the column `netSalary` on the `payrolls` table. All the data in the column will be lost.
  - You are about to drop the column `payDate` on the `payrolls` table. All the data in the column will be lost.
  - Added the required column `employee_id` to the `TransferRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_office` to the `TransferRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_office` to the `TransferRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_id` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_path` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_id` to the `leave_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `leave_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leave_type` to the `leave_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `leave_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emploee_id` to the `payrolls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `net_salary` to the `payrolls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pay_date` to the `payrolls` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TransferRequest` DROP FOREIGN KEY `TransferRequest_approvedBy_fkey`;

-- DropForeignKey
ALTER TABLE `TransferRequest` DROP FOREIGN KEY `TransferRequest_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `leave_requests` DROP FOREIGN KEY `leave_requests_approvedBy_fkey`;

-- DropForeignKey
ALTER TABLE `leave_requests` DROP FOREIGN KEY `leave_requests_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `payrolls` DROP FOREIGN KEY `payrolls_employeeId_fkey`;

-- DropIndex
DROP INDEX `TransferRequest_approvedBy_fkey` ON `TransferRequest`;

-- DropIndex
DROP INDEX `TransferRequest_employeeId_fkey` ON `TransferRequest`;

-- DropIndex
DROP INDEX `documents_employeeId_fkey` ON `documents`;

-- DropIndex
DROP INDEX `leave_requests_approvedBy_fkey` ON `leave_requests`;

-- DropIndex
DROP INDEX `leave_requests_employeeId_fkey` ON `leave_requests`;

-- DropIndex
DROP INDEX `payrolls_employeeId_fkey` ON `payrolls`;

-- AlterTable
ALTER TABLE `TransferRequest` DROP COLUMN `approvedBy`,
    DROP COLUMN `employeeId`,
    DROP COLUMN `fromOffice`,
    DROP COLUMN `requestDate`,
    DROP COLUMN `toOffice`,
    ADD COLUMN `approved_by` INTEGER NULL,
    ADD COLUMN `employee_id` INTEGER NOT NULL,
    ADD COLUMN `from_office` INTEGER NOT NULL,
    ADD COLUMN `request_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `to_office` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `attendances` MODIFY `checkIn` TIMESTAMP NOT NULL,
    MODIFY `checkOut` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `documents` DROP COLUMN `employeeId`,
    DROP COLUMN `filePath`,
    DROP COLUMN `uploadedAt`,
    ADD COLUMN `employee_id` INTEGER NOT NULL,
    ADD COLUMN `file_path` TEXT NOT NULL,
    ADD COLUMN `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `leave_requests` DROP COLUMN `approvedBy`,
    DROP COLUMN `employeeId`,
    DROP COLUMN `endDate`,
    DROP COLUMN `leaveType`,
    DROP COLUMN `startDate`,
    ADD COLUMN `approved_by` INTEGER NULL,
    ADD COLUMN `employee_id` INTEGER NOT NULL,
    ADD COLUMN `end_date` DATE NOT NULL,
    ADD COLUMN `leave_type` ENUM('ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'UNPAID', 'PERSONAL', 'BEREAVEMENT', 'MARRIAGE', 'STUDY', 'RELIGIOUS') NOT NULL,
    ADD COLUMN `start_date` DATE NOT NULL;

-- AlterTable
ALTER TABLE `office_schedules` MODIFY `work_start` DATETIME NOT NULL,
    MODIFY `work_end` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `payrolls` DROP COLUMN `employeeId`,
    DROP COLUMN `netSalary`,
    DROP COLUMN `payDate`,
    ADD COLUMN `emploee_id` INTEGER NOT NULL,
    ADD COLUMN `net_salary` DECIMAL(18, 2) NOT NULL,
    ADD COLUMN `pay_date` DATE NOT NULL;

-- AddForeignKey
ALTER TABLE `leave_requests` ADD CONSTRAINT `leave_requests_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leave_requests` ADD CONSTRAINT `leave_requests_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransferRequest` ADD CONSTRAINT `TransferRequest_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransferRequest` ADD CONSTRAINT `TransferRequest_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payrolls` ADD CONSTRAINT `payrolls_emploee_id_fkey` FOREIGN KEY (`emploee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
