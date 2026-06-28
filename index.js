const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Neural Voice Studio Pro</title>
        <style>
            body { font-family: 'Segoe UI', Roboto, sans-serif; background: #070a13; color: #f3f4f6; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .card { background: #0f1626; width: 100%; max-width: 480px; border-radius: 24px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); border: 1px solid #1e293b; position: relative; overflow: hidden; }
            .card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); }
            h1 { font-size: 26px; font-weight: 800; margin: 0; text-align: center; background: linear-gradient(135deg, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px; }
            .subtitle { font-size: 13px; color: #94a3b8; text-align: center; margin-top: 6px; margin-bottom: 30px; }
            label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
            textarea { width: 100%; height: 110px; background: #090d16; border: 1px solid #1e293b; border-radius: 12px; color: white; padding: 14px; font-size: 14px; box-sizing: border-box; resize: none; margin-bottom: 22px; transition: 0.3s; }
            textarea:focus { border-color: #6366f1; outline: none; box-shadow: 0 0 10px rgba(99, 102, 241, 0.2); }
            select { width: 100%; background: #090d16; border: 1px solid #1e293b; border-radius: 12px; color: white; padding: 14px; font-size: 14px; margin-bottom: 22px; cursor: pointer; transition: 0.3s; }
            select:focus { border-color: #6366f1; outline: none; }
            .slider-group { margin-bottom: 20px; }
            .slider-header { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 6px; }
            .slider-header span.val { color: #38bdf8; font-family: monospace; font-size: 12px; }
            input[type=range] { width: 100%; accent-color: #6366f1; background: #1e293b; height: 6px; border-radius: 8px; appearance: none; cursor: pointer; }
            .slider-labels { display: flex; justify-content: space-between; font-size: 9px; color: #64748b; margin-top: 5px; text-transform: uppercase; font-weight: 600; }
            button { width: 100%; padding: 16px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 15px; box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4); transition: 0.3s; }
            button:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(79, 70, 229, 0.6); }
            button:disabled { background: #334155; cursor: not-allowed; box-shadow: none; transform: none; }
            .audio-container { margin-top: 25px; background: #090d16; padding: 12px; border-radius: 14px; border: 1px solid #1e293b; display: none; animation: fadeIn 0.4s ease; }
            audio { width: 100%; height: 40px; accent-color: #6366f1; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Neural Voice Studio Pro</h1>
            <div class="subtitle">Advanced Text-to-Speech Hyper-Engine</div>
            
            <label>Script / Line</label>
            <textarea id="textInput" placeholder="Yahan apni line likhein jise bolwana hai...">Hello bhai, kaise ho? Ghar par sab badhiya?</textarea>
            
            <label>Voice Model (Male & Female AI)</label>
            <select id="voiceModel">
                <option value="hi">Hindi Standard (Premium Multi-Lingual)</option>
                <option value="en">English Standard (Advanced Deep)</option>
            </select>
            
            <div class="slider-group">
                <div class="slider-header"><span>STABILITY & PITCH (TONE)</span><span class="val" id="pitchVal">Balanced</span></div>
                <input type="range" id="pitchSlider" min="1" max="3" value="2" oninput="updatePitchLabel(this.value)">
                <div class="slider-labels"><span>Deep Heavy Male</span><span>Balanced</span><span>Expressive Female / High</span></div>
            </div>
            
            <div class="slider-group">
                <div class="slider-header"><span>CLARITY & SPEED</span><span class="val" id="speedVal">1.00x</span></div>
                <input type="range" id="speedSlider" min="60" max="140" value="100" oninput="document.getElementById('speedVal').innerText = (this.value/100).toFixed(2) + 'x'">
                <div class="slider-labels"><span>Slow Motion</span><span>Ultra Fast</span></div>
            </div>
            
            <button id="genBtn" onclick="generateExtremeAudio()">Generate Audio</button>
            
            <div class="audio-container" id="audioBox">
                <label style="margin-bottom: 8px; color: #38bdf8;">Generated Master Track</label>
                <audio id="audioPlayer" controls></audio>
            </div>
        </div>

        <script>
            function updatePitchLabel(val) {
                const lbl = document.getElementById('pitchVal');
                if(val == "1") lbl.innerText = "Heavy Deep (Male)";
                if(val == "2") lbl.innerText = "Balanced";
                if(val == "3") lbl.innerText = "High Pitch (Female / Kids)";
            }

            function generateExtremeAudio() {
                const text = document.getElementById('textInput').value;
                if(!text) { alert('Bhai, pehle script box mein kuch likho!'); return; }
                
                const btn = document.getElementById('genBtn');
                const audioBox = document.getElementById('audioBox');
                const player = document.getElementById('audioPlayer');
                
                btn.disabled = true;
                btn.innerText = 'Synthesizing Neural Track...';
                
                const lang = document.getElementById('voiceModel').value;
                const speed = document.getElementById('speedSlider').value / 100;
                const pitchMode = document.getElementById('pitchSlider').value;
                
                const encodedText = encodeURIComponent(text);
                let streamUrl = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=' + lang + '&client=tw-ob&q=' + encodedText;
                
                player.src = streamUrl;
                audioBox.style.display = 'block';
                
                player.defaultPlaybackRate = speed;
                player.playbackRate = speed;
                
                if(pitchMode == "1") {
                    player.playbackRate = speed * 0.82;
                } else if(pitchMode == "3") {
                    player.playbackRate = speed * 1.25;
                }

                player.load();
                
                player.oncanplaythrough = function() {
                    player.play();
                    btn.disabled = false;
                    btn.innerText = 'Generate Audio';
                };

                player.onerror = function() {
                    alert('Audio load hone me thodi dikkat hui, dobara Generate par click karein!');
                    btn.disabled = false;
                    btn.innerText = 'Generate Audio';
                };
            }
        </script>
    </body>
    </html>
  `);
});

// Vercel serverless environment support ke liye export kiya
module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});                    player.play();
                    btn.disabled = false;
                    btn.innerText = 'Generate Audio';
                };

                player.onerror = function() {
                    alert('Audio load hone me thodi dikkat hui, dobara Generate par click karein!');
                    btn.disabled = false;
                    btn.innerText = 'Generate Audio';
                };
            }
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});                };

                player.onerror = function() {
                    alert('Audio generate karne mein dikkat aayi, dobara try karein.');
                    btn.disabled = false;
                    btn.innerText = 'Generate Audio';
                };
            }
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
