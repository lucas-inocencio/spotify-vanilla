const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeButton = document.getElementById('like');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

const asYouWere = {
  songName: 'As You Were',
  artist: 'TrackTribe',
  file: 'as_you_were',
  liked: false,
};
const boomBapFlick = {
  songName: 'Boom Bap Flick',
  artist: 'Quincas Moreira',
  file: 'boom_bap_flick',
  liked: true,
};
const cantHide = {
  songName: "Can't Hide",
  artist: 'Otis Mcdonald',
  file: 'cant_hide',
  liked: false,
};
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [
  asYouWere,
  boomBapFlick,
  cantHide,
];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

const playSong = () => {
  play.querySelector('.bi').classList.remove('bi-play-circle-fill');
  play.querySelector('.bi').classList.add('bi-pause-circle-fill');
  song.play();
  isPlaying = true;
}

const pauseSong = () => {
  play.querySelector('.bi').classList.add('bi-play-circle-fill');
  play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
  song.pause();
  isPlaying = false;
}

const playPauseDecider = () => isPlaying ? pauseSong() : playSong();

const likeButtonRender = () => {
  const liked = sortedPlaylist[index].liked;
  likeButton.querySelector('.bi').classList.toggle('bi-heart', !liked);
  likeButton.querySelector('.bi').classList.toggle('bi-heart-fill', liked);
  likeButton.classList.toggle('button-active', liked);
}

const initializeSong = () => {
  cover.src = `images/${sortedPlaylist[index].file}.webp`;
  song.src = `songs/${sortedPlaylist[index].file}.mp3`;
  songName.innerText = sortedPlaylist[index].songName;
  bandName.innerText = sortedPlaylist[index].artist;
  likeButtonRender();
}

const previousSong = () => {
  index = (index === 0) ? sortedPlaylist.length - 1 : index - 1;
  initializeSong();
  playSong();
};

const nextSong = () => {
  index = (index + 1 === sortedPlaylist.length) ? 0 : index + 1;
  initializeSong();
  playSong();
};

const updateProgress = () => {
  const barWidth = (song.currentTime / song.duration) * 100;
  currentProgress.style.setProperty('--progress', `${barWidth}%`);
  songTime.innerText = toHHMMSS(song.currentTime);
}

const jumpTo = (event) => {
  song.currentTime = event.offsetX / progressContainer.clientWidth * song.duration;
}

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const shuffleButtonClicked = () => {
  isShuffled = !isShuffled;
  sortedPlaylist = isShuffled ? (shuffleArray([...originalPlaylist]), sortedPlaylist) : [...originalPlaylist];
  shuffleButton.classList.toggle('button-active');
}

const repeatButtonClicked = () => {
  repeatOn = !repeatOn;
  repeatButton.classList.toggle('button-active');
};

const nextOrRepeat = () => repeatOn ? playSong() : nextSong();

const toHHMMSS = (originalNumber) => {
  let hours = Math.floor(originalNumber / 3600);
  let min = Math.floor((originalNumber - hours * 3600) / 60);
  let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

  return `${hours !== 0 ? hours.toString().padStart(2, '0') + ':' : ''}${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const updateTotalTime = () => totalTime.innerText = toHHMMSS(song.duration);

const likeButtonClicked = () => {
  sortedPlaylist[index].liked = !sortedPlaylist[index].liked;
  likeButtonRender();
  localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}

initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);
