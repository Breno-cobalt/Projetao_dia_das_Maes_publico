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
    {
        tipo: "final",
        titulo: "Feliz Dia das Mães",
        texto: "Cada palavra aqui guarda carinho, cuidado e gratidão por quem torna a vida mais bonita.",
    },
];

const conteudo = document.getElementById("conteudo");
const contador = document.getElementById("contador");
const progressBar = document.getElementById("progressBar");
const dotStrip = document.getElementById("dotStrip");
const statusMessage = document.getElementById("statusMessage");
const petalField = document.getElementById("petalField");
const musica = document.getElementById("musica");
const musicButton = document.getElementById("musicButton");
const themeButton = document.getElementById("themeButton");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const homeButton = document.getElementById("homeButton");
const autoButton = document.getElementById("autoButton");
const shareButton = document.getElementById("shareButton");
const downloadButton = document.getElementById("downloadButton");
const stage = document.querySelector(".stage");

let index = 0;
let themeIndex = 0;
let audioContext;
let melodyTimer;
let autoTimer;
let statusTimer;
let generatedMusicPlaying = false;
let switching = false;
let pointerStart;

const themes = ["", "theme-evening", "theme-garden"];
const petals = ["#f8a0b2", "#fff0b8", "#f6c6b8", "#d78da3", "#ffffff"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const messageCount = telas.filter((tela) => !tela.tipo).length;

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}

function setButtonState(button, label, title, icon) {
    const text = title || label;

    button.setAttribute("aria-label", text);
    button.title = text;

    const labelElement = button.querySelector(".button-label");
    const iconElement = button.querySelector(".button-icon");

    if (labelElement) {
        labelElement.textContent = label;
    }

    if (iconElement && icon) {
        iconElement.textContent = icon;
    }
}

function renderScreen() {
    const tela = telas[index];

    if (!conteudo.childElementCount) {
        updateContent(tela);
        updateProgress();
        updateDots();
        switching = false;
        return;
    }

    conteudo.classList.add("is-leaving");

    window.setTimeout(() => {
        updateContent(tela);
        updateProgress();
        updateDots();
        conteudo.classList.remove("is-leaving");
        switching = false;
    }, 260);
}

function updateContent(tela) {
    conteudo.replaceChildren();

    if (tela.tipo === "inicio") {
        const title = createElement("h1", "intro");
        const lines = ["Mãe,", "para mim", "significa..."];

        lines.forEach((line, lineIndex) => {
            if (lineIndex > 0) {
                title.appendChild(document.createElement("br"));
            }

            title.append(line);
        });

        conteudo.appendChild(title);
        return;
    }

    if (tela.tipo === "final") {
        renderFinalScreen(tela);
        return;
    }

    const name = createElement("p", "name", tela.nome);
    const phrase = createElement("h2", "phrase", tela.frase);

    conteudo.append(name, phrase);
}

function renderFinalScreen(tela) {
    const wrapper = createElement("div", "final-screen");
    const title = createElement("h1", "final-title", tela.titulo);
    const copy = createElement("p", "final-copy", tela.texto);
    const gallery = createElement("div", "photo-gallery");
    const replayButton = createElement("button", "final-replay", "Ver novamente");
    const memories = ["Amor", "Cuidado", "Gratidão"];

    gallery.setAttribute("aria-label", "Galeria de lembranças");

    memories.forEach((memory, memoryIndex) => {
        const card = createElement("figure", `photo-card photo-card-${memoryIndex + 1}`);
        const caption = createElement("figcaption", "", memory);

        card.appendChild(caption);
        gallery.appendChild(card);
    });

    replayButton.type = "button";
    replayButton.addEventListener("click", goHome);
    wrapper.append(title, copy, gallery, replayButton);
    conteudo.appendChild(wrapper);
}

function getMessageNumber(screenIndex) {
    return telas.slice(0, screenIndex + 1).filter((tela) => !tela.tipo).length;
}

function updateProgress() {
    const tela = telas[index];
    const totalSteps = telas.length - 1;

    if (tela.tipo === "inicio") {
        contador.textContent = "Início";
        progressBar.style.width = "0%";
        return;
    }

    if (tela.tipo === "final") {
        contador.textContent = "Final";
        progressBar.style.width = "100%";
        return;
    }

    contador.textContent = `${getMessageNumber(index)} / ${messageCount}`;
    progressBar.style.width = `${(index / totalSteps) * 100}%`;
}

