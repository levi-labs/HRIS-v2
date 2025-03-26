import fs from "fs";
import multer from "multer";
import { ResponseError } from "../error/response.errors.js";
import path from "path";

const uploadDirectory = 'uploads/documents';
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}
 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix +path.extname(file.originalname));
    }
 });

 const fileFilter = (req:any, file:Express.Multer.File, cb:Function) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
 }
 export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    }
  });
