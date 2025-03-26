import { Router } from "express";
import { DocumentController } from "../controllers/document.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.get("/", DocumentController.index);
router.get("/:id", DocumentController.show);
router.post("/",upload.single("file"), DocumentController.store);
router.put("/:id",upload.single("file"), DocumentController.update);
router.delete("/:id", DocumentController.destroy);




export default router;