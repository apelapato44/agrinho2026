let dinheiro = 500;
let sustentabilidade = 50;
let producao = 20;
let ano = 1;

const avatarChico = document.querySelector('#char-chico .char-avatar');
const avatarBia = document.querySelector('#char-bia .char-avatar');
const balaoFala = document.getElementById('falas-personagens');
const textoFala = document.getElementById('texto-fala');

function atualizarTela() {
    document.getElementById("txt-ano").innerText = `${ano} / 10`;
    document.getElementById("txt-producao").innerText = `${producao} ton/ano`;
    
    const txtDinheiro = document.getElementById("txt-dinheiro");
    txtDinheiro.innerText = `R$ ${dinheiro}`;
    if (dinheiro >= 0) {
        txtDinheiro.classList.add('positivo'); txtDinheiro.classList.remove('negativo');
    } else {
        txtDinheiro.classList.add('negativo'); txtDinheiro.classList.remove('positivo');
    }

    const barra = document.getElementById("barra-sustentabilidade");
    const numSust = document.getElementById("txt-sustentabilidade-num");
    
    barra.style.width = `${sustentabilidade}%`;
    numSust.innerText = `${sustentabilidade}%`;

    atualizarPersonagens();
}

function atualizarPersonagens() {
    avatarChico.className = 'char-avatar';
    avatarBia.className = 'char-avatar';
    
    const barra = document.getElementById("barra-sustentabilidade");
    
    if (sustentabilidade >= 70) {
        barra.style.backgroundColor = "var(--verde-vivo)";
        avatarBia.classList.add('bia-feliz');
        
        if (producao >= 30) {
            avatarChico.classList.add('chico-feliz');
            mostrarFala("Bia: 'O campo está lindo e tecnológico!' Chico: 'E o bolso está cheio! Boa!'");
        } else {
            avatarChico.classList.add('chico-neutro');
            mostrarFala("Bia: 'A natureza está salva!' Chico: 'Tá bonito Bia, mas precisamos colher mais...'");
        }
    } else if (sustentabilidade >= 35 && sustentabilidade < 70) {
        barra.style.backgroundColor = "var(--amarelo-ouro)";
        avatarBia.classList.add('bia-neutra');
        
        if (producao >= 50) {
            avatarChico.classList.add('chico-feliz');
            mostrarFala("Chico: 'Recorde de colheita!' Bia: 'Cuidado Seu Chico, o solo está desgastando...'");
        } else {
            avatarChico.classList.add('chico-neutro');
            mostrarFala("Chico & Bia conversando sobre os próximos passos da fazenda.");
        }
    } else {
        barra.style.backgroundColor = "var(--vermelho-vivo)";
        avatarBia.classList.add('bia-preocupada');
        avatarChico.classList.add('chico-bravo');
        mostrarFala("Bia: 'SOCORRO! O ecossistema travou!' Chico: 'Desse jeito vamos quebrar!'");
    }
}

function mostrarFala(texto) {
    textoFala.innerText = texto;
    balaoFala.classList.remove('hidden');
}

function adicionarLog(texto, tipo) {
    const logBox = document.getElementById("log-mensagens");
    const novoParagrafo = document.createElement("p");
    novoParagrafo.innerText = `> ${texto}`;
    
    if (tipo) novoParagrafo.classList.add(tipo);
    
    logBox.appendChild(novoParagrafo);
    logBox.scrollTop = logBox.scrollHeight;
}

