import { Router } from "express";
import authRouter from "./auth.routes.js";
import roleRouter from "./role.routes.js";
import departmentRouter from "./department.routes.js"
import jobPositionRouter from "./jobPosition.routes.js";
import userRouter from "./user.routes.js";
import officeRouter from "./office.routes.js";
import officeScheduleRouter from "./officeSchedule.routes.js";
import employeeRouter from "./employee.routes.js";
import employeeScheduleRouter from "./employeeSchedule.routes.js";
import employeeOfficeRouter from "./employeeOffice.routes.js";
import attendanceRouter from "./attendance.routes.js";
import transferRequestRouter from "./transferRequest.routes.js";

const router = Router();

router.use("/auth",authRouter);
router.use("/role",roleRouter);
router.use("/department",departmentRouter);
router.use("/job-position",jobPositionRouter);
router.use('/user',userRouter);
router.use("/office",officeRouter);
router.use("/office-schedule",officeScheduleRouter);
router.use("/employee",employeeRouter);
router.use("/employee-schedule",employeeScheduleRouter);
router.use("/employee-office",employeeOfficeRouter);
router.use("/attendance",attendanceRouter);
router.use("/transfer-request",transferRequestRouter);


export default router;