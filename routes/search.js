const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const { query } = req.query;  // รับคำค้นหาจาก query string

    // รับ access_token จาก header Authorization
    const access_token = req.headers['authorization']?.split(' ')[1];

    if (!query || !access_token) {
        return res.status(400).send('Query or access token is missing');
    }

    try {
        // ทำการค้นหาเพลงจาก Spotify
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        // ส่งผลลัพธ์กลับไปยัง frontend
        res.json(response.data);
    } catch (error) {
        console.error('Error occurred while searching for tracks:', error);
        res.status(500).send('Error searching for tracks');
    }
});

module.exports = router;
