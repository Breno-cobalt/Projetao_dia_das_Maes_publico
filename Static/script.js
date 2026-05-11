const telas = [
    { tipo: "inicio", texto: "Mãe, para mim significa..." },
    { nome: "Breno", frase: "Amor que nunca acaba." },
    { nome: "Gabriel Batochi", frase: "Cuidado." },
    { nome: "João", frase: "Amor, cuidado e família." },
    { nome: "Maria Eduarda Lopes", frase: "Proteção." },
    { nome: "Isabella Barnabé", frase: "Porto seguro, estabilidade." },
    { nome: "Emily", frase: "Confiança." },
    { nome: "Lara", frase: "Amor." },
    { nome: "Aldair", frase: "Tudo, a base." },
    { nome: "Cleidinalva", frase: "Cuidado, apoio, doutora, beijinho para sarar." },
    { nome: "Alessandro", frase: "Amor e cuidado." },
    { nome: "Gabriel Resenhudo dos Santos", frase: "Protetora." },
    { nome: "Arthur", frase: "Tudo, aquela que me sustenta." },
    { nome: "Lucas Mesquita da Costa", frase: "Força." },
    { nome: "Jonathan", frase: "Minha mãe é protetora." },
    { nome: "Davi", frase: "Vida." },
    { nome: "Samuel", frase: "Referência." },
    { nome: "Gabriel Vieira", frase: "Tudo: rainha, criadora, esperança." },
    { nome: "Gabriel Sodré", frase: "Segurança e amizade." },
    { nome: "André", frase: "Reciprocidade." },
    { nome: "Renam", frase: "Amor, cuidado e carinho." },
    { nome: "Leonardo Aguiar", frase: "Pilar da vida, amor, melhor pessoa, parceira." },
    { nome: "Miguel", frase: "Muralha muito forte, escudo." },
    { nome: "Frasato", frase: "Sinal de vida, de amor. Ela está lá por você." },
    { nome: "Lucas Mendes", frase: "Vida, me ilumina, razão do meu viver." },
    { nome: "Gustavo", frase: "A raiz de tudo." },
    { nome: "Enzo (Jordan)", frase: "Não há palavras para descrever." },
    { nome: "Giovana", frase: "Proteção e cuidado." },
    { nome: "Kaleo", frase: "Proteção, amor, carinho, segurança, responsabilidade." },
    { nome: "Diana", frase: "Mãe é como se fosse Deus." },
    { nome: "Leonardo Gomes Dias", frase: "Uma pessoa escolhida por Deus para dar a luz a você." },
    { nome: "Monize", frase: "Tudo, razão da minha vida." },
];

const conteudo = document.getElementById("conteudo");
const contador = document.getElementById("contador");
const progressBar = document.getElementById("progressBar");
const petalField = document.getElementById("petalField");
const musica = document.getElementById("musica");
const musicButton = document.getElementById("musicButton");
const themeButton = document.getElementById("themeButton");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const homeButton = document.getElementById("homeButton");

let index = 0;
let themeIndex = 0;
let audioContext;
let melodyTimer;
let generatedMusicPlaying = false;
let switching = false;

const themes = ["", "theme-evening", "theme-garden"];
const petals = ["#f8a0b2", "#fff0b8", "#f6c6b8", "#d78da3", "#ffffff"];

function renderScreen() {
    const tela = telas[index];

    if (!conteudo.innerHTML.trim()) {
        updateContent(tela);
        updateProgress();
        switching = false;
        return;
    }

    conteudo.classList.add("is-leaving");

    window.setTimeout(() => {
        updateContent(tela);
        updateProgress();
        conteudo.classList.remove("is-leaving");
        switching = false;
    }, 260);
}

function updateContent(tela) {
    if (tela.tipo === "inicio") {
        conteudo.innerHTML = `<h1 class="intro">Mãe,<br>para mim<br>significa...</h1>`;
        return;
    }

    conteudo.innerHTML = `
        <p class="name">${tela.nome}</p>
        <h2 class="phrase">${tela.frase}</h2>
    `;
}

function updateProgress() {
    const total = telas.length - 1;

    if (index === 0) {
        contador.textContent = "Início";
        progressBar.style.width = "0%";
        return;
    }

    contador.textContent = `${index} / ${total}`;
    progressBar.style.width = `${(index / total) * 100}%`;
}

function goTo(nextIndex) {
    if (switching) return;

    switching = true;
    index = (nextIndex + telas.length) % telas.length;
    renderScreen();
}

function nextScreen() {
    goTo(index + 1);
}

function previousScreen() {
    goTo(index - 1);
}

function goHome() {
    goTo(0);
}

function changeTheme() {
    document.body.classList.remove(...themes.filter(Boolean));
    themeIndex = (themeIndex + 1) % themes.length;

    if (themes[themeIndex]) {
        document.body.classList.add(themes[themeIndex]);
    }
}

async function toggleMusic() {
    clearMusicWarning();

    if (generatedMusicPlaying || !musica.paused) {
        stopMusic();
        return;
    }

    try {
        await musica.play();
        musicButton.classList.add("is-active");
        musicButton.setAttribute("aria-label", "Pausar música");
        musicButton.title = "Pausar música";
    } catch {
        startGeneratedMelody();
    }
}

function stopMusic() {
    musica.pause();
    generatedMusicPlaying = false;
    window.clearInterval(melodyTimer);
    musicButton.classList.remove("is-active");
    musicButton.setAttribute("aria-label", "Tocar música");
    musicButton.title = "Tocar música";
}

function startGeneratedMelody() {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;

    if (!AudioEngine) {
        musicButton.classList.add("is-warning");
        return;
    }

    audioContext = audioContext || new AudioEngine();
    audioContext.resume();
    generatedMusicPlaying = true;
    musicButton.classList.add("is-active");
    musicButton.setAttribute("aria-label", "Pausar música");
    musicButton.title = "Pausar música";

    let noteIndex = 0;
    const notes = [392, 440, 523.25, 493.88, 440, 349.23, 392, 329.63];

    playTone(notes[noteIndex]);
    melodyTimer = window.setInterval(() => {
        noteIndex = (noteIndex + 1) % notes.length;
        playTone(notes[noteIndex]);
    }, 620);
}

function playTone(frequency) {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.52);
}

function clearMusicWarning() {
    musicButton.classList.remove("is-warning");
}

function createPetal() {
    const petal = document.createElement("span");
    const size = 8 + Math.random() * 15;

    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.setProperty("--size", `${size}px`);
    petal.style.setProperty("--duration", `${8 + Math.random() * 8}s`);
    petal.style.setProperty("--drift", `${Math.random() * 260 - 130}px`);
    petal.style.setProperty("--spin", `${Math.random() > 0.5 ? "" : "-"}${180 + Math.random() * 420}deg`);
    petal.style.setProperty("--petal-color", petals[Math.floor(Math.random() * petals.length)]);

    petalField.appendChild(petal);
    window.setTimeout(() => petal.remove(), 17000);
}

nextButton.addEventListener("click", nextScreen);
prevButton.addEventListener("click", previousScreen);
homeButton.addEventListener("click", goHome);
themeButton.addEventListener("click", changeTheme);
musicButton.addEventListener("click", toggleMusic);

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "ArrowRight") {
        event.preventDefault();
        nextScreen();
    }

    if (event.code === "ArrowLeft") {
        previousScreen();
    }

    if (event.code === "Home") {
        goHome();
    }
});

for (let i = 0; i < 18; i += 1) {
    window.setTimeout(createPetal, i * 180);
}

window.setInterval(createPetal, 520);
renderScreen();
