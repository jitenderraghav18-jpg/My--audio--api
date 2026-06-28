const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to my Automatic Voice Generator API! Use /api/voice?text=hello');
});

// Yeh endpoint dynamic voice generate karega
app.get('/api/voice', (req, res) => {
  const text = req.query.text;
  
  if (!text) {
    return res.status(400).json({ error: "Please provide a 'text' query parameter. Example: /api/voice?text=Hello" });
  }

  // Google Text-to-Speech ka free link automatic generate hoga
  const encodedText = encodeURIComponent(text);
  const voiceUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=hi&client=tw-ob&q=${encodedText}`;

  // Direct MP3 voice file ya json return karega
  res.json({
    success: true,
    text_spoken: text,
    audio_url: voiceUrl
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
