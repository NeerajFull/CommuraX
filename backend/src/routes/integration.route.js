import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getIntegrationsByUserId, removeIntegration } from "../controllers/integration.controller.js";

const router = express.Router();


router.get("/get-integrations/", protectRoute, getIntegrationsByUserId);

router.delete("/remove-integration/", protectRoute, removeIntegration);


export default router;