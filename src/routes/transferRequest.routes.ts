import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { TransferRequestController } from "../controllers/transferRequest.controller.js";

const router = Router();


router.get("/",AuthMiddleware.checkAuth,TransferRequestController.index);
router.get("/:id",AuthMiddleware.checkAuth,TransferRequestController.show);
router.post("/create-from-employee",AuthMiddleware.checkAuth,TransferRequestController.storeFromEmployee);
router.post("/create-from-hrd",AuthMiddleware.checkAuth,TransferRequestController.storeFromHRD);
router.put("/update-from-employee/:id",AuthMiddleware.checkAuth,TransferRequestController.updateFromEmployee);
router.put("/update-from-hrd/:id",AuthMiddleware.checkAuth,TransferRequestController.updateFromHRD);
router.patch("/approve/:id",AuthMiddleware.checkAuth,TransferRequestController.approve);
router.patch("/reject/:id",AuthMiddleware.checkAuth,TransferRequestController.reject);
router.delete("/:id",AuthMiddleware.checkAuth,TransferRequestController.destroy);

export default router;