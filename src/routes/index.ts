import { Router } from "express";
import authRouter from "./auth.routes.js";
import roleRouter from "./role.routes.js";
import departmentRouter from "./department.routes.js"

const router = Router();

router.use("/auth",authRouter);
router.use("/role",roleRouter);
router.use("/department",departmentRouter)


export default router;