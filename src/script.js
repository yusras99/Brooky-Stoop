const audio = document.getElementById('background-music');
const button = document.getElementById('music-button');
button.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});
