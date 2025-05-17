import express from "express";
import { sendOtp, changePassword } from "../controllers/passwordChange.controller.js";

const router = express.Router();

router.post("/send-otp", sendOtp);

router.post("/change-password", changePassword);

export default router;
