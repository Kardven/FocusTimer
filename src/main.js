import state from './state.js';


const buttonPressAudio = new Audio('./assets/button-press.wav');
const floresta = new Audio('./assets/Floresta.wav');
const chuva = new Audio('./assets/chuva.wav');
const cafeteria = new Audio('./assets/Cafeteria.wav');
const lareira = new Audio('./assets/Lareira.wav');
const alarme = new Audio('./assets/kitchen-timer.mp3');


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
  element.onkeypress = (event) => /\d/.test(event.key)
    if (event.key === 'Enter') {
      event.preventDefault();
      onBlurOrEnter();
    }
  });

  function onBlurOrEnter() {
    let value = parseInt(element.textContent, 10);
    if (isNaN(value) || value < 0) {
      element.textContent = String(element).padStart(2, "0")
      value = 0;
    } else if (type === 'minutes' && value > 60) {
      value = 60;
      element.textContent = String(element).padStart(2, "0")
    } else if (type === 'seconds' && value > 59) {
      value = 59;
      element.textContent = String(element).padStart(2, "0")
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
  };
});

plusButton.addEventListener('click', () => {
  
  if (state.isRunning) {
    state.minutes = Math.min(state.minutes + 5, 60);
    minutes.textContent = String(state.minutes).padStart(2, '0');
  }
});

minusButton.addEventListener('click', () => {
  
  if (state.isRunning) {
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

// Função para tocar ou pausar o áudio da respectiva opção
function toggleAudio(audioElement, button) {
  if (button.classList.contains('selected')) {
    button.classList.remove('selected');
    audioElement.pause();
    audioElement.currentTime = 0; // Reinicia a reprodução do áudio se pausado
  } else {
    // Pausa o áudio do botão anterior, se estiver tocando
    document.querySelectorAll('.mode-button').forEach(btn => {
      if (btn !== button && btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        const audio = getAudioElement(btn);
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Adiciona a classe 'selected' e inicia o áudio do botão clicado
    button.classList.add('selected');
    audioElement.loop = true;
    audioElement.play();
  }
}

// Função auxiliar para obter o elemento de áudio correspondente ao botão
function getAudioElement(button) {
  if (button.classList.contains('floresta')) {
    return floresta;
  } else if (button.classList.contains('chuva')) {
    return chuva;
  } else if (button.classList.contains('lareira')) {
    return lareira;
  } else if (button.classList.contains('cafeteria')) {
    return cafeteria;
  }
}

document.querySelectorAll('.mode-button').forEach(button => {
  button.addEventListener('click', () => {
    // Toca ou pausa o áudio do botão clicado
    if (button.classList.contains('floresta')) {
      toggleAudio(floresta, button);
    } else if (button.classList.contains('chuva')) {
      toggleAudio(chuva, button);
    } else if (button.classList.contains('lareira')) {
      toggleAudio(lareira, button);
    } else if (button.classList.contains('cafeteria')) {
      toggleAudio(cafeteria, button);
    }
  });
});
