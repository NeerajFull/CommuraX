
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadAudio } from "../controllers/upload.controller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = express.Router();


router.post("/audio", protectRoute, upload.single("file"), uploadAudio);


export default router;