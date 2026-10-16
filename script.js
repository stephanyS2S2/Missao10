const pontosEl = document.getElementById("pontos");
const fragmentosEl = document.getElementById("fragmentos");
const vidasEl = document.getElementById("vidas");
const barraEl = document.getElementById("barra");
const faseEl = document.getElementById("fase");
const tipoEl = document.getElementById("tipo");
const operacaoEl = document.getElementById("operacao");
const instrucaoEl = document.getElementById("instrucao");
const respostasEl = document.getElementById("respostas");
const feedbackEl = document.getElementById("feedback");
const proximoBtn = document.getElementById("proximo");
const reiniciarBtn = document.getElementById("reiniciar");
const conquistasEl = document.getElementById("conquistas");

let perguntas = [];
let rodada = 0;
let pontos = 0;
let vidas = 3;
let acertos = 0;
let acertosSeguidos = 0;
let medalhas = [];
let respondido = false;
let terminou = false;

function embaralhar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

function criarPergunta(indice) {
  let a;
  let b;

  // Na fase final, aparecem mais combinações com resultados entre 5 e 10.
  if (indice >= 7 && Math.random() < 0.7) {
    const resultado = Math.floor(Math.random() * 6) + 5;
    a = Math.floor(Math.random() * (resultado + 1));
    b = resultado - a;
  } else {
    a = Math.floor(Math.random() * 10);
    b = Math.floor(Math.random() * (11 - a));
  }

  return { a: a, b: b, resultado: a + b };
}

function iniciarJogo() {
  rodada = 0;
  pontos = 0;
  vidas = 3;
  acertos = 0;
  acertosSeguidos = 0;
  medalhas = [];
  respondido = false;
  terminou = false;

  perguntas = [];
  for (let i = 0; i < 10; i++) {
    perguntas.push(criarPergunta(i));
  }

  carregarPergunta();
  atualizarPainel();
}

function carregarPergunta() {
  respondido = false;
  proximoBtn.hidden = true;
  feedbackEl.textContent = "Cada acerto vale 10 pontos.";
  feedbackEl.style.color = "";
  respostasEl.innerHTML = "";

  if (rodada < 4) {
    tipoEl.textContent = "DESAFIO DE AQUECIMENTO";
    instrucaoEl.textContent = "Escolha o resultado correto.";
  } else if (rodada < 7) {
    tipoEl.textContent = "COMBINAÇÕES SECRETAS";
    instrucaoEl.textContent = "Encontre a soma e observe como os números se combinam.";
  } else {
    tipoEl.textContent = "MISSÃO FINAL";
    instrucaoEl.textContent = "Resolva a operação para recuperar energia.";
  }

  faseEl.textContent = "Fase " + (rodada < 4 ? 1 : rodada < 7 ? 2 : 3) + " de 3";

  const pergunta = perguntas[rodada];
  operacaoEl.textContent = pergunta.a + " + " + pergunta.b + " = ?";

  const opcoes = new Set([pergunta.resultado]);

  while (opcoes.size < 4) {
    opcoes.add(Math.floor(Math.random() * 11));
  }

  embaralhar(Array.from(opcoes)).forEach(function (numero) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "answer";
    botao.textContent = numero;
    botao.addEventListener("click", function () {
      verificarResposta(numero);
    });
    respostasEl.appendChild(botao);
  });
}

function verificarResposta(resposta) {
  if (respondido || terminou) {
    return;
  }

  respondido = true;
  const pergunta = perguntas[rodada];
  const botoes = respostasEl.querySelectorAll("button");

  botoes.forEach(function (botao) {
    botao.disabled = true;
  });

  if (resposta === pergunta.resultado) {
    acertos++;
    acertosSeguidos++;

    let ganho = 10;
    if (acertosSeguidos >= 3) {
      ganho += 5;
    }
    pontos += ganho;

    feedbackEl.textContent =
      "✅ Correto! " + pergunta.a + " + " + pergunta.b + " = " +
      pergunta.resultado + ". Você ganhou " + ganho + " pontos!";
    feedbackEl.style.color = "var(--success)";

    if (acertosSeguidos >= 3 && !medalhas.includes("🔥 Sequência de acertos")) {
      medalhas.push("🔥 Sequência de acertos");
    }
  } else {
    vidas--;
    acertosSeguidos = 0;

    feedbackEl.textContent =
      "Quase! " + pergunta.a + " + " + pergunta.b + " = " +
      pergunta.resultado + ". Continue tentando!";
    feedbackEl.style.color = "var(--error)";
  }

  if (acertos >= 5 && !medalhas.includes("🔎 Explorador atento")) {
    medalhas.push("🔎 Explorador atento");
  }

  atualizarPainel();
  proximoBtn.hidden = false;

  if (rodada === 9 || vidas === 0) {
    proximoBtn.textContent = "Ver resultado";
  } else {
    proximoBtn.textContent = "Próximo desafio →";
  }
}

function atualizarPainel() {
  pontosEl.textContent = pontos;
  fragmentosEl.textContent = acertos + "/10";
  vidasEl.textContent = "❤️".repeat(vidas) + "🖤".repeat(3 - vidas);
  barraEl.style.width = (acertos * 10) + "%";

  if (medalhas.length > 0) {
    conquistasEl.textContent = medalhas.join(" · ");
  } else {
    conquistasEl.textContent = "Suas medalhas aparecerão durante a missão.";
  }
}

function finalizarJogo() {
  terminou = true;
  tipoEl.textContent = acertos === 10 ? "MISSÃO CONCLUÍDA!" : "FIM DA MISSÃO";
  operacaoEl.textContent = acertos === 10 ? "🌟 Estação reativada!" : "🛰️ Fim da expedição";
  instrucaoEl.textContent =
    "Você acertou " + acertos + " de 10 desafios e marcou " + pontos + " pontos.";

  respostasEl.innerHTML = "";

  if (acertos === 10) {
    feedbackEl.textContent = "🏆 Parabéns! Você completou todos os desafios!";
    if (!medalhas.includes("🏆 Mestre da Missão 10")) {
      medalhas.push("🏆 Mestre da Missão 10");
    }
  } else if (acertos >= 5) {
    feedbackEl.textContent = "Bom trabalho! Continue praticando as combinações numéricas.";
  } else {
    feedbackEl.textContent = "Cada tentativa ensina algo. Reinicie para fazer uma nova missão!";
  }

  feedbackEl.style.color = "";
  faseEl.textContent = "Missão encerrada";
  proximoBtn.hidden = true;
  atualizarPainel();
}

proximoBtn.addEventListener("click", function () {
  if (rodada === 9 || vidas === 0) {
    finalizarJogo();
    return;
  }

  rodada++;
  carregarPergunta();
});

reiniciarBtn.addEventListener("click", iniciarJogo);

iniciarJogo();
