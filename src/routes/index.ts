import { Router } from "express";
import authRouter from "./auth.routes.js";
import roleRouter from "./role.routes.js";


const router = Router();

router.use("/auth",authRouter);
router.use("/role",roleRouter);


export default router;