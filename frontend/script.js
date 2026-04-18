const symbolCatalog = {
  rat: { name: "Ratinho", short: "RT" },
  cheese: { name: "Queijo", short: "QJ" },
  coin: { name: "Moeda", short: "MO" },
  diamond: { name: "Diamante", short: "DM" },
  crown: { name: "Coroa", short: "CR" },
  bell: { name: "Sino", short: "SN" }
};

const spinOrder = Object.keys(symbolCatalog);

const winningLine = [
  [0, 0],
  [0, 1],
  [0, 2]
];

const initialBoard = [
  ["rat", "coin", "diamond"],
  ["cheese", "rat", "crown"],
  ["bell", "diamond", "rat"]
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
  reels: initialBoard,
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

function randomSymbolKey() {
  return spinOrder[Math.floor(Math.random() * spinOrder.length)];
}

function createRandomBoard() {
  return Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => randomSymbolKey()));
}

function createFirstWinBoard() {
  return [
    ["rat", "rat", "rat"],
    ["diamond", "coin", "diamond"],
    ["cheese", "crown", "bell"]
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

function isWinningCell(rowIndex, colIndex) {
  if (!state.lastWin) return false;
  return winningLine.some(([row, column]) => row === rowIndex && column === colIndex);
}

function renderSymbolMarkup(symbolKey) {
  const symbol = symbolCatalog[symbolKey];

  return `
    <div class="symbol-badge symbol-${symbolKey}">
      <span class="symbol-mark">${symbol.short}</span>
      <span class="symbol-name">${symbol.name}</span>
    </div>
  `;
}

function renderBoard() {
  return state.reels
    .map(
      (row, rowIndex) => `
        <div class="reel-row">
          ${row
            .map(
              (symbolKey, colIndex) => `
                <div class="reel-cell ${isWinningCell(rowIndex, colIndex) ? "winner" : ""}">
                  ${renderSymbolMarkup(symbolKey)}
                </div>
              `
            )
            .join("")}
        </div>
      `
    )
    .join("");
}

function renderRatIllustration() {
  return `
    <svg class="rat-illustration" viewBox="0 0 460 500" role="img" aria-label="Rato estilizado usando varios cordoes de ouro">
      <defs>
        <linearGradient id="furMain" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#a48a81" />
          <stop offset="55%" stop-color="#7a6059" />
          <stop offset="100%" stop-color="#533c36" />
        </linearGradient>
        <linearGradient id="furLight" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#c9afa6" />
          <stop offset="100%" stop-color="#8b6d66" />
        </linearGradient>
        <linearGradient id="goldChain" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stop-color="#fff1aa" />
          <stop offset="35%" stop-color="#f7cb46" />
          <stop offset="100%" stop-color="#bc7c0b" />
        </linearGradient>
        <radialGradient id="noseGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#ffcad6" />
          <stop offset="100%" stop-color="#de7f98" />
        </radialGradient>
        <filter id="shadowSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="230" cy="462" rx="150" ry="22" fill="rgba(0,0,0,0.26)" />
      <path d="M141 355c31-22 70-33 89-33 69 0 112 55 112 109v21H117v-17c0-34 8-56 24-80z" fill="#342422" />
      <path d="M137 351c24-17 61-28 93-28 81 0 131 53 131 124v11H134v-30c0-32 3-52 3-77z" fill="url(#furMain)" filter="url(#shadowSoft)" />
      <path d="M179 358c15 12 33 18 52 18 21 0 41-7 58-21 0 0 14 18 14 52H164c0-29 15-49 15-49z" fill="#2c1e1b" opacity="0.72" />
      <path d="M153 120c-20-48 10-88 54-88 28 0 48 14 58 39-12 15-18 39-18 39z" fill="#7e6460" />
      <path d="M307 120c20-48-10-88-54-88-28 0-48 14-58 39 12 15 18 39 18 39z" fill="#6d5551" opacity="0" />
      <path d="M149 120c-17-53 16-95 65-95 34 0 59 18 69 49-17 10-35 26-46 46z" fill="#8d7069" />
      <path d="M311 120c17-53-16-95-65-95-34 0-59 18-69 49 17 10 35 26 46 46z" fill="#8a6c65" />
      <ellipse cx="155" cy="84" rx="44" ry="50" fill="#846761" />
      <ellipse cx="305" cy="84" rx="44" ry="50" fill="#7c5f59" />
      <ellipse cx="159" cy="88" rx="25" ry="30" fill="#d7a6a4" />
      <ellipse cx="301" cy="88" rx="25" ry="30" fill="#d7a6a4" />

      <path d="M230 76c91 0 148 74 148 146 0 67-48 126-148 126S82 289 82 222C82 150 139 76 230 76z" fill="url(#furMain)" filter="url(#shadowSoft)" />
      <path d="M230 112c59 0 96 46 96 88 0 45-31 93-96 93-65 0-96-48-96-93 0-42 37-88 96-88z" fill="url(#furLight)" opacity="0.78" />
      <ellipse cx="180" cy="171" rx="24" ry="29" fill="#1f1412" />
      <ellipse cx="281" cy="171" rx="24" ry="29" fill="#1f1412" />
      <ellipse cx="187" cy="162" rx="7" ry="9" fill="#ffffff" opacity="0.8" />
      <ellipse cx="288" cy="162" rx="7" ry="9" fill="#ffffff" opacity="0.8" />

      <path d="M189 227c16 19 28 28 41 28 14 0 27-9 41-28" fill="none" stroke="#4a322d" stroke-linecap="round" stroke-width="7" />
      <ellipse cx="230" cy="204" rx="34" ry="25" fill="url(#noseGlow)" />
      <ellipse cx="230" cy="201" rx="15" ry="10" fill="#93495d" opacity="0.52" />
      <path d="M198 203c-24 6-43 13-69 26" fill="none" stroke="#ceb7b0" stroke-linecap="round" stroke-width="4" />
      <path d="M261 203c24 6 43 13 69 26" fill="none" stroke="#ceb7b0" stroke-linecap="round" stroke-width="4" />
      <path d="M201 214c-27 12-44 20-66 38" fill="none" stroke="#ceb7b0" stroke-linecap="round" stroke-width="4" />
      <path d="M259 214c27 12 44 20 66 38" fill="none" stroke="#ceb7b0" stroke-linecap="round" stroke-width="4" />
      <path d="M207 226c-20 16-33 28-49 47" fill="none" stroke="#ceb7b0" stroke-linecap="round" stroke-width="4" />
      <path d="M253 226c20 16 33 28 49 47" fill="none" stroke="#ceb7b0" stroke-linecap="round" stroke-width="4" />

      <rect x="205" y="245" width="20" height="36" rx="6" fill="#fef7ef" />
      <rect x="235" y="245" width="20" height="36" rx="6" fill="#fef7ef" />

      <path d="M154 342c15-17 35-30 76-34 41 4 61 17 76 34" fill="none" stroke="#201412" stroke-linecap="round" stroke-width="8" />
      <path d="M134 342c14-21 56-41 96-41 47 0 81 14 97 41" fill="none" stroke="url(#goldChain)" stroke-linecap="round" stroke-width="13" />
      <path d="M128 367c16-22 61-40 102-40 47 0 86 16 102 40" fill="none" stroke="url(#goldChain)" stroke-linecap="round" stroke-width="15" />
      <path d="M119 392c18-24 69-41 111-41 50 0 92 17 111 41" fill="none" stroke="url(#goldChain)" stroke-linecap="round" stroke-width="17" />
      <circle cx="230" cy="395" r="26" fill="url(#goldChain)" />
      <circle cx="230" cy="395" r="15" fill="#8b5600" opacity="0.26" />
      <rect x="206" y="383" width="48" height="22" rx="11" fill="rgba(255,255,255,0.28)" />
    </svg>
  `;
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
            Uma brincadeira de slot com aparencia mais realista, maquina mais pesada e um rato de respeito comandando o premio ficticio.
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
            <div class="rat-floor"></div>
            ${renderRatIllustration()}
            <div class="rat-caption">
              <strong>Patrao do jackpot falso</strong>
              <span>Mais volume, mais brilho e aquela energia de mascote suspeitamente confiante.</span>
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
            <div class="cabinet-lights" aria-hidden="true">
              ${Array.from({ length: 12 }, (_, index) => `<span style="--light-index:${index}"></span>`).join("")}
            </div>

            <div class="machine-top">
              <span class="jackpot-label">jackpot da zoeira</span>
              <strong>${formatMoney(5000)}</strong>
            </div>

            <div class="machine-body">
              <div class="machine-screen">
                <div class="machine-reflection"></div>
                <div class="reels-board">
                  ${renderBoard()}
                </div>
              </div>

              <div class="machine-lever" aria-hidden="true">
                <div class="lever-handle"></div>
                <div class="lever-stem"></div>
                <div class="lever-base"></div>
              </div>
            </div>

            <div class="machine-footer">
              <div class="credit-pill">
                <span>saldo</span>
                <strong>${formatMoney(state.balance)}</strong>
              </div>

              <div class="credit-pill">
                <span>ultimo premio</span>
                <strong>${state.lastWin ? formatMoney(state.lastWin) : "R$ 0"}</strong>
              </div>
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
            <p>Quem abrir a pagina ja recebe um saldo ficticio de R$ 1.000 para testar sem precisar conectar nada.</p>
          </div>

          <div class="info-card">
            <strong>Primeiro giro premiado</strong>
            <p>Na primeira jogada o rato entrega R$ 5.000 de mentira e acende a linha vencedora no topo.</p>
          </div>

          <div class="info-card safe">
            <strong>Sem deposito, sem banco</strong>
            <p>A experiencia termina no premio de demo. Continua sendo uma brincadeira local, sem cobranca e sem fluxo real.</p>
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
                  O rato encerrou o show. Se quiser repetir a cena com seu amigo, e so reiniciar a brincadeira.
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
  state.message = "O rato esta observando os rolos e deixando o brilho da maquina trabalhar...";
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
      state.message = "O show principal ja passou. Reinicie a demo se quiser repetir a entrada cinematografica.";
      registerHistory("Giro extra", "A demo segura nao oferece novos premios depois da rodada especial.");
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
  state.reels = initialBoard;
  state.history = [];
  render();
}

render();
