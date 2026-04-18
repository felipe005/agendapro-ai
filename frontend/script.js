const symbolCatalog = {
  rat: { name: "Ratinho", short: "RT" },
  cheese: { name: "Queijo", short: "QJ" },
  coin: { name: "Moeda", short: "MO" },
  diamond: { name: "Diamante", short: "DM" },
  crown: { name: "Coroa", short: "CR" },
  bell: { name: "Sino", short: "SN" }
};

const spinOrder = Object.keys(symbolCatalog);
const initialBoard = [
  ["rat", "coin", "diamond"],
  ["cheese", "rat", "crown"],
  ["bell", "diamond", "rat"]
];

const winningLine = [
  [0, 0],
  [0, 1],
  [0, 2]
];

const state = {
  spinCount: 0,
  isSpinning: false,
  showOverlay: false,
  highlightWin: false,
  wheelAngle: 0,
  reels: initialBoard,
  status: "Toque no botao e veja o painel ganhar vida.",
  history: []
};

const app = document.querySelector("#app");

function randomSymbolKey() {
  return spinOrder[Math.floor(Math.random() * spinOrder.length)];
}

function createRandomBoard() {
  return Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => randomSymbolKey()));
}

function createHeroBoard() {
  return [
    ["rat", "rat", "rat"],
    ["diamond", "coin", "diamond"],
    ["cheese", "crown", "bell"]
  ];
}

function isWinningCell(rowIndex, colIndex) {
  if (!state.highlightWin) return false;
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

function renderHistory() {
  if (!state.history.length) {
    return `<p class="empty-history">As ultimas combinacoes aparecem aqui.</p>`;
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
      <path d="M198 203c-24 6-43 13-69 26" fill="none" stroke="#ceb7b0" stroke-linecap="round" stroke-width="4" />
      <path d="M261 203c24 6 43 13 69 26" fill="none" stroke="#ceb7b0" stroke-linecap="round" stroke-width="4" />
      <path d="M201 214c-27 12-44 20-66 38" fill="none" stroke="#ceb7b0" stroke-linecap="round" stroke-width="4" />
      <path d="M259 214c27 12 44 20 66 38" fill="none" stroke="#ceb7b0" stroke-linecap="round" stroke-width="4" />
      <rect x="205" y="245" width="20" height="36" rx="6" fill="#fef7ef" />
      <rect x="235" y="245" width="20" height="36" rx="6" fill="#fef7ef" />

      <path d="M154 342c15-17 35-30 76-34 41 4 61 17 76 34" fill="none" stroke="#201412" stroke-linecap="round" stroke-width="8" />
      <path d="M134 342c14-21 56-41 96-41 47 0 81 14 97 41" fill="none" stroke="url(#goldChain)" stroke-linecap="round" stroke-width="13" />
      <path d="M128 367c16-22 61-40 102-40 47 0 86 16 102 40" fill="none" stroke="url(#goldChain)" stroke-linecap="round" stroke-width="15" />
      <path d="M119 392c18-24 69-41 111-41 50 0 92 17 111 41" fill="none" stroke="url(#goldChain)" stroke-linecap="round" stroke-width="17" />
      <circle cx="230" cy="395" r="26" fill="url(#goldChain)" />
    </svg>
  `;
}

function renderWheel() {
  const items = ["RT", "CR", "DM", "MO", "SN", "QJ"];

  return `
    <div class="wheel-wrap">
      <div class="wheel-pointer"></div>
      <div class="wheel" style="transform: rotate(${state.wheelAngle}deg);">
        ${items
          .map(
            (item, index) => `
              <span class="wheel-slice slice-${index + 1}">
                <b>${item}</b>
              </span>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function render() {
  app.innerHTML = `
    <div class="page-shell">
      <div class="light light-left"></div>
      <div class="light light-right"></div>

      <main class="mobile-shell">
        <section class="hero-card">
          <div class="hero-topline">
            <span class="eyebrow">Ratinho Dourado</span>
            <span class="micro-badge">interface ficticia</span>
          </div>
          <h1>Visual limpo, brilho alto, toque rapido.</h1>
          <p class="hero-text">${state.status}</p>
          ${renderWheel()}
        </section>

        <section class="stage-card">
          <div class="rat-frame">
            <div class="rat-spotlight"></div>
            <div class="rat-floor"></div>
            ${renderRatIllustration()}
          </div>
        </section>

        <section class="panel-card">
          <div class="panel-top">
            <div>
              <p class="section-label">Painel</p>
              <h2>Giro visual</h2>
            </div>
            <button id="spin-button" class="spin-button" ${state.isSpinning ? "disabled" : ""}>
              ${state.isSpinning ? "Girando..." : "Girar"}
            </button>
          </div>

          <div class="machine-screen ${state.isSpinning ? "spinning" : ""}">
            <div class="machine-reflection"></div>
            <div class="reels-board">
              ${renderBoard()}
            </div>
          </div>
        </section>

        <section class="history-card">
          <div class="panel-top compact">
            <div>
              <p class="section-label">Colecao</p>
              <h2>Ultimos giros</h2>
            </div>
          </div>
          <ul class="history-list">
            ${renderHistory()}
          </ul>
        </section>

        <footer class="footer-note">
          Visual mobile-first com animacao decorativa e interface ficticia.
        </footer>
      </main>

      ${
        state.showOverlay
          ? `
            <div class="overlay">
              <div class="overlay-card">
                <p class="section-label">Destaque</p>
                <h2>Sequencia dourada liberada</h2>
                <p>O painel travou na linha principal e a roleta completou a cena.</p>
                <button id="reset-button" class="reset-button">Repetir visual</button>
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
  document.querySelector("#spin-button")?.addEventListener("click", spin);
  document.querySelector("#reset-button")?.addEventListener("click", resetGame);
}

function registerHistory(title, text) {
  state.history = [{ title, text }, ...state.history].slice(0, 4);
}

function spin() {
  if (state.isSpinning) return;

  state.isSpinning = true;
  state.highlightWin = false;
  state.showOverlay = false;
  state.spinCount += 1;
  state.wheelAngle += 540 + state.spinCount * 35;
  state.status = "A roleta entrou em movimento e o painel ganhou reflexo novo.";
  state.reels = createRandomBoard();
  render();

  window.setTimeout(() => {
    if (state.spinCount % 2 === 1) {
      state.reels = createHeroBoard();
      state.highlightWin = true;
      state.status = "Linha principal acesa. O rato puxou o foco para o topo.";
      state.showOverlay = true;
      registerHistory("Sequencia dourada", "Topo alinhado com tres simbolos do rato.");
    } else {
      state.reels = createRandomBoard();
      state.status = "Nova composicao criada. O painel segue em modo visual.";
      registerHistory("Giro livre", "Combinacao renovada com brilho mais discreto.");
    }

    state.isSpinning = false;
    render();
  }, 1400);
}

function resetGame() {
  state.showOverlay = false;
  state.highlightWin = false;
  state.status = "Toque no botao e veja o painel ganhar vida.";
  render();
}

render();
