//http://localhost:3000/v1/artist/popular
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/popular', async (req, res) => {
  const access_token = req.headers['authorization']?.split(' ')[1];

  if (!access_token) {
    return res.status(400).send('Access token is missing');
  }

  const albumIds = [
    '5o0ieLlI55HqA0S5wpdbaV',
    '2ms85RNimem9kypged9aM7',
    '4GvkHkDoJGVy8kxRuCq1JB',
    '03FA71b0KtKV4nHSythgo4',
    '7slo2naOriSftf01o1CPFK',
    '3Ir5YWemOTGRRfXgROrsDV'
  ];

  try {
    const requests = albumIds.map(albumId =>
      axios.get(`https://api.spotify.com/v1/playlists/${albumId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
    );

    const responses = await Promise.all(requests);
    const albumData = responses.map(response => response.data);
    res.json({ data: albumData });

  } catch (error) {
    console.error('Error occurred while fetching playlists data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching playlists data');
  }
});

router.post('/create', async (req, res) => {
  const { user_id, name, description, public } = req.body;
  const access_token = req.headers['authorization']?.split(' ')[1];

  if (!access_token) {
    return res.status(400).send('Access token is missing');
  }

  if (!user_id || !name || description === undefined || public === undefined) {
    return res.status(400).send('User ID, name, description, and public status must be provided');
  }

  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${user_id}/playlists`,
      {
        name,
        description,
        public,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    res.json({
      playlist: response.data,
    });

  } catch (error) {
    console.error('Error occurred while creating playlist:', error.response ? error.response.data : error.message);
    res.status(500).send('Error creating playlist');
  }
});

router.get('/by-id', async (req, res) => {
  const access_token = req.headers['authorization']?.split(' ')[1];
  const { playlist_id } = req.query;

  if (!access_token) {
    return res.status(400).send('Access token is missing');
  }

  if (!playlist_id) {
    return res.status(400).send('playlist_id must be provided');
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlist_id}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    res.json({
      playlist: response.data,
    });

  } catch (error) {
    console.error('Error occurred while get playlist by_id:', error.response ? error.response.data : error.message);
    res.status(500).send('Error get playlist by_id');
  }
});

router.post('/add-track', async (req, res) => {
  const access_token = req.headers['authorization']?.split(' ')[1];
  const { playlist_id, uris, position } = req.body;
  console.log("playlist_id",playlist_id)

  if (!access_token) {
    return res.status(400).send('Access token is missing');
  }

  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      {
        uris,
        position,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    res.status(200).send({
      message: 'Tracks added successfully',
      data: response.data,
    });

  } catch (error) {
    console.error('Error occurred while add track playlist by_id:', error.response ? error.response.data : error.message);
    res.status(500).send('Error add track playlist by_id');
  }
});

router.delete('/delete-track', async (req, res) => {
  const access_token = req.headers['authorization']?.split(' ')[1];
  const { tracks, snapshot_id } = req.body;
  const { playlist_id } = req.query;

  // ตรวจสอบว่ามี access_token หรือไม่
  if (!access_token) {
    return res.status(400).send('Access token is missing');
  }

  // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
  if (!tracks || !snapshot_id || !playlist_id) {
    return res.status(400).send('tracks, snapshot_id, and playlist_id must be provided');
  }

  // ตรวจสอบข้อมูล tracks, snapshot_id, playlist_id
  console.log("Tracks:", tracks);
  console.log("Snapshot ID:", snapshot_id);
  console.log("Playlist ID:", playlist_id);

  // แปลง track URIs ให้เป็นรูปแบบที่ Spotify API รองรับ
  const formattedTracks = tracks.map(track => ({
    uri: `spotify:track:${track.uri}`, // แน่ใจว่า track URI ถูกต้อง
  }));

  console.log("Formatted Tracks:", formattedTracks);

  try {
    // ส่งคำขอไปยัง Spotify API เพื่อทำการลบเพลง
    const response = await axios.delete(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`, // ใช้ access token ในการยืนยันตัวตน
        },
        data: {
          tracks: formattedTracks, // ส่ง tracks ที่ถูกต้อง
          snapshot_id: snapshot_id, // ส่ง snapshot_id ที่ถูกต้อง
        },
      }
    );

    // ส่งข้อมูลการตอบกลับว่า track ถูกลบสำเร็จ
    res.status(200).send({
      message: 'Tracks deleted successfully',
      data: response.data,
    });
  } catch (error) {
    // จัดการข้อผิดพลาดที่เกิดขึ้นระหว่างการลบเพลง
    console.error('Error occurred while deleting track from playlist:', error.response ? error.response.data : error.message);
    res.status(500).send({
      message: 'Error deleting track from playlist',
      error: error.response ? error.response.data : error.message,
    });
  }
});

router.get('/get-by-user-id', async (req, res) => {
  const access_token = req.headers['authorization']?.split(' ')[1];
  const { user_id } = req.query;

  if (!access_token) {
    return res.status(400).send('Access token is missing');
  }

  if (!user_id) {
    return res.status(400).send('user_id must be provided');
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/users/${user_id}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    res.json({
      playlist: response.data,
    });

  } catch (error) {
    console.error('Error occurred while get-by-user-id:', error.response ? error.response.data : error.message);
    res.status(500).send('Error get-by-user-id');
  }
});

module.exports = router;
