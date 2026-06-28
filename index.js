const express = require('express');
const app = express();

app.use(express.json());

// ElevenLabs API Key
const ELEVENLABS_API_KEY = "22f8ffca0012d0011389e7b56d9c6e864b7f80c50b39eb3a8a43e0bbaffc59d1"; 

const hindiMaleVoices = [
  { id: 'cgSgspJ2msm6clMCmAQX', name: 'Bunty (ElevenLabs Premium Male - Energetic)' },
  { id: 'N2lVS1w4EtoT3gGZ7S8d', name: 'Prem (Deep Voice Narrator Male)' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Naman (Professional News/Promo Male)' },
  { id: 'pNInz6obpgfr9ff09S7M', name: 'Kabir (Standard Clear Hindi Male)' }
];

// Backend Route
app.post('/api/generate-voice', async (req, res) => {
    const { text, voiceId, stability, similarityBoost } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Bhai, script text likhna zaroori hai!' });
    }

    try {
        const targetVoice = voiceId || 'cgSgspJ2msm6clMCmAQX';
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}`, {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'content-type': 'application/json',
                'accept': 'audio/mpeg'
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: parseFloat(stability) / 100 || 0.5,
                    similarity_boost: parseFloat(similarityBoost) / 100 || 0.75
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData.detail?.status || errData.detail?.message || 'ElevenLabs Error';
            console.error("ElevenLabs API Error:", errMsg);
            return res.status(response.status).json({ error: errMsg });
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.length);
        return res.send(audioBuffer);

    } catch (error) {
        console.error("Server Crash Caught:", error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// UI Panel with Speed Control & Error Debugging
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Neural Voice Studio Pro - ElevenLabs</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                background: radial-gradient(circle at top, #1a1738 0%, #0d0b18 100%);
                color: #ffffff; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 16px; box-sizing: border-box;
            }
            .container { 
                background: rgba(30, 27, 58, 0.75); backdrop-filter: blur(12px); width: 100%; max-width: 420px; border-radius: 24px; padding: 32px 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.05); box-sizing: border-box;
            }
            h1 { font-size: 24px; font-weight: 700; text-align: center; margin: 0 0 4px 0; background: linear-gradient(135deg, #5099ff, #bc78ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .subtitle { font-size: 12px; color: #79769e; text-align: center; margin-bottom: 28px; }
            .form-group { margin-bottom: 22px; }
            label { font-size: 10px; font-weight: 700; color: #8885b3; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
            textarea { width: 100%; height: 90px; background-color: rgba(13, 11, 24, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; color: #ffffff; padding: 14px; font-size: 13px; box-sizing: border-box; resize: none; line-height: 1.6; }
            select { width: 100%; background-color: rgba(13, 11, 24, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; color: #ffffff; padding: 14px; font-size: 13px; box-sizing: border-box; cursor: pointer; }
            .slider-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            .slider-value { font-size: 12px; color: #b380ff; font-weight: 600; }
            input[type=range] { width: 100%; accent-color: #9256ff; background: #252142; height: 5px; border-radius: 10px; appearance: none; cursor: pointer; }
            button { width: 100%; padding: 15px; background: linear-gradient(90deg, #6c5ce7, #a36bf5); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 10px; box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3); }
            button:disabled { background: #252244; color: #535175; cursor: not-allowed; }
            .audio-box { margin-top: 24px; background-color: rgba(13, 11, 24, 0.8); padding: 16px; border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.05); display: none; }
            audio { width: 100%; margin-top: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Neural Voice Studio Pro</h1>
            <div class="subtitle">ElevenLabs Premium Hindi Multilingual V2</div>
            
            <div class="form-group">
                <label>Hindi Script</label>
                <textarea id="scriptInput">Bhai, ab ElevenLabs ka premium engine connect ho chuka hai. Jo bhi likhoge, ekdum mast professional voice me aayega!</textarea>
            </div>
            
            <div class="form-group">
                <label>Premium Male Voice (Only Hindi)</label>
                <select id="voiceModel">
                    ${hindiMaleVoices.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <div class="slider-header">
                    <label>Stability (Expression)</label>
                    <span class="slider-value" id="stabilityVal">50%</span>
                </div>
                <input type="range" id="stabilitySlider" min="0" max="100" value="50" oninput="document.getElementById('stabilityVal').innerText = this.value + '%'">
            </div>
            
            <div class="form-group">
                <div class="slider-header">
                    <label>Clarity / Similarity Boost</label>
                    <span class="slider-value" id="similarityVal">75%</span>
                </div>
                <input type="range" id="similaritySlider" min="0" max="100" value="75" oninput="document.getElementById('similarityVal').innerText = this.value + '%'">
            </div>

            <!-- Added Voice Speed Option -->
            <div class="form-group">
                <div class="slider-header">
                    <label>Voice Speed (Playback Rate)</label>
                    <span class="slider-value" id="speedVal">1.0x</span>
                </div>
                <input type="range" id="speedSlider" min="0.5" max="2.0" step="0.1" value="1.0" oninput="updateSpeed(this.value)">
            </div>
            
            <button id="submitBtn" onclick="generateElevenLabsAudio()">Generate Professional Audio</button>
            
            <div class="audio-box" id="audioPlaybackBlock">
                <label style="color: #b380ff; display:block; text-align:left; margin-bottom: 5px;">Generated Track</label>
                <audio id="audioPlayer" controls></audio>
            </div>
        </div>

        <script>
            // Live Speed Change Handler
            function updateSpeed(val) {
                document.getElementById('speedVal').innerText = val + 'x';
                const player = document.getElementById('audioPlayer');
                if(player) {
                    player.playbackRate = parseFloat(val);
                }
            }

            async function generateElevenLabsAudio() {
                const text = document.getElementById('scriptInput').value.trim();
                const voiceId = document.getElementById('voiceModel').value;
                const stability = document.getElementById('stabilitySlider').value;
                const similarityBoost = document.getElementById('similaritySlider').value;
                const speed = document.getElementById('speedSlider').value;

                if(!text) { alert('Bhai, text khali hai!'); return; }

                const btn = document.getElementById('submitBtn');
                const audioBlock = document.getElementById('audioPlaybackBlock');
                const player = document.getElementById('audioPlayer');

                btn.disabled = true;
                btn.innerText = 'Generating Audio Track...';

                try {
                    const response = await fetch('/api/generate-voice', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text, voiceId, stability, similarityBoost })
                    });

                    if(!response.ok) { 
                        const errJson = await response.json().catch(() => ({}));
                        throw new Error(errJson.error || 'Server rejected request');
                    }

                    const blob = await response.blob();
                    const audioUrl = URL.createObjectURL(blob);
                    
                    player.src = audioUrl;
                    audioBlock.style.display = 'block';
                    
                    // Apply speed immediately after track loads
                    player.defaultPlaybackRate = parseFloat(speed);
                    player.playbackRate = parseFloat(speed);
                    player.play();

                } catch(e) {
                    alert('Error: ' + e.message + '\\n\\n(Tip: Check if ElevenLabs Key quota is active/valid)');
                } finally {
                    btn.disabled = false;
                    btn.innerText = 'Generate Professional Audio';
                }
            }
        </script>
    </body>
    </html>
  `);
});

