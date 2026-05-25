// VARIÁVEIS DE ESTADO DO JOGO (Dados da Fazenda)
let dinheiro = 500;
let sustentabilidade = 50;
let producao = 20;
let ano = 1;

// FUNÇÃO PARA ATUALIZAR A INTERFACE (TELA)
function atualizarTela() {
    document.getElementById("txt-ano").innerText = `${ano} / 10`;
    document.getElementById("txt-dinheiro").innerText = `R$ ${dinheiro}`;
    document.getElementById("txt-producao").innerText = `${producao} toneladas`;
    
    // Atualiza a barra de progresso da sustentabilidade
    const barra = document.getElementById("barra-sustentabilidade");
    barra.style.width = `${sustentabilidade}%`;
    barra.innerText = `${sustentabilidade}%`;

    // Mudar a cor da barra dependendo da saúde do ambiente
    if (sustentabilidade > 65) {
        barra.style.backgroundColor = "#52b788"; // Verde (Ótimo)
    } else if (sustentabilidade > 35) {
        barra.style.backgroundColor = "#ffb703"; // Amarelo (Alerta)
    } else {
        barra.style.backgroundColor = "#e63946"; // Vermelho (Perigo)
    }
}

// FUNÇÃO PARA ADICIONAR MENSAGENS AO DIÁRIO DA FAZENDA (LOG)
function adicionarLog(texto, tipo) {
    const logBox = document.getElementById("log-mensagens");
    const novoParagrafo = document.createElement("p");
    novoParagrafo.innerText = texto;
    
    // Aplica classes css baseadas no tipo de mensagem
    if (tipo) novoParagrafo.classList.add(tipo);
    
    logBox.appendChild(novoParagrafo);
    // Faz o scroll rolar automaticamente para a última mensagem
    logBox.scrollTop = logBox.scrollHeight;
}

// FUNÇÃO PARA PROCESSAR AS COMPRAS DO JOGADOR
function comprarAcao(tipoAcao) {
    switch(tipoAcao) {
        case 'reflorestar':
            if (dinheiro >= 100) {
                dinheiro -= 100;
                sustentabilidade = Math.min(100, sustentabilidade + 15); // Limita o máximo em 100%
                adicionarLog("🌳 Você investiu em Reflorestamento. A biodiversidade agradece! (+15% Sustentabilidade)", "msg-sucesso");
            } else {
                adicionarLog("❌ Dinheiro insuficiente para Reflorestamento!", "msg-perigo");
            }
            break;

        case 'organico':
            if (dinheiro >= 150) {
                dinheiro -= 150;
                producao += 5;
                sustentabilidade = Math.min(100, sustentabilidade + 10);
                adicionarLog("🪱 Uso de Adubo Orgânico implantado! O solo ficou mais saudável. (+5 Prod. | +10% Sust.)", "msg-sucesso");
            } else {
                adicionarLog("❌ Dinheiro insuficiente para Adubo Orgânico!", "msg-perigo");
            }
            break;

        case 'gotejamento':
            if (dinheiro >= 250) {
                dinheiro -= 250;
                producao += 15;
                sustentabilidade = Math.min(100, sustentabilidade + 5);
                adicionarLog("💧 Irrigação por Gotejamento instalada! Economia imensa de água. (+15 Prod. | +5% Sust.)", "msg-sucesso");
            } else {
                adicionarLog("❌ Dinheiro insuficiente para Irrigação por Gotejamento!", "msg-perigo");
            }
            break;

        case 'agrotoxico':
            dinheiro += 100; // Recebe bônus imediato de corte de custo
            producao += 20;
            sustentabilidade = Math.max(0, sustentabilidade - 20); // Limita o mínimo em 0%
            adicionarLog("⚠️ Defensivos Químicos Pesados aplicados. As pragas morreram, mas o solo e as águas foram contaminados! (+20 Prod. | -20% Sust.)", "msg-perigo");
            break;

        case 'desmatar':
            if (dinheiro >= 50) {
                dinheiro -= 50;
                producao += 30;
                sustentabilidade = Math.max(0, sustentabilidade - 25);
                adicionarLog("🪓 Você derrubou uma área de mata nativa para abrir espaço. A produção vai subir, mas o impacto ambiental foi alto. (+30 Prod. | -25% Sust.)", "msg-perigo");
            } else {
                adicionarLog("❌ Dinheiro insuficiente para expandir área!", "msg-perigo");
            }
            break;
    }
    atualizarTela();
    checarFimDeJogo();
}

