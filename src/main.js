import state from './state.js';

const buttonPressAudio = new Audio('./assets/button-press.wav');
const forestAudio = new Audio('./assets/Floresta.wav');
const rainAudio = new Audio('./assets/chuva.wav');
const cafeAudio = new Audio('./assets/Cafeteria.wav');
const fireplaceAudio = new Audio('./assets/Lareira.wav');
const alarmAudio = new Audio('./assets/kitchen-timer.mp3');

const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const minusButton = document.querySelector('button[data-action="minusTime"]');
const plusButton = document.querySelector('button[data-action="addTime"]');
const playButton = document.querySelector('button[data-action="playTimer"]');
const stopButton = document.querySelector('button[data-action="stopTimer"]');

minutes.addEventListener('click', () => makeEditable(minutes, 'minutes'));
seconds.addEventListener('click', () => makeEditable(seconds, 'seconds'));

function makeEditable(element, type) {
  element.contentEditable = true;
  element.focus();
  
  const range = document.createRange();
  range.selectNodeContents(element);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  element.addEventListener('blur', onBlurOrEnter);
  element.addEventListener('keydown', (event) => {
    element.onkeypress = (event) => /\d/.test(event.key);
    if (event.key === 'Enter') {
      event.preventDefault();
      onBlurOrEnter();
    }
  });

  function onBlurOrEnter() {
    let value = parseInt(element.textContent, 10);
    if (isNaN(value) || value < 0) {
      element.textContent = String(element).padStart(2, "0");
      value = 0;
    } else if (type === 'minutes' && value > 60) {
      value = 60;
      element.textContent = String(element).padStart(2, "0");
    } else if (type === 'seconds' && value > 59) {
      value = 59;
      element.textContent = String(element).padStart(2, "0");
    }
    element.textContent = String(value).padStart(2, '0');
    element.contentEditable = false;
    state[type] = value;
    element.removeEventListener('blur', onBlurOrEnter);
  }
}

playButton.addEventListener('click', () => {  
  buttonPressAudio.play();
  if (!state.isRunning) {
    state.isRunning = true;
    state.countdownId = setInterval(updateTimer, 1000);
  }
  
});

stopButton.addEventListener('click', () => {
  buttonPressAudio.play();
  if (state.isRunning) {
    state.isRunning = false;
    clearInterval(state.countdownId);
  }
});

plusButton.addEventListener('click', () => {
  if (!state.isRunning) {
    state.minutes = Math.min(state.minutes + 5, 60);
    minutes.textContent = String(state.minutes).padStart(2, '0');
  }
});

minusButton.addEventListener('click', () => {
  if (!state.isRunning) {
    state.minutes = Math.max(state.minutes - 5, 0);
    minutes.textContent = String(state.minutes).padStart(2, '0');
  }
});

function updateTimer() {
  if (state.seconds > 0) {
    state.seconds--;
  } else if (state.minutes > 0) {
    state.minutes--;
    state.seconds = 59;
  } else {
    clearInterval(state.countdownId);
    state.isRunning = false;
    return;
  }

  minutes.textContent = String(state.minutes).padStart(2, '0');
  seconds.textContent = String(state.seconds).padStart(2, '0');
}

// Function to play or pause the respective sound
function toggleAudio(audioElement, button) {
  if (button.classList.contains('selected')) {
    button.classList.remove('selected');
    audioElement.pause();
    audioElement.currentTime = 0; // Resets audio playback if paused
  } else {
    // Pause any other audio that might be playing
    document.querySelectorAll('.mode-button').forEach(btn => {
      if (btn !== button && btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        const audio = getAudioElement(btn);
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Add 'selected' class and start the clicked button's audio
    button.classList.add('selected');
    audioElement.loop = true;
    audioElement.play();
  }
}

// Helper function to get the corresponding audio element for the button
function getAudioElement(button) {
  if (button.classList.contains('forest')) {
    return forestAudio;
  } else if (button.classList.contains('rain')) {
    return rainAudio;
  } else if (button.classList.contains('fireplace')) {
    return fireplaceAudio;
  } else if (button.classList.contains('cafe')) {
    return cafeAudio;
  }
}

document.querySelectorAll('.mode-button').forEach(button => {
  button.addEventListener('click', () => {
    // Play or pause the clicked button's audio
    if (button.classList.contains('forest')) {
      toggleAudio(forestAudio, button);
    } else if (button.classList.contains('rain')) {
      toggleAudio(rainAudio, button);
    } else if (button.classList.contains('fireplace')) {
      toggleAudio(fireplaceAudio, button);
    } else if (button.classList.contains('cafe')) {
      toggleAudio(cafeAudio, button);
    }
  });
});
