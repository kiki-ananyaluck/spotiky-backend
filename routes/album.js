//http://localhost:3000/v1/albums/popular
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/popular', async (req, res) => {
  const access_token = req.headers['authorization']?.split(' ')[1];

  if (!access_token) {
    return res.status(400).send('Access token is missing');
  }

  const albumIds = [
    '5EYKrEDnKhhcNxGedaRQeK',  
    "2nLOHgzXzwFEpl62zAgCEC",  
    "6EVYTRG1drKdO8OnIQBeEj",
    '6Lp82GTJXzgtIopT0g7N7k', 
    '0JGOiO34nwfUdDrD612dOp', 
    '0pIWpPef8UFx8iQ5KSZsYj',  
    '6lqazNXadymQLwUh41qW2K',   
  ];

  try {
    const requests = albumIds.map(albumId =>
      axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
    );

    const responses = await Promise.all(requests);
    const albumData = responses.map(response => response.data);
    res.json({ data: albumData });

  } catch (error) {
    console.error('Error occurred while fetching albums data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching albums data');
  }
});

module.exports = router;
