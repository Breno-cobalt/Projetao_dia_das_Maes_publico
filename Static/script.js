const contador = document.getElementById("contador");
let total = telas.length - 1; // ignora a tela inicial

if (index === 0) {
    contador.innerText = "";
} else {
    contador.innerText = index + " / " + total;
}


let travado = false;

document.addEventListener("keydown", function(e) {

    if (e.code === "Space") {

        if (travado) return; // bloqueia temporariamente

        index++;

        // chegou no final?
        if (index >= telas.length) {
            index = 0;

            travado = true; // ativa cooldown

            // destrava depois de 3 segundos
            setTimeout(() => {
                travado = false;
            }, 3000);
        }

        mostrarTelaAnimado();
    }

    // voltar com seta esquerda
    if (e.code === "ArrowLeft") {
        index-- ;
        if (index < 0) index = 0;
        mostrarTelaAnimado();
    }

});

let tocando = false;

function toggleMusica() {
    const musica = document.getElementById("musica");

    if (tocando) {
        musica.pause();
    } else {
        musica.play();
    }

    tocando = !tocando;
}

const cores = [
    "linear-gradient(to right, #ff9a9e, #fad0c4)",
    "linear-gradient(to right, #a18cd1, #fbc2eb)",
    "linear-gradient(to right, #84fab0, #8fd3f4)",
    "linear-gradient(to right, #fccb90, #d57eeb)"
];

let corAtual = 0;

function mudarCor() {
    corAtual++;
    if (corAtual >= cores.length) corAtual = 0;

    document.body.style.background = cores[corAtual];
}

function voltarInicio() {
    index = 0;
    mostrarTelaAnimado();
}