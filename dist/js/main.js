// Inicia SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Inicia a voz no array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  // Faça um loop entre vozes e crie uma opção para cada uma
  voices.forEach(voice => {
    // Criar elemento de opção
    const option = document.createElement('option');
    // Preencher opção com voz e idioma
    option.textContent = voice.name + '(' + voice.lang + ')';

    //Definir atributos de opções necessárias
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

//Line 35, 36 As linhas 35 e 36 causam duplicação da lista de vozes
/*getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}*/

//Correção para duplicação, código de execução, dependendo do navegador
if (isFirefox) {
    getVoices();
}
if (isChrome) {
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = getVoices;
    }
}

// Fala
const speak = () => {
  // Veifica se está falando
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if (textInput.value !== '') {
    //Adicionar animação de fundo
    body.style.background = '#141414 url(img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';

    // Obter texto de voz
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    //Falar final
    speakText.onend = e => {
      console.log('Done speaking...');
      body.style.background = '#141414';
    };

    // Erro de Fala
    speakText.onerror = e => {
      console.error('Something went wrong');
    };

    // Voz Selecionada
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );

    // Repetir vozes
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Definir pitch e taxa
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // Fala
    synth.speak(speakText);
  }
};

// EVENT LISTENERS

// Enviar formulário de texto
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Alteração do valor da taxa
rate.addEventListener('change', e => (rateValue.textContent = rate.value));

// Alteração do valor do pitch
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));

// Alteração de seleção por voz
voiceSelect.addEventListener('change', e => speak());