function renderDots() {
    telas.forEach((tela, dotIndex) => {
        const button = document.createElement("button");

        button.className = "dot-button";
        button.type = "button";
        button.dataset.index = dotIndex;

        if (tela.tipo === "inicio") {
            button.setAttribute("aria-label", "Ir para o início");
        } else if (tela.tipo === "final") {
            button.setAttribute("aria-label", "Ir para a tela final");
        } else {
            button.setAttribute("aria-label", `Ir para mensagem de ${tela.nome}`);
        }

        button.addEventListener("click", () => goTo(dotIndex));
        dotStrip.appendChild(button);
    });
}

function updateDots() {
    dotStrip.querySelectorAll(".dot-button").forEach((button) => {
        const isActive = Number(button.dataset.index) === index;

        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "step" : "false");
    });
}

function goTo(nextIndex, options = {}) {
    if (switching) return;

    if (!options.fromAuto) {
        stopAutoPlay();
    }

    clearStatus();
    switching = true;
    index = (nextIndex + telas.length) % telas.length;
    renderScreen();
}

function nextScreen(options = {}) {
    if (options.fromAuto && index >= telas.length - 1) {
        stopAutoPlay();
        return;
    }

    goTo(index + 1, options);
}

function previousScreen() {
    goTo(index - 1);
}

function goHome() {
    goTo(0);
}

function toggleAutoPlay() {
    if (autoTimer) {
        stopAutoPlay();
        return;
    }

    if (index === telas.length - 1) {
        goTo(0, { fromAuto: true });
    }

    autoTimer = window.setInterval(() => nextScreen({ fromAuto: true }), 4300);
    autoButton.classList.add("is-active");
    autoButton.setAttribute("aria-pressed", "true");
    setButtonState(autoButton, "Parar", "Parar apresentação", "II");
    showStatus("Apresentação automática iniciada.");
}

function stopAutoPlay() {
    if (!autoTimer) return;

    window.clearInterval(autoTimer);
    autoTimer = undefined;
    autoButton.classList.remove("is-active");
    autoButton.setAttribute("aria-pressed", "false");
    setButtonState(autoButton, "Auto", "Iniciar apresentação", "▶");
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
        musicButton.setAttribute("aria-pressed", "true");
        setButtonState(musicButton, "Pausar", "Pausar música");
    } catch {
        startGeneratedMelody();
    }
}

function stopMusic() {
    musica.pause();
    generatedMusicPlaying = false;
    window.clearInterval(melodyTimer);
    musicButton.classList.remove("is-active");
    musicButton.setAttribute("aria-pressed", "false");
    setButtonState(musicButton, "Música", "Tocar música");
}

function startGeneratedMelody() {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;

    if (!AudioEngine) {
        musicButton.classList.add("is-warning");
        showStatus("Não foi possível tocar música neste navegador.");
        return;
    }

    audioContext = audioContext || new AudioEngine();
    audioContext.resume();
    generatedMusicPlaying = true;
    musicButton.classList.add("is-active");
    musicButton.setAttribute("aria-pressed", "true");
    setButtonState(musicButton, "Pausar", "Pausar música");

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

function getCurrentMessageText() {
    const tela = telas[index];

    if (tela.tipo === "inicio") {
        return "Dia das Mães: Mãe, para mim significa...";
    }

    if (tela.tipo === "final") {
        return `${tela.titulo}. ${tela.texto}`;
    }

    return `${tela.nome}: "${tela.frase}"`;
}

async function shareCurrentMessage() {
    const text = getCurrentMessageText();
    const shareData = {
        title: "Dia das Mães",
        text,
    };

    if (await copyTextToClipboard(text)) {
        showStatus("Mensagem copiada.");
        return;
    }

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            showStatus("Mensagem compartilhada.");
            return;
        }
    } catch (error) {
        if (error.name === "AbortError") {
            return;
        }
    }

    showShareFallback(text);
}

async function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // The textarea path keeps copying available in stricter local previews.
        }
    }

    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    try {
        return document.execCommand("copy");
    } catch {
        return false;
    } finally {
        textarea.remove();
    }
}

