const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/popular', async (req, res) => {
  const access_token = req.headers['authorization']?.split(' ')[1];

  if (!access_token) {
    return res.status(400).send('Access token is missing');
  }

  const artistIds = [
    '66CXWjxzNUsdJxJ2JdwvnR',  // Ariana Grande
    '6qqNVTkY8uBg9cP3Jd7DAH',  // Billie Eilish
    '5L1lO4eRHmJ7a0Q6csE5cT',  // LISA
    '4Kxlr1PRlDKEB0ekOCyHgX',  // BIGBANG
    '0du5cEVh5yTK9QJze8zA0C',  // Bruno Mars
    '7tYKF4w9nC0nq9CsPZTHyP',  // SZA
  ];

  try {
    let artistData = [];
    for (let artistId of artistIds) {
      const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      artistData.push(response.data);
    }

    res.json({ data: artistData });

  } catch (error) {
    console.error('Error occurred while fetching artist data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching artist data');
  }
});

module.exports = router;
