const symbols = [
  { icon: "🐭", name: "Ratinho" },
  { icon: "🧀", name: "Queijo" },
  { icon: "🪙", name: "Moeda" },
  { icon: "💎", name: "Brilho" },
  { icon: "👑", name: "Coroa" },
  { icon: "🔔", name: "Sino" }
];

const paylines = [
  [0, 0, 0],
  [1, 1, 1],
  [2, 2, 2]
];

const state = {
  balance: 1000,
  bet: 200,
  spinCount: 0,
  isSpinning: false,
  showOverlay: false,
  lastWin: 0,
  totalWon: 0,
  message: "Voce ganhou R$ 1.000 ficticios para brincar. O primeiro giro ja vem premiado.",
  reels: [
    ["🐭", "🪙", "💎"],
    ["🧀", "🐭", "👑"],
    ["🔔", "💎", "🐭"]
  ],
  history: []
};

const app = document.querySelector("#app");

function formatMoney(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0
  });
}

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)].icon;
}

function createRandomBoard() {
  return Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => randomSymbol()));
}

function createFirstWinBoard() {
  return [
    ["🐭", "🐭", "🐭"],
    ["💎", "🪙", "💎"],
    ["🧀", "👑", "🔔"]
  ];
}

function renderHistory() {
  if (!state.history.length) {
    return `<p class="empty-history">Os ultimos giros vao aparecer aqui.</p>`;
  }

  return state.history
    .map(
      (item) => `
        <li class="history-item">
          <strong>${item.title}</strong>
          <span>${item.text}</span>
        </li>
      `
    )
    .join("");
}

function renderBoard() {
  return state.reels
    .map(
      (row, rowIndex) => `
        <div class="reel-row">
          ${row
            .map(
              (symbol, colIndex) => `
                <div class="reel-cell ${isWinningCell(rowIndex, colIndex) ? "winner" : ""}">
                  <span>${symbol}</span>
                </div>
              `
            )
            .join("")}
        </div>
      `
    )
    .join("");
}

function isWinningCell(rowIndex, colIndex) {
  if (!state.lastWin) return false;
  return paylines[0].every((row, index) => row === rowIndex && index === colIndex);
}

