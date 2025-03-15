import { Router } from "express";
import authRouter from "./auth.routes.js";
import roleRouter from "./role.routes.js";
import departmentRouter from "./department.routes.js"
import jobPositionRouter from "./jobPosition.routes.js";
import userRouter from "./user.routes.js";
import officeRouter from "./office.routes.js";

const router = Router();

router.use("/auth",authRouter);
router.use("/role",roleRouter);
router.use("/department",departmentRouter);
router.use("/job-position",jobPositionRouter);
router.use('/user',userRouter);
router.use("/office",officeRouter);



export default router;