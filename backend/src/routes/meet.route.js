import { google } from 'googleapis';
import express from 'express';
import { v4 } from 'uuid';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_YOUR_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/calendar.events'];

// Store tokens globally (for testing, not recommended for production)
let storedTokens = null;

router.get('/auth/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    res.redirect(url);
});

router.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens globally (you can also store this in your database)
    storedTokens = tokens;

    // Redirect to create-meet endpoint after successful authentication
    res.redirect('/create-meet');
    // res.redirect('/auth/google');
});

router.get('/create-meet', async (req, res) => {
    // Check if the token is available (if not, redirect to /auth/google)
    if (!storedTokens) {
        return res.redirect('/auth/google'); 
        // return res.status(401).send('Unauthorized: Please Integrate Google Meet');
    }

    oauth2Client.setCredentials(storedTokens); // Set credentials again here

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
        summary: 'Video Call Meeting',
        start: {
            dateTime: new Date().toISOString(),
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: new Date(new Date().getTime() + 30 * 60000).toISOString(),
            timeZone: 'Asia/Kolkata',
        },
        conferenceData: {
            createRequest: {
                requestId: v4(),
                conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
        },
    };

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });

        const meetLink = response.data.conferenceData.entryPoints.find(
            (entry) => entry.entryPointType === 'video'
        ).uri;

        res.send(meetLink);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating meeting.');
    }
});

export default router;
