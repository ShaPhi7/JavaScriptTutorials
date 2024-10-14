const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const volume = player.querySelector("input[name='volume']");
const speed = player.querySelector("input[name='playbackRate']");

video.addEventListener('click', toggleVideo);
video.addEventListener('play', toggleButtonPause);
video.addEventListener('pause', toggleButtonPlay);
video.addEventListener('timeupdate', updateProgressBar);
progress.addEventListener('click', jumpToTime);
toggle.addEventListener('click', toggleVideo);
skipButtons.forEach(button => button.addEventListener('click', skip));
volume.addEventListener('change', updateVolume);
speed.addEventListener('change', updateSpeed);

function toggleVideo() {
    if (video.paused) {
        video.play();
    }
    else {
        video.pause();
    }
}

function toggleButtonPause() {
    toggle.textContent = '❚❚';
}

function toggleButtonPlay() {
    toggle.textContent = '►';
}

function skip() {
    const secondsToSkip = this.dataset.skip;
    video.currentTime += parseFloat(secondsToSkip);
}

function updateVolume() {
    video.volume = this.value;
}

function updateSpeed() {
    video.playbackRate = this.value;
}

function updateProgressBar() {
    const percentage = video.currentTime / video.duration * 100;
    progressBar.style.flexBasis = `${percentage}%`;
}

function jumpToTime(e) {
    video.currentTime = e.offsetX / progress.offsetWidth * video.duration;
}