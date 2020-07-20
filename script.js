const player = document.querySelector('.player')
const video = document.querySelector('video')
const progressRange = document.querySelector('.progress-range')
const progressBar = document.querySelector('.progress-bar')
const playBtn = document.getElementById('play-button')
const volumeIcon = document.getElementById('volume-icon')
const volumeRange = document.querySelector('.volume-range')
const volumeBar = document.querySelector('.volume-bar')
const currentTime = document.querySelector('.time-elapsed')
const duration = document.querySelector('.time-duration')
const speed = document.querySelector('.player-speed')
const fullscreenBtn = document.querySelector('.fullscreen')

// ---------------------------------- Play & Pause ----------------------------------- //
function showPlayIcon() {
  playBtn.classList.replace('fa-pause', 'fa-play')
  playBtn.setAttribute('title', 'Play')
}

function togglePlay() {
  if (video.paused) {
    video.play()
    playBtn.classList.replace('fa-play', 'fa-pause')
    playBtn.setAttribute('title', 'Pause')
  } else {
    video.pause()
    // playBtn.classList.replace('fa-pause', 'fa-play') MOVED INTO SEPARATE FUNCTION SHOWPLAYICON FOR VIDEO END 
    // playBtn.setAttribute('title', 'Play')
    showPlayIcon()
  }
}

// On video end, show play button icon
video.addEventListener('ended', showPlayIcon)

// ---------------------------------- Progress Bar ---------------------------------- //

// Calculate display time format
function displayTime(time) {
  const minutes = Math.floor(time / 60)
  let seconds = Math.floor(time % 60)
  seconds = seconds > 9 ? seconds : `0${seconds}`
  // console.log(minutes, seconds)
  return `${minutes}:${seconds}`
}

// Update progress bar as the video plays
function updateProgress() {
  // console.log('currentTime', video.currentTime, 'duration', video.duration)
  progressBar.style.width = `${(video.currentTime / video.duration) * 100 }%`
  // displayTime(64)
  currentTime.textContent = `${displayTime(video.currentTime)} /`
  duration.textContent = `${displayTime(video.duration)}`
}

// Click to seek within the video
function setProgress(e) {
  // console.log(e)  console > mouseEvent > offsetX (represents a pixel value of distance in dir X)
  // console > mouseEvent > srcElement > offsetWidth (width of element including any margin/padding)
  const newTime = e.offsetX / progressRange.offsetWidth
  progressBar.style.width = `${newTime * 100}%`
  video.currentTime = newTime * video.duration
  // console.log(newTime)
}

// ---------------------------------- Volume Controls --------------------------- //
let lastVolume = 1 // need this in order to enable muting... default volume level is 100%

function changeVolume(e) {
  let volume = e.offsetX / volumeRange.offsetWidth
  // Rounding volume up or down
  if (volume < 0.1) {
    volume = 0
  }
  if (volume > 0.9) {
    volume = 1
  }
  volumeBar.style.width = `${volume * 100}%`
  video.volume = volume
  // console.log(volume)
  // Change icon depending on volume
  volumeIcon.className = ''
  if (volume > 0.7) {
    volumeIcon.classList.add('fas', 'fa-volume-up')
  } else if (volume < 0.7 && volume > 0) {
    volumeIcon.classList.add('fas', 'fa-volume-down')
  } else if (volume === 0) {
    volumeIcon.classList.add('fas', 'fa-volume-off')
  }
  lastVolume = volume
}

// Mute/Unmute
function toggleMute() {
  volumeIcon.className = ''
  if (video.volume) { // If there is volume (greater than 0)
    lastVolume = video.volume // store the volume level within the lastVolume variable
    video.volume = 0 // convert the volume to 0
    volumeBar.style.width = 0 // convert the volume bar width to 0 i.e., MUTE
    volumeIcon.classList.add('fas', 'fa-volume-mute')
    volumeIcon.setAttribute('title', 'Unmute')
  } else { // if the volume started at zero
    video.volume = lastVolume // store zero within the lastVolume variable
    volumeBar.style.width = `${lastVolume * 100}%` // Style the volume by multiplying by 100
    volumeIcon.classList.add('fas', 'fa-volume-up')
    volumeIcon.setAttribute('title', 'Mute')
  }
}
// ---------------------------------- Change Playback Speed -------------------- //
function changeSpeed() {
  // console.log('video playback rate', video.playbackRate)
  // console.log('selected value', speed.value)
  video.playbackRate = speed.value
}
// ---------------------------------- Fullscreen ------------------------------- //

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen()
  }
  video.classList.add('video-fullscreen')
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen()
  }
  video.classList.remove('video-fullscreen')
}

let fullscreen = false

//  Toggle Fullscreen
function toggleFullscreen() {
  if (!fullscreen) {
    openFullscreen(player)
  } else {
    closeFullscreen()
  }
  fullscreen = !fullscreen
}

// ---------------------------------- Event Listeners ----------------------------------
playBtn.addEventListener('click', togglePlay)
video.addEventListener('click', togglePlay)
video.addEventListener('timeupdate', updateProgress)
video.addEventListener('canPlay', updateProgress)
progressRange.addEventListener('click', setProgress)
volumeRange.addEventListener('click', changeVolume)
volumeIcon.addEventListener('click', toggleMute)
speed.addEventListener('change', changeSpeed)
fullscreenBtn.addEventListener('click', toggleFullscreen)