function render() {
  const canSpin = !state.isSpinning && state.balance >= state.bet && !state.showOverlay;

  app.innerHTML = `
    <div class="page-shell">
      <div class="light light-left"></div>
      <div class="light light-right"></div>

      <section class="hero-panel">
        <div class="hero-copy">
          <p class="eyebrow">Demo segura</p>
          <h1>Ratinho Dourado</h1>
          <p class="hero-text">
            Uma brincadeira de slot com clima exagerado, saldo falso e premio de mentira para voce testar com um amigo.
          </p>

          <div class="hero-stats">
            <article class="stat-card">
              <strong>${formatMoney(state.balance)}</strong>
              <span>saldo ficticio</span>
            </article>
            <article class="stat-card">
              <strong>${formatMoney(state.bet)}</strong>
              <span>aposta por giro</span>
            </article>
            <article class="stat-card">
              <strong>${formatMoney(state.totalWon)}</strong>
              <span>premios da brincadeira</span>
            </article>
          </div>
        </div>

        <div class="rat-stage">
          <div class="rat-card">
            <div class="rat-spotlight"></div>
            <div class="rat-figure" aria-hidden="true">
              <div class="ear ear-left"></div>
              <div class="ear ear-right"></div>
              <div class="rat-head">
                <div class="eye eye-left"></div>
                <div class="eye eye-right"></div>
                <div class="nose"></div>
                <div class="tooth tooth-left"></div>
                <div class="tooth tooth-right"></div>
                <div class="chain chain-top"></div>
                <div class="chain chain-mid"></div>
                <div class="chain chain-bottom"></div>
              </div>
              <div class="rat-body"></div>
            </div>
            <div class="rat-caption">
              <strong>Rato cheio dos cordoes</strong>
              <span>Carisma duvidoso, brilho impecavel e sorte programada no primeiro giro.</span>
            </div>
          </div>
        </div>
      </section>

      <main class="content-grid">
        <section class="machine-panel">
          <div class="panel-heading">
            <p class="eyebrow">Mesa principal</p>
            <h2>Gire o Ratinho</h2>
          </div>

          <div class="machine-shell ${state.isSpinning ? "spinning" : ""}">
            <div class="machine-top">
              <span class="jackpot-label">jackpot da zoeira</span>
              <strong>${formatMoney(5000)}</strong>
            </div>

            <div class="reels-board">
              ${renderBoard()}
            </div>

            <div class="machine-controls">
              <label class="bet-box">
                <span>Aposta</span>
                <select id="bet-select" ${state.isSpinning || state.showOverlay ? "disabled" : ""}>
                  ${[50, 100, 200, 500]
                    .map(
                      (value) => `
                        <option value="${value}" ${value === state.bet ? "selected" : ""}>
                          ${formatMoney(value)}
                        </option>
                      `
                    )
                    .join("")}
                </select>
              </label>

              <button id="spin-button" class="spin-button" ${canSpin ? "" : "disabled"}>
                ${state.isSpinning ? "Girando..." : "Puxar alavanca"}
              </button>
            </div>
          </div>

          <div class="message-card">
            <strong>Recado do rato</strong>
            <p>${state.message}</p>
          </div>
        </section>

        <aside class="info-panel">
          <div class="panel-heading">
            <p class="eyebrow">Clima da brincadeira</p>
            <h2>Como essa demo funciona</h2>
          </div>

          <div class="info-card">
            <strong>Entrada liberada</strong>
            <p>Quem abrir a pagina ja recebe um saldo ficticio de R$ 1.000 para testar.</p>
          </div>

          <div class="info-card">
            <strong>Primeiro giro premiado</strong>
            <p>Na primeira jogada o rato entrega R$ 5.000 de mentira e faz a entrada triunfal.</p>
          </div>

          <div class="info-card safe">
            <strong>Sem deposito, sem banco</strong>
            <p>A experiencia para por ai. Depois do premio aparece um aviso de fim de demo, sem cobrar nada.</p>
          </div>

          <div class="history-card">
            <strong>Historico</strong>
            <ul class="history-list">
              ${renderHistory()}
            </ul>
          </div>
        </aside>
      </main>

      ${
        state.showOverlay
          ? `
            <div class="overlay">
              <div class="overlay-card">
                <p class="eyebrow">Fim da demo</p>
                <h2>${formatMoney(5000)} caiu na conta ficticia</h2>
                <p>
                  O rato ja fez o show dele. Para continuar a brincadeira, combine a proxima rodada pessoalmente com seu amigo.
                </p>
                <button id="reset-button" class="reset-button">Reiniciar brincadeira</button>
              </div>
            </div>
          `
          : ""
      }
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  document.querySelector("#bet-select")?.addEventListener("change", (event) => {
    state.bet = Number(event.target.value);
    render();
  });

  document.querySelector("#spin-button")?.addEventListener("click", spin);
  document.querySelector("#reset-button")?.addEventListener("click", resetGame);
}

function registerHistory(title, text) {
  state.history = [{ title, text }, ...state.history].slice(0, 4);
}

function spin() {
  if (state.isSpinning || state.showOverlay || state.balance < state.bet) return;

  state.isSpinning = true;
  state.lastWin = 0;
  state.balance -= state.bet;
  state.message = "O rato esta sacudindo os cordoes e preparando o resultado...";
  state.reels = createRandomBoard();
  render();

  window.setTimeout(() => {
    state.spinCount += 1;

    if (state.spinCount === 1) {
      state.lastWin = 5000;
      state.totalWon += state.lastWin;
      state.balance += state.lastWin;
      state.reels = createFirstWinBoard();
      state.message = "Premio maximo de brincadeira liberado. Demo encerrada com estilo.";
      state.showOverlay = true;
      registerHistory("Primeiro giro", `Voce recebeu ${formatMoney(state.lastWin)} em saldo ficticio.`);
    } else {
      state.reels = createRandomBoard();
      state.message = "O rato ja fez a cena principal. Reinicie se quiser repetir a brincadeira.";
      registerHistory("Giro extra", "A demo segura nao oferece novos premios depois da entrada especial.");
    }

    state.isSpinning = false;
    render();
  }, 1500);
}

function resetGame() {
  state.balance = 1000;
  state.bet = 200;
  state.spinCount = 0;
  state.isSpinning = false;
  state.showOverlay = false;
  state.lastWin = 0;
  state.totalWon = 0;
  state.message = "Voce ganhou R$ 1.000 ficticios para brincar. O primeiro giro ja vem premiado.";
  state.reels = [
    ["🐭", "🪙", "💎"],
    ["🧀", "🐭", "👑"],
    ["🔔", "💎", "🐭"]
  ];
  state.history = [];
  render();
}

render();
