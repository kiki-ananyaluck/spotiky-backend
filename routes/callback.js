const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code missing');
    }

    // ใช้ authorization code เพื่อแลกเป็น access token
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);
    data.append('client_id', process.env.SPOTIFY_CLIENT_ID);
    data.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);

    try {
        const response = await axios.post(tokenUrl, data, { headers });
        const { access_token, refresh_token } = response.data;

        // Use the access token to get the user data from Spotify
        const userDataResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            }
        });

        const { id } = userDataResponse.data;

        // ส่งผลลัพธ์กลับไปยัง frontend
        res.json({
            access_token,
            refresh_token,
            user_id: id,  // Send the user id
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving access token or user data');
    }
});

module.exports = router;
