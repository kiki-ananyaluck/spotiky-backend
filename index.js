// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const loginRoutes = require('./routes/login');
const callbackRoutes = require('./routes/callback');
const searchRoutes = require('./routes/search');
const artistRoutes = require('./routes/artist');
const albumRoutes = require('./routes/album');
const playlistRoutes = require('./routes/playlist');

dotenv.config();

const app = express();
const port = 3000;

// กำหนด CORS เพื่ออนุญาตการเข้าถึงจาก frontend
app.use(cors());
app.use(express.json());

// ใช้ route สำหรับแต่ละเส้นทาง
app.use('/v1/login', loginRoutes);
app.use('/v1/callback', callbackRoutes);
app.use('/v1/search', searchRoutes);
app.use('/v1/artist', artistRoutes);
app.use('/v1/album', albumRoutes);
app.use('/v1/playlist', playlistRoutes);

// เริ่มต้น server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
