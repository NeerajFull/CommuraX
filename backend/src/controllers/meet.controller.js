import { google } from 'googleapis';
import { v4 } from 'uuid';
import Integration from '../models/Integration.js';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_YOUR_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/calendar.events'];

export const createMeetingLink = async (req, res) => {
    const integration = await Integration.findOne({ userId: req.user.id });
    // Check if the token is available (if not, redirect to /auth/google)
    if (!integration || !integration.accessToken || integration.accessToken.length <= 0) {
        return res.status(401).json({ message: 'User not authenticated with Google, Please Activate Google Meet' });
    }

    oauth2Client.setCredentials(integration.accessToken[0]); // Set credentials again here

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
}

export const getGoogleAuthUrl = (req, res) => {
    const { userId } = req.query;
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: userId
    });
    res.redirect(url);
}


export const getGoogleAuthCallback = async (req, res) => {
    const { code, state: userId } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const saveAccessToken = await Integration.findOneAndUpdate({
        userId,
    }, {
        accessToken: [tokens],
        appName: 'Google Meet',
        status: 'Disconnect'
    }, { new: true, upsert: true });

    if (!saveAccessToken) {
        console.error('Error saving access token:', saveAccessToken);
        return res.status(500).send('Error saving access token.');
    }

    res.send(`
        <html>
          <body>
          'Google Meet integration successful! You can now create meetings and CLOSE this WINDOW.'
            <script>
              window.opener.postMessage({
  type: 'GOOGLE_AUTH',
  userData: ${JSON.stringify(saveAccessToken)}
}, '*');
              window.close();
            </script>
          </body>
        </html>
    `);
}