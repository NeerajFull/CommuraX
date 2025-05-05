
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createMeetingLink, getGoogleAuthCallback, getGoogleAuthUrl } from '../controllers/meet.controller.js';

const router = express.Router();


router.get('/auth/google', getGoogleAuthUrl);

router.get('/create-meet', protectRoute, createMeetingLink);


router.get('/oauth2callback', getGoogleAuthCallback);


export default router;