function comprarAcao(tipoAcao) {
    switch(tipoAcao) {
        case 'reflorestar':
            if (dinheiro >= 100) {
                dinheiro -= 100;
                sustentabilidade = Math.min(100, sustentabilidade + 15);
                adicionarLog("Investimento em áreas verdes realizado. (+15% Sust.)", "msg-sucesso");
            } else { adicionarLog("Sem fundos para reflorestar.", "msg-perigo"); }
            break;
        case 'organico':
            if (dinheiro >= 150) {
                dinheiro -= 150; producao += 5;
                sustentabilidade = Math.min(100, sustentabilidade + 10);
                adicionarLog("Adubação orgânica melhora solo. (+5 Prod. | +10% Sust.)", "msg-sucesso");
            } else { adicionarLog("Dinheiro insuficiente.", "msg-perigo"); }
            break;
        case 'gotejamento':
            if (dinheiro >= 250) {
                dinheiro -= 250; producao += 15;
                sustentabilidade = Math.min(100, sustentabilidade + 5);
                adicionarLog("Tecnologia de irrigação instalada. (+15 Prod. | +5% Sust.)", "msg-sucesso");
            } else { adicionarLog("Sem dinheiro para tecnologia.", "msg-perigo"); }
            break;
        case 'agrotoxico':
            dinheiro += 100;
            producao += 20;
            sustentabilidade = Math.max(0, sustentabilidade - 20);
            adicionarLog("Uso intensivo de químicos. Produção explode, ambiente sofre. (+20 Prod. | -20% Sust.)", "msg-perigo");
            break;
    }
    atualizarTela();
    checarFimDeJogo();
}

function avancarAno() {
    let lucroDoAno = producao * 12;
    
    if (sustentabilidade < 30) {
        lucroDoAno = Math.floor(lucroDoAno * 0.5);
        producao = Math.max(5, producao - 4);
        adicionarLog(`📉 Ano ${ano}: Quebra de safra por degradação ambiental! Lucro caiu 50%.`, "msg-perigo");
    } else if (sustentabilidade > 75) {
        lucroDoAno += 100;
        adicionarLog(`✨ Ano ${ano}: Bônus de Mercado Verde recebido (R$ 100).`, "msg-sucesso");
    }

    dinheiro += lucroDoAno;
    adicionarLog(`💰 Fim do Ano ${ano}: A colheita rendeu R$ ${lucroDoAno}.`, "msg-sistema");

    ano++;
    atualizarTela();
    checarFimDeJogo();
}

function checarFimDeJogo() {
    const modal = document.getElementById("modal-fim");
    const titulo = document.getElementById("modal-titulo");
    const mensagem = document.getElementById("modal-mensagem");
    const iconeFinal = document.getElementById("modal-icon-final");

    if (sustentabilidade <= 0) {
        iconeFinal.innerText = "💀";
        titulo.innerText = "Colapso Total!";
        mensagem.innerText = "A fazenda virou um deserto. Bia chorou, Chico faliu. O futuro sustentável falhou.";
        modal.classList.remove("hidden");
    } else if (dinheiro < -200) {
        iconeFinal.innerText = "💸";
        titulo.innerText = "Falência!";
        mensagem.innerText = "As dívidas se acumularam e o banco tomou a fazenda. O agro forte faliu.";
        modal.classList.remove("hidden");
    } else if (ano > 10) {
        if (sustentabilidade >= 65) {
            iconeFinal.innerText = "🏆";
            titulo.innerText = "Vitória Lendária!";
            mensagem.innerText = `Parabéns! Ano 10 com R$ ${dinheiro} e ${sustentabilidade}% verde! Você equilibrou Produção e Ambiente perfeitamente!`;
        } else {
            iconeFinal.innerText = "⚠️";
            titulo.innerText = "Vitória Parcial";
            mensagem.innerText = `Você sobreviveu com R$ ${dinheiro}, mas a terra terminou fraca (${sustentabilidade}%). Tente ser mais sustentável na próxima!`;
        }
        modal.classList.remove("hidden");
    }
}

function reiniciarJogo() {
    dinheiro = 500; sustentabilidade = 50; producao = 20; ano = 1;
    document.getElementById("log-mensagens").innerHTML = '<p class="msg-sistema">O jogo recomeçou. Boa sorte administrador!</p>';
    document.getElementById("modal-fim").classList.add("hidden");
    atualizarTela();
}

atualizarTela();