module.exports = app;                    <span class="slider-value" id="stabilityVal">50%</span>
                </div>
                <input type="range" id="stabilitySlider" min="0" max="100" value="50" oninput="document.getElementById('stabilityVal').innerText = this.value + '%'">
            </div>
            
            <div class="form-group">
                <div class="slider-header">
                    <label>Clarity / Similarity Boost</label>
                    <span class="slider-value" id="similarityVal">75%</span>
                </div>
                <input type="range" id="similaritySlider" min="0" max="100" value="75" oninput="document.getElementById('similarityVal').innerText = this.value + '%'">
            </div>
            
            <button id="submitBtn" onclick="generateElevenLabsAudio()">Generate Professional Audio</button>
            
            <div class="audio-box" id="audioPlaybackBlock">
                <label style="color: #b380ff; display:block; text-align:left; margin-bottom: 5px;">Generated Track</label>
                <audio id="audioPlayer" controls></audio>
            </div>
        </div>

        <script>
            async function generateElevenLabsAudio() {
                const text = document.getElementById('scriptInput').value.trim();
                const voiceId = document.getElementById('voiceModel').value;
                const stability = document.getElementById('stabilitySlider').value;
                const similarityBoost = document.getElementById('similaritySlider').value;

                if(!text) { alert('Bhai, text khali hai!'); return; }

                const btn = document.getElementById('submitBtn');
                const audioBlock = document.getElementById('audioPlaybackBlock');
                const player = document.getElementById('audioPlayer');

                btn.disabled = true;
                btn.innerText = 'Generating Audio Track...';

                try {
                    const response = await fetch('/api/generate-voice', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text, voiceId, stability, similarityBoost })
                    });

                    if(!response.ok) { throw new Error('Generation Error'); }

                    const blob = await response.blob();
                    const audioUrl = URL.createObjectURL(blob);
                    
                    player.src = audioUrl;
                    audioBlock.style.display = 'block';
                    player.play();

                } catch(e) {
                    alert('Audio generation failed. Ek baar reload karke check karein!');
                } finally {
                    btn.disabled = false;
                    btn.innerText = 'Generate Professional Audio';
                }
            }
        </script>
    </body>
    </html>
  `);
});

module.exports = app;
