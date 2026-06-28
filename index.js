const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Neural Voice Studio</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                background: radial-gradient(circle at top, #1a1738 0%, #0d0b18 100%);
                color: #ffffff; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                margin: 0; 
                padding: 16px;
                box-sizing: border-box;
            }
            .container { 
                background: rgba(30, 27, 58, 0.75);
                backdrop-filter: blur(12px);
                width: 100%; 
                max-width: 420px; 
                border-radius: 24px; 
                padding: 32px 24px; 
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.05);
                box-sizing: border-box;
            }
            h1 { 
                font-size: 26px; 
                font-weight: 700; 
                text-align: center; 
                margin: 0 0 6px 0;
                background: linear-gradient(135deg, #5099ff, #bc78ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                letter-spacing: -0.5px;
            }
            .subtitle { 
                font-size: 12px; 
                color: #79769e; 
                text-align: center; 
                margin-bottom: 28px; 
            }
            .form-group {
                margin-bottom: 22px;
            }
            label { 
                font-size: 10px; 
                font-weight: 700; 
                color: #8885b3; 
                text-transform: uppercase; 
                letter-spacing: 1px; 
                display: block; 
                margin-bottom: 8px; 
            }
            textarea { 
                width: 100%; 
                height: 100px; 
                background-color: rgba(13, 11, 24, 0.6); 
                border: 1px solid rgba(255, 255, 255, 0.08); 
                border-radius: 12px; 
                color: #ffffff; 
                padding: 14px; 
                font-size: 13px; 
                box-sizing: border-box; 
                resize: none;
                line-height: 1.6;
                transition: border 0.2s;
            }
            textarea:focus {
                border-color: #9256ff;
                outline: none;
            }
            select { 
                width: 100%; 
                background-color: rgba(13, 11, 24, 0.6); 
                border: 1px solid rgba(255, 255, 255, 0.08); 
                border-radius: 12px; 
                color: #ffffff; 
                padding: 14px; 
                font-size: 13px; 
                box-sizing: border-box;
                cursor: pointer;
                appearance: none;
            }
            .slider-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            .slider-header label {
                margin-bottom: 0;
            }
            .slider-value {
                font-size: 12px;
                color: #b380ff;
                font-weight: 600;
            }
            input[type=range] { 
                width: 100%; 
                accent-color: #9256ff; 
                background: #252142; 
                height: 5px; 
                border-radius: 10px; 
                appearance: none; 
                cursor: pointer;
                margin: 6px 0;
            }
            .slider-subtexts {
                display: flex;
                justify-content: space-between;
                font-size: 9px;
                color: #58557a;
                text-transform: uppercase;
                margin-top: 4px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }
            button { 
                width: 100%; 
                padding: 15px; 
                background: linear-gradient(90deg, #6c5ce7, #a36bf5); 
                color: white; 
                border: none; 
                border-radius: 12px; 
                font-size: 14px; 
                font-weight: 600; 
                cursor: pointer; 
                margin-top: 10px;
                box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
                transition: all 0.2s;
            }
            button:hover { 
                opacity: 0.95;
                transform: translateY(-1px);
            }
            button:disabled { 
                background: #252244; 
                color: #535175;
                cursor: not-allowed; 
                box-shadow: none;
                transform: none;
            }
            .audio-box { 
                margin-top: 24px; 
                background-color: rgba(13, 11, 24, 0.8); 
                padding: 16px; 
                border-radius: 14px; 
                border: 1px solid rgba(255, 255, 255, 0.05); 
                display: none; 
            }
            audio { 
                width: 100%; 
                height: 40px;
                margin-top: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Neural Voice Studio</h1>
            <div class="subtitle">Transform text into lifelike speech instantly</div>
            
            <div class="form-group">
                <label>Script</label>
                <textarea id="scriptInput" placeholder="Yahan apna script text enter karein...">Aap sabhi ka dil se swagat hai. Umeed hai aap sab shaandar, khush aur oorja se bharpoor honge!</textarea>
            </div>
            
            <div class="form-group">
                <label>Voice Model</label>
                <select id="voiceModel">
                    <option value="hi-IN">Monklia (Hindi Premium)</option>
                    <option value="en-US">Rachel (English Custom)</option>
                    <option value="hi-IN-male">Aditya (Hindi Male)</option>
                </select>
            </div>
            
            <div class="form-group">
                <div class="slider-header">
                    <label>Stability</label>
                    <span class="slider-value" id="stabilityVal">50%</span>
                </div>
                <input type="range" id="stabilitySlider" min="0" max="100" value="50" oninput="document.getElementById('stabilityVal').innerText = this.value + '%'">
                <div class="slider-subtexts">
                    <span>More Variable</span>
                    <span>More Stable</span>
                </div>
            </div>
            
            <div class="form-group">
                <div class="slider-header">
                    <label>Similarity Boost</label>
                    <span class="slider-value" id="similarityVal">75%</span>
                </div>
                <input type="range" id="similaritySlider" min="0" max="100" value="75" oninput="document.getElementById('similarityVal').innerText = this.value + '%'">
                <div class="slider-subtexts">
                    <span>Low</span>
                    <span>High</span>
                </div>
            </div>
            
            <div class="form-group">
                <div class="slider-header">
                    <label>Speed</label>
                    <span class="slider-value" id="speedVal">1.00x</span>
                </div>
                <input type="range" id="speedSlider" min="70" max="125" value="100" oninput="document.getElementById('speedVal').innerText = (this.value/100).toFixed(2) + 'x'">
                <div class="slider-subtexts">
                    <span>Slower (0.7x)</span>
                    <span>Faster (1.25x)</span>
                </div>
            </div>
            
            <button id="submitBtn" onclick="generateNeuralAudio()">Generate Audio</button>
            
            <div class="audio-box" id="audioPlaybackBlock">
                <label style="color: #b380ff;">Generated Master Track</label>
                <audio id="coreAudioPlayer" controls></audio>
            </div>
        </div>

        <script>
            function generateNeuralAudio() {
                const text = document.getElementById('scriptInput').value.trim();
                if(!text) { 
                    alert('Bhai, text box khali hai! Kuch type toh karo.'); 
                    return; 
                }
                
                const btn = document.getElementById('submitBtn');
                const audioBlock = document.getElementById('audioPlaybackBlock');
                const player = document.getElementById('coreAudioPlayer');
                
                btn.disabled = true;
                btn.innerText = 'Synthesizing Neural Track...';
                
                const modelSelection = document.getElementById('voiceModel').value;
                const speedRate = document.getElementById('speedSlider').value / 100;
                
                let langCode = modelSelection.includes('en') ? 'en' : 'hi';
                // Direct high-speed endpoint mapping bypasses Vercel 10s Serverless limitation completely
                const audioUrl = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=' + langCode + '&client=tw-ob&q=' + encodeURIComponent(text);
                
                player.src = audioUrl;
                audioBlock.style.display = 'block';
                
                player.defaultPlaybackRate = speedRate;
                player.playbackRate = speedRate;
                player.load();
                
                player.oncanplaythrough = function() {
                    player.play();
                    btn.disabled = false;
                    btn.innerText = 'Generate Audio';
                };

                player.onerror = function() {
                    alert('Audio build error. Ek baar text chota karke check karein!');
                    btn.disabled = false;
                    btn.innerText = 'Generate Audio';
                };
            }
        </script>
    </body>
    </html>
  `);
});

module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is active on port ${PORT}`);
});
