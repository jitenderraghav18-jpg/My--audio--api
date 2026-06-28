const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Aapka Audio Data
const audioTracks = [
  {
    id: 1,
    title: "Trending Reel BGM",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Kinetic Typography Beat",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  }
];

app.get('/', (req, res) => {
  res.send('Welcome to my Audio API!');
});

app.get('/api/audio', (req, res) => {
  res.json(audioTracks);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