async function downloadCurrentCard() {
    if (document.fonts) {
        await document.fonts.ready;
    }

    const tela = telas[index];
    const canvas = document.createElement("canvas");
    const width = 1080;
    const height = 1350;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#fffaf4");
    gradient.addColorStop(0.5, "#f3b3bf");
    gradient.addColorStop(1, "#91b9aa");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.fillStyle = "rgba(255, 250, 244, 0.78)";
    roundRect(context, 92, 110, width - 184, height - 220, 36);
    context.fill();

    context.fillStyle = "#712641";
    context.textAlign = "center";
    context.font = "700 42px 'Nunito Sans', Arial";
    context.fillText("DIA DAS MÃES", width / 2, 230);

    if (tela.tipo === "final") {
        context.font = "700 106px 'Cormorant Garamond', Georgia";
        wrapCanvasText(context, tela.titulo, width / 2, 430, 760, 106, 2);
        context.font = "700 48px 'Nunito Sans', Arial";
        wrapCanvasText(context, tela.texto, width / 2, 690, 700, 66, 4);
    } else if (tela.tipo === "inicio") {
        context.font = "700 118px 'Cormorant Garamond', Georgia";
        wrapCanvasText(context, "Mãe, para mim significa...", width / 2, 500, 720, 116, 3);
    } else {
        context.font = "700 96px 'Cormorant Garamond', Georgia";
        wrapCanvasText(context, `“${tela.frase}”`, width / 2, 480, 760, 104, 5);
        context.fillStyle = "#b84f66";
        context.font = "800 42px 'Nunito Sans', Arial";
        context.fillText(tela.nome.toUpperCase(), width / 2, 1010);
    }

    context.fillStyle = "rgba(113, 38, 65, 0.58)";
    context.font = "700 30px 'Nunito Sans', Arial";
    context.fillText("Com carinho", width / 2, 1145);

    const link = document.createElement("a");
    link.download = `${safeFileName(getCurrentMessageText())}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showStatus("Cartão gerado.");
}

function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";

    words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;

        if (context.measureText(testLine).width > maxWidth && line) {
            lines.push(line);
            line = word;
            return;
        }

        line = testLine;
    });

    if (line) {
        lines.push(line);
    }

    lines.slice(0, maxLines).forEach((lineText, lineIndex) => {
        context.fillText(lineText, x, y + lineIndex * lineHeight);
    });
}

function safeFileName(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase()
        .slice(0, 48) || "cartao-dia-das-maes";
}

function showStatus(message) {
    window.clearTimeout(statusTimer);
    statusMessage.textContent = message;
    statusTimer = window.setTimeout(clearStatus, 2800);
}

function showShareFallback(text) {
    const preview = createElement("span", "share-text", text);

    window.clearTimeout(statusTimer);
    statusMessage.textContent = "Mensagem pronta para copiar:";
    statusMessage.appendChild(preview);
    statusTimer = window.setTimeout(clearStatus, 9000);
}

function clearStatus() {
    window.clearTimeout(statusTimer);
    statusMessage.replaceChildren();
}

function canAnimatePetals() {
    return !document.hidden && !reduceMotion.matches;
}

function createPetal() {
    if (!canAnimatePetals() || petalField.children.length > 18) return;

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

function seedPetals() {
    if (!canAnimatePetals()) return;

    for (let i = 0; i < 8; i += 1) {
        window.setTimeout(createPetal, i * 260);
    }
}

function syncMotionState() {
    if (!canAnimatePetals()) {
        petalField.replaceChildren();
    }

    if (document.hidden) {
        stopAutoPlay();
    }
}

function handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    pointerStart = {
        x: event.clientX,
        y: event.clientY,
    };
}

function handlePointerUp(event) {
    if (!pointerStart) return;

    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = undefined;

    if (Math.abs(deltaX) < 56 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;

    if (deltaX < 0) {
        nextScreen();
        return;
    }

    previousScreen();
}

nextButton.addEventListener("click", () => nextScreen());
prevButton.addEventListener("click", previousScreen);
homeButton.addEventListener("click", goHome);
themeButton.addEventListener("click", changeTheme);
musicButton.addEventListener("click", toggleMusic);
autoButton.addEventListener("click", toggleAutoPlay);
shareButton.addEventListener("click", shareCurrentMessage);
downloadButton.addEventListener("click", downloadCurrentCard);
stage.addEventListener("pointerdown", handlePointerDown);
stage.addEventListener("pointerup", handlePointerUp);
document.addEventListener("visibilitychange", syncMotionState);

if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener("change", syncMotionState);
}

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

    if (event.code === "End") {
        goTo(telas.length - 1);
    }
});

renderDots();
seedPetals();
window.setInterval(createPetal, 1400);
renderScreen();
