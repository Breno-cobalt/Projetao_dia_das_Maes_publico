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