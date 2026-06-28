const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Neural Voice Studio</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                background-color: #131224; 
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
                background-color: #1e1b3a; 
                width: 100%; 
                max-width: 440px; 
                border-radius: 16px; 
                padding: 32px 24px; 
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
                box-sizing: border-box;
            }
            h1 { 
                font-size: 28px; 
                font-weight: 700; 
                text-align: center; 
                margin: 0 0 4px 0;
                background: linear-gradient(90deg, #4da1ff, #a67cff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .subtitle { 
                font-size: 13px; 
                color: #8b89a8; 
                text-align: center; 
                margin-bottom: 28px; 
            }
            .form-group {
                margin-bottom: 20px;
            }
            label { 
                font-size: 11px; 
                font-weight: 600; 
                color: #a3a1cc; 
                text-transform: uppercase; 
                letter-spacing: 0.5px; 
                display: block; 
                margin-bottom: 8px; 
            }
            textarea { 
                width: 100%; 
                height: 90px; 
                background-color: #141226; 
                border: 1px solid #2e2a57; 
                border-radius: 8px; 
                color: #ffffff; 
                padding: 12px; 
                font-size: 13px; 
                box-sizing: border-box; 
                resize: none;
                line-height: 1.5;
            }
            textarea:focus {
                border-color: #7c4dff;
                outline: none;
            }
            select { 
                width: 100%; 
                background-color: #141226; 
                border: 1px solid #2e2a57; 
                border-radius: 8px; 
                color: #ffffff; 
                padding: 12px; 
                font-size: 13px; 
                box-sizing: border-box;
                cursor: pointer;
            }
            select:focus {
                border-color: #7c4dff;
                outline: none;
            }
            .slider-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
            }
            .slider-header label {
                margin-bottom: 0;
            }
            .slider-value {
                font-size: 12px;
                color: #a67cff;
                font-weight: 600;
            }
            input[type=range] { 
                width: 100%; 
                accent-color: #a67cff; 
                background: #2e2a57; 
                height: 4px; 
                border-radius: 4px; 
                appearance: none; 
                cursor: pointer;
                margin: 4px 0;
            }
            .slider-subtexts {
                display: flex;
                justify-content: space-between;
                font-size: 9px;
                color: #6d6b8a;
                text-transform: uppercase;
                margin-top: 2px;
                font-weight: 600;
            }
            button { 
                width: 100%; 
                padding: 14px; 
                background: linear-gradient(90deg, #6c5ce7, #a36bf5); 
                color: white; 
                border: none; 
                border-radius: 8px; 
                font-size: 14px; 
                font-weight: 600; 
                cursor: pointer; 
                margin-top: 12px;
                transition: opacity 0.2s;
            }
            button:hover { 
                opacity: 0.9;
            }
            button:disabled { 
                background: #3a375c; 
                color: #716f94;
                cursor: not-allowed; 
            }
            .audio-box { 
                margin-top: 20px; 
                background-color: #141226; 
                padding: 12px; 
                border-radius: 10px; 
                border: 1px solid #2e2a57; 
                display: none; 
            }
            audio { 
                width: 100%; 
                height: 36px;
                accent-color: #a67cff;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Neural Voice Studio</h1>
            <div class="subtitle">Transform text into lifelike speech instantly</div>
            
            <div class="form-group">
                <label>Script</label>
                <textarea id="scriptInput" placeholder="Yahan apna text likhein...">Aap sabhi ka dil se swagat hai. Umeed hai aap sab shaandar, khush aur oorja se bharpoor honge!</textarea>
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
            
            <button id="submitBtn" onclick="processNeuralAudio()">Generate Audio</button>
            
            <div class="audio-box" id="audioPlaybackBlock">
                <label style="color: #a67cff; margin-bottom: 6px;">Generated Audio Track</label>
                <audio id="coreAudioPlayer" controls></audio>
            </div>
        </div>

        <script>
            function processNeuralAudio() {
                const text = document.getElementById('scriptInput').value.trim();
                if(!text) { 
                    alert('Bhai, please text box mein kuch script enter karo!'); 
                    return; 
                }
                
                const btn = document.getElementById('submitBtn');
                const audioBlock = document.getElementById('audioPlaybackBlock');
                const player = document.getElementById('coreAudioPlayer');
                
                btn.disabled = true;
                btn.innerText = 'Synthesizing Neural Track...';
                
                const modelSelection = document.getElementById('voiceModel').value;
                const speedRate = document.getElementById('speedSlider').value / 100;
                
                // Google TTS engine backend simulation for standalone playback
                let langCode = modelSelection.includes('en') ? 'en' : 'hi';
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

// Vercel Serverless handle engine export
module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
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
