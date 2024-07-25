const audioPlayer = document.getElementById('audioPlayer');
const playPauseButton = document.getElementById('playPause');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const volumeControl = document.getElementById('volume');
const currentSongTitle = document.getElementById('currentSongTitle');
const visualizerCanvas = document.getElementById('visualizer');
const canvasContext = visualizerCanvas.getContext('2d');

let songs = [
    { title: 'O Sajni Re', file: 'music/song1OSajniRe.mp3' },
    { title: 'Husn Tera Tauba Tauba', file: 'music/song2HusnTeraTaubaTauba.mp3' },
    { title: 'Iski Bhen Ki Maje Maje', file: 'music/song3IskiBhenKiMajeMaje.mp3' },
    { title: 'Maan Meri Jaan', file: 'music/song4MaanMeriJaan.mp3' }
];

let currentSongIndex = 0;
let audioContext;
let analyser;
let dataArray;
let bufferLength;

// Load the initial song
function loadSong(index) {
    currentSongTitle.textContent = songs[index].title;
    audioPlayer.src = songs[index].file;
}

function initAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audioPlayer);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
}

function drawVisualizer() {
    canvasContext.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    analyser.getByteFrequencyData(dataArray);

    const barWidth = (visualizerCanvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        canvasContext.fillRect(x, visualizerCanvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
    }

    requestAnimationFrame(drawVisualizer);
}

// Play or pause the audio
playPauseButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        if (!audioContext) {
            initAudioContext();
            drawVisualizer();
        }
        audioPlayer.play();
        playPauseButton.textContent = '⏸️';
    } else {
        audioPlayer.pause();
        playPauseButton.textContent = '▶️';
    }
});

// Play the next song
nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
    playPauseButton.textContent = '⏸️';
});

// Play the previous song
prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
    playPauseButton.textContent = '⏸️';
});

// Control the volume
volumeControl.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
});

// Load the first song
loadSong(currentSongIndex);
