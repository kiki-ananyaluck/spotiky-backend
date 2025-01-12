const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
  // ระบุ scopes ที่ต้องการ
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-modify-public',
    'playlist-modify-private'
  ];
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  // สร้าง URL สำหรับการเชื่อมต่อกับ Spotify API
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scopes}&redirect_uri=${redirect_uri}`;

  res.redirect(authUrl);
});

router.get('/profile', async (req, res) => {
    const { user_id } = req.query;

    const access_token = req.headers['authorization']?.split(' ')[1];

    // if (!user_id || !access_token) {
    //     return res.status(400).send('Query or access token is missing');
    // }

    try {
        const response = await axios.get(`https://api.spotify.com/v1/users/${user_id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error occurred while searching for tracks:', error);
        res.status(500).send('Error searching for tracks');
    }
});

module.exports = router;
