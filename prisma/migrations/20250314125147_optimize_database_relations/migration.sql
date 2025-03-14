/*
  Warnings:

  - You are about to alter the column `checkIn` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `checkOut` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `status` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `Enum(EnumId(1))`.
  - You are about to drop the column `address` on the `departments` table. All the data in the column will be lost.
  - You are about to drop the column `office_id` on the `employees` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `leave_requests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `Enum(EnumId(2))`.
  - You are about to alter the column `status` on the `payrolls` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Enum(EnumId(3))`.

*/
-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `employees_office_id_fkey`;

-- DropIndex
DROP INDEX `employees_office_id_fkey` ON `employees`;

-- AlterTable
ALTER TABLE `attendances` MODIFY `checkIn` TIMESTAMP NOT NULL,
    MODIFY `checkOut` TIMESTAMP NULL,
    MODIFY `status` ENUM('PRESENT', 'LATE', 'ABSENT', 'SICK', 'LEAVE') NOT NULL DEFAULT 'PRESENT';

-- AlterTable
ALTER TABLE `departments` DROP COLUMN `address`;

-- AlterTable
ALTER TABLE `employees` DROP COLUMN `office_id`;

-- AlterTable
ALTER TABLE `leave_requests` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `payrolls` MODIFY `status` ENUM('PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `department_offices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `departmentId` INTEGER NOT NULL,
    `officeId` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_offices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `officeId` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salary_histories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `oldSalary` DECIMAL(18, 2) NOT NULL,
    `newSalary` DECIMAL(18, 2) NOT NULL,
    `effectiveAt` DATE NOT NULL,
    `updatedBy` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `department_offices` ADD CONSTRAINT `department_offices_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_offices` ADD CONSTRAINT `department_offices_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_offices` ADD CONSTRAINT `employee_offices_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_offices` ADD CONSTRAINT `employee_offices_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salary_histories` ADD CONSTRAINT `salary_histories_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salary_histories` ADD CONSTRAINT `salary_histories_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
