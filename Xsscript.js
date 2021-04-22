function calculateTotalValue(length) {
  let minutes = Math.floor(length / 60),
  seconds_int = length - minutes * 60,
  seconds_str = seconds_int.toString(),
  seconds = seconds_str.split(".")[0],
  temp_min = minutes.toString().length === 1 ? "0" + minutes : minutes,
  temp_sec = seconds.toString().length === 1 ? "0" + seconds : seconds;
  return temp_min + ":" + temp_sec;
}

function calculateCurrentValue(_seconds) {
  function padTime(t) {
    return t < 10 ? "0" + t : t;
  }

  if (typeof _seconds !== "number") return "";
  if (_seconds < 0) {
    _seconds = Math.abs(_seconds);
    //console.log(_seconds);
  }
  let hours = Math.floor(_seconds / 3600),
  minutes = Math.floor(_seconds % 3600 / 60),
  seconds = Math.floor(_seconds % 60);
  let hour = hours > 0 ? padTime(hours) + ":" : "";
  return hour + padTime(minutes) + ":" + padTime(seconds);
}

function setupSeek(event) {
  console.log('loaded');
  let player = event.currentTarget,
  seek = $(player).closest('.audio-player').find('.seekObj').first();
  seek.attr('max', player.duration);
}

function seekAudio() {
  let player = $(this).closest('.audio-player').find('.player').get(0);

  $(player).data('isSeeking', true);
  player.currentTime = $(this).val();
  $(player).data('isSeeking', false);

  updatePlayerTime(player);
}

function updatePlayerTime(player) {
  let startTime = $(player).closest('.audio-player').find('.start-time').first(),
  endTime = $(player).closest('.audio-player').find('.end-time').first(),
  remTime = $(player).closest('.audio-player').find('.rem-time').first();

  let length = player.duration;
  let current_time = player.currentTime;

  // calculate total length of value
  let totalTime = calculateTotalValue(length);
  let currentTime = calculateCurrentValue(current_time);
  let remainTime = length - current_time;

  endTime.html(totalTime);
  startTime.html(currentTime);

  remTime.html(calculateCurrentValue(remainTime));

  setSeekColor(player);
}

function initProgressBar(event) {
  let player = event.currentTarget,
  seek = $(player).closest('.audio-player').find('.seekObj').first(),
  startTime = $(player).closest('.audio-player').find('.start-time').first(),
  endTime = $(player).closest('.audio-player').find('.end-time').first(),
  remTime = $(player).closest('.audio-player').find('.rem-time').first(),
  playPauseBtn = $(player).closest('.audio-player').find('.play-pause-btn').first();
  if (!$(player).data('isSeeking')) {
    seek.value = player.currentTime;
  }

  updatePlayerTime(player);

  if (player.currentTime == player.duration) {
    playPauseBtn.removeClass("pause");
  }
}

function initPlayer(playerObj) {
  // Variables
  // ----------------------------------------------------------
  let player = $(playerObj).get(0),
  playPauseBtn = $(player).closest('.audio-player').find('.play-pause-btn').first(),
  seek = $(player).closest('.audio-player').find('.seekObj').first(),
  endTime = $(player).closest('.audio-player').find('.end-time').first();

  $(player).data('isPlaying', false);
  $(player).data('isSeeking', false);


  // Controls Listeners
  // ----------------------------------------------------------
  playPauseBtn.on("click", function () {
    togglePlay(player);
  });

  player.addEventListener("timeupdate", initProgressBar);

  player.addEventListener("durationchange", setupSeek);

  seek.on('change input', seekAudio);

  endTime.on('click', showhideRemaining);

  setSeekColor(player);
}

function togglePlay(player) {
  let playPauseBtn = $(player).closest('.audio-player').find('.play-pause-btn').first(),
  startTime = $(player).closest('.audio-player').find('.start-time').first();
  if (player.paused === false) {
    player.pause();
    $(player).data('isPlaying', false);
    playPauseBtn.removeClass("pause");
  } else {
    startTime.html("Loading...");
    player.play();
    playPauseBtn.addClass("pause");
    $(player).data('isPlaying', true);
  }
}

function setSeekColor(player) {
  let seek = $(player).closest('.audio-player').find('.seekObj').first();
  try {
    let val =
    (seek.val() - seek.attr("min")) / (
    seek.attr("max") - seek.attr("min"));
    let percent = val * 100;
    seek.css(
    "background-image",
    "-webkit-gradient(linear, left top, right top, " +
    "color-stop(" +
    percent +
    "%, #df7164), " +
    "color-stop(" +
    percent +
    "%, #F5D0CC)" +
    ")");


    seek.css(
    "background-image",
    "-moz-linear-gradient(left center, #DF7164 0%, #DF7164 " +
    percent +
    "%, #F5D0CC " +
    percent +
    "%, #F5D0CC 100%)");

  } catch (e) {
  }
}

function showhideRemaining() {
  $(this).toggleClass("end-time rem-time");
  let player = $(this).closest('.audio-player').find('.player').get(0);
  updatePlayerTime(player);
}

jQuery(document).ready(function ($) {
  initPlayer($('.player'));
});