// FUNÇÃO DO BOTÃO "AVANÇAR ANO"
function avancarAno() {
    // 1. O jogador ganha dinheiro com base na sua produção
    let lucroDoAno = producao * 12;
    
    // 2. Penalidades ou bônus com base na Sustentabilidade
    if (sustentabilidade < 30) {
        // Solo degradado produz menos lucros e causa quebra de safra
        lucroDoAno = Math.floor(lucroDoAno * 0.5);
        producao = Math.max(5, producao - 4); // Produção cai permanentemente
        adicionarLog(`📉 Ano ${ano}: A baixa sustentabilidade degradou seu solo! Lucros reduzidos pela metade e produção caiu.`, "msg-perigo");
    } else if (sustentabilidade > 75) {
        // Sustentabilidade alta dá bônus de mercado verde (bônus financeiro)
        lucroDoAno += 100;
        adicionarLog(`✨ Ano ${ano}: Selo Verde conquistado! Você ganhou um bônus de R$ 100 por práticas sustentáveis.`, "msg-sucesso");
    }

    dinheiro += lucroDoAno;
    adicionarLog(`💰 Fim do Ano ${ano}: Sua colheita rendeu R$ ${lucroDoAno} para os cofres da fazenda.`, "msg-sistema");

    // 3. Avançar o ano
    ano++;

    atualizarTela();
    checarFimDeJogo();
}

// FUNÇÃO PARA CHECAR AS CONDIÇÕES DE VITÓRIA OU DERROTA
function checarFimDeJogo() {
    const modal = document.getElementById("modal-fim");
    const titulo = document.getElementById("modal-titulo");
    const mensagem = document.getElementById("modal-mensagem");

    // Derrota 1: Colapso Ambiental
    if (sustentabilidade <= 0) {
        titulo.innerText = "🚨 Colapso Ambiental!";
        mensagem.innerText = "A sustentabilidade da sua fazenda chegou a 0%. O solo ficou completamente infértil, os rios secaram e o governo interditou suas terras. O Futuro Sustentável falhou.";
        modal.classList.remove("hidden");
    }
    // Derrota 2: Falência
    else if (dinheiro < 0) {
        titulo.innerText = "💸 Falência Financeira!";
        mensagem.innerText = "Seu dinheiro ficou negativo! Você não conseguiu pagar os custos da fazenda e os bancos tomaram suas propriedades. O Agro Forte faliu.";
        modal.classList.remove("hidden");
    }
    // Vitória: Chegou ao ano 10 equilibrado
    else if (ano > 10) {
        if (sustentabilidade >= 60) {
            titulo.innerText = "🏆 Vitória Sustentável!";
            mensagem.innerText = `Parabéns! Você chegou ao Ano 10 com R$ ${dinheiro} em caixa e ${sustentabilidade}% de Sustentabilidade! Você provou que é possível ter um AGRO FORTE e um FUTURO SUSTENTÁVEL em perfeito equilíbrio!`;
        } else {
            titulo.innerText = "⚠️ Vitória Parcial (Alerta)";
            mensagem.innerText = `Você sobreviveu aos 10 anos com R$ ${dinheiro}, mas terminou com apenas ${sustentabilidade}% de Sustentabilidade. Sua fazenda deu lucro, mas o futuro da região está ameaçado pelo desgaste ambiental. Tente jogar novamente buscando um equilíbrio melhor!`;
        }
        modal.classList.remove("hidden");
    }
}

// FUNÇÃO PARA REINICIAR O JOGO
function reiniciarJogo() {
    dinheiro = 500;
    sustentabilidade = 50;
    producao = 20;
    ano = 1;
    
    // Limpar o Diário da Fazenda
    document.getElementById("log-mensagens").innerHTML = '<p class="msg-sistema">O jogo recomeçou. Boa sorte administrador!</p>';
    
    // Esconder o Modal
    document.getElementById("modal-fim").classList.add("hidden");
    
    atualizarTela();
}

// Iniciar o jogo mostrando os valores originais na tela logo ao abrir a página
atualizarTela();