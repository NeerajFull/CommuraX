
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadAudio, uploadPhoto } from "../controllers/upload.controller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = express.Router();


router.post("/audio", protectRoute, upload.single("file"), uploadAudio);

router.post("/photo", protectRoute, upload.single("image"), uploadPhoto);




export default router;