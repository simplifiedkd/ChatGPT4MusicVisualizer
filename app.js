const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const audio = document.getElementById('myAudio');
const playButton = document.getElementById('playButton');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);

let isVisualizing = false;

playButton.addEventListener('click', async () => {
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  if (audio.paused) {
    audio.play();

    if (!isVisualizing) {
      visualize();
      isVisualizing = true;
    }
  } else {
    audio.pause();
  }
});

function visualize() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  function renderFrame() {
    requestAnimationFrame(renderFrame);

    x = 0;

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      ctx.fillStyle = `rgb(${barHeight}, 50, 50)`;
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

      x += barWidth + 1;
    }
  }

  renderFrame();
}