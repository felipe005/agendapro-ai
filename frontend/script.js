const API_URL = window.__API_URL__ && !window.__API_URL__.startsWith("__") ? window.__API_URL__ : "";

const defaults = {
  brandName: "Maison Nova",
  garmentType: "pants",
  garmentDescription: "calca de alfaiataria preta, cintura alta, caimento reto e tecido premium",
  styleNotes: "editorial de luxo, elegancia contemporanea, passos confiantes",
  targetAudience: "marcas de moda premium e ecommerce",
  motionStyle: "luxury",
  cameraStyle: "editorial",
  backgroundStyle: "noir",
  aspectRatio: "9:16",
  duration: "8s",
  resolution: "720p",
  movementAmplitude: "auto",
  modelKey: "premium"
};

const featureCards = [
  {
    title: "Foto para passarela",
    text: "Envie a foto da roupa e gere um fashion film com foco no caimento real da peca."
  },
  {
    title: "Prompt especializado",
    text: "A UI monta um briefing pensado para moda, preservando textura, costura, cor e silhueta."
  },
  {
    title: "Pipeline pronto para venda",
    text: "Interface premium, API com fila e estrutura preparada para deploy e evolucao comercial."
  }
];

const state = {
  meta: { demoMode: true, models: [] },
  form: { ...defaults },
  jobs: [],
  activeJobId: "",
  imageFile: null,
  imagePreview: "",
  isSubmitting: false,
  error: ""
};

const app = document.querySelector("#app");
let pollingInterval = null;

function optionsHtml(options, current) {
  return options
    .map((option) => `<option value="${option.value}" ${option.value === current ? "selected" : ""}>${option.label}</option>`)
    .join("");
}

function render() {
  const activeJob = state.jobs.find((job) => job.id === state.activeJobId) || state.jobs[0];
  const modelOptions = state.meta.models.length
    ? state.meta.models
    : [
        { value: "premium", label: "Veo 3.1 Fast" },
        { value: "fast", label: "Vidu Q1" }
      ];

  app.innerHTML = `
    <div class="page-shell">
      <div class="ambient ambient-left"></div>
      <div class="ambient ambient-right"></div>

      <header class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Catwalk AI Studio</p>
          <h1>Transforme a foto de uma roupa em um video de modelo desfilando.</h1>
          <p class="hero-text">
            Produto novo, com cara de marca premium e estrutura pronta para virar ferramenta comercial para moda,
            ecommerce e conteudo social.
          </p>

          <div class="stats-row">
            <div class="stat-card"><strong>Foto -> video</strong><span>pipeline principal</span></div>
            <div class="stat-card"><strong>${state.meta.demoMode ? "Demo ligado" : "Fal pronto"}</strong><span>status do provedor</span></div>
            <div class="stat-card"><strong>9:16 ou 16:9</strong><span>formatos de campanha</span></div>
          </div>
        </div>

        <div class="hero-panel glass-card">
          <span class="chip">Moda + IA generativa</span>
          <div class="hero-preview">
            <div class="preview-gradient"></div>
            <div class="preview-runway"></div>
            <div class="preview-caption">
              <strong>Use cases</strong>
              <span>catalogo animado, criativos de ads, lancamentos e videos curtos para social.</span>
            </div>
          </div>
        </div>
      </header>

      <main class="content-grid">
        <section class="story-panel">
          <div class="section-heading">
            <p class="eyebrow">O que estamos entregando</p>
            <h2>Uma base diferente dos projetos iguais.</h2>
          </div>

          <div class="feature-grid">
            ${featureCards
              .map(
                (card) => `
                  <article class="glass-card feature-card">
                    <h3>${card.title}</h3>
                    <p>${card.text}</p>
                  </article>
                `
              )
              .join("")}
          </div>

          <div class="glass-card workflow-card">
            <div class="section-heading compact">
              <p class="eyebrow">Fluxo</p>
              <h2>Como a plataforma funciona</h2>
            </div>
            <ol>
              <li>Recebe a imagem da roupa e converte para referencia visual.</li>
              <li>Monta um prompt otimizado para passarela e fidelidade do tecido.</li>
              <li>Envia para geracao em fila e acompanha o status da renderizacao.</li>
              <li>Entrega o video final pronto para revisar, baixar ou publicar.</li>
            </ol>
          </div>
        </section>

        <section class="creator-panel glass-card">
          <div class="section-heading compact">
            <p class="eyebrow">Criador</p>
            <h2>Monte o video</h2>
          </div>

          <form id="generation-form" class="creator-form">
            <div class="upload-box">
              <input id="image-upload" type="file" accept="image/*" />
              <div>
                <strong>Envie a foto da peca</strong>
                <p>Funciona melhor com fundo limpo, luz uniforme e a roupa bem enquadrada.</p>
              </div>
              ${state.imagePreview ? `<img src="${state.imagePreview}" alt="Preview da roupa" class="upload-preview" />` : ""}
            </div>

            <div class="form-grid">
              ${textField("Marca", "brandName", state.form.brandName, "Maison Nova")}
              ${selectField("Tipo de peca", "garmentType", state.form.garmentType, [
                ["pants", "Calca"],
                ["jeans", "Jeans"],
                ["skirt", "Saia"],
                ["dress", "Vestido"],
                ["jacket", "Jaqueta"],
                ["shirt", "Camisa"],
                ["shoes", "Calcado"],
                ["fullLook", "Look completo"]
              ])}
              ${textField("Descricao da roupa", "garmentDescription", state.form.garmentDescription, "calca preta de alfaiataria, reta, premium")}
              ${textField("Publico ou canal", "targetAudience", state.form.targetAudience, "ecommerce de luxo, Instagram Reels")}
              ${selectField("Estilo de movimento", "motionStyle", state.form.motionStyle, [
                ["elegant", "Elegante"],
                ["bold", "Bold"],
                ["street", "Street film"],
                ["luxury", "Luxury runway"]
              ])}
              ${selectField("Camera", "cameraStyle", state.form.cameraStyle, [
                ["frontal", "Frontal"],
                ["orbit", "Orbital"],
                ["side", "Lateral"],
                ["editorial", "Editorial"]
              ])}
              ${selectField("Cenario", "backgroundStyle", state.form.backgroundStyle, [
                ["studio", "Studio clean"],
                ["city", "Cidade premium"],
                ["noir", "Noir fashion"],
                ["sunset", "Sunset show"]
              ])}
              ${selectField("Modelo de geracao", "modelKey", state.form.modelKey, modelOptions.map((item) => [item.value, item.label]))}
              ${selectField("Formato", "aspectRatio", state.form.aspectRatio, [["9:16", "Vertical 9:16"], ["16:9", "Horizontal 16:9"]])}
              ${selectField("Duracao", "duration", state.form.duration, [["4s", "4 segundos"], ["6s", "6 segundos"], ["8s", "8 segundos"]])}
              ${selectField("Resolucao", "resolution", state.form.resolution, [["720p", "720p"], ["1080p", "1080p"]])}
              ${selectField("Amplitude de movimento", "movementAmplitude", state.form.movementAmplitude, [["auto", "Auto"], ["small", "Suave"], ["medium", "Media"], ["large", "Grande"]])}
            </div>

            ${textAreaField("Direcao criativa", "styleNotes", state.form.styleNotes, "editorial luxuoso, passos confiantes, acabamento premium")}

            ${state.error ? `<p class="error-message">${state.error}</p>` : ""}

            <button class="primary-button" type="submit" ${state.isSubmitting ? "disabled" : ""}>
              ${state.isSubmitting ? "Enviando para a fila..." : "Gerar video de passarela"}
            </button>

            <p class="helper-text">
              ${state.meta.demoMode
                ? "Sem FAL_KEY no backend, a plataforma roda em modo demonstracao com um video oficial de exemplo da fal.ai."
                : "FAL_KEY detectada. As geracoes vao para a fila real da fal.ai."}
            </p>
          </form>
        </section>
      </main>

      <section class="results-grid">
        <div class="glass-card results-panel">
          <div class="section-heading compact">
            <p class="eyebrow">Resultado</p>
            <h2>Monitor de geracoes</h2>
          </div>

          ${state.jobs.length === 0 ? `<p class="empty-state">A primeira geracao vai aparecer aqui com status, preview da imagem e video final.</p>` : `
            <div class="job-list">
              ${state.jobs
                .map(
                  (job) => `
                    <button type="button" class="job-card ${activeJob && activeJob.id === job.id ? "active" : ""}" data-job-id="${job.id}">
                      <img src="${job.previewImage}" alt="${job.name}" />
                      <div>
                        <strong>${job.brandName || "Projeto fashion"}</strong>
                        <span>${job.status}</span>
                        <small>${job.provider}</small>
                      </div>
                    </button>
                  `
                )
                .join("")}
            </div>
          `}
        </div>

        <div class="glass-card viewer-panel">
          <div class="section-heading compact">
            <p class="eyebrow">Viewer</p>
            <h2>${activeJob ? "Video gerado" : "Aguardando projeto"}</h2>
          </div>

          ${!activeJob ? `<p class="empty-state">Suba a imagem da roupa e inicie a primeira renderizacao para abrir o viewer.</p>` : `
            <div class="status-line">
              <span class="status-pill status-${(activeJob.status || "queued").toLowerCase()}">${activeJob.status}</span>
              <span>${activeJob.providerStatus || "Fila em andamento"}</span>
            </div>

            ${activeJob.videoUrl ? `<video class="video-player" controls src="${activeJob.videoUrl}"></video>` : `
              <div class="video-placeholder">
                <p>Renderizando o fashion film.</p>
                <span>O painel consulta o status automaticamente a cada poucos segundos.</span>
              </div>
            `}

            <div class="prompt-box">
              <strong>Prompt criado automaticamente</strong>
              <p>${activeJob.prompt || "O prompt aparece aqui assim que a geracao for iniciada."}</p>
            </div>
          `}
        </div>
      </section>
    </div>
  `;

  bindEvents();
}

function textField(label, name, value, placeholder) {
  return `
    <label class="field">
      <span>${label}</span>
      <input name="${name}" value="${escapeHtml(value)}" placeholder="${placeholder}" />
    </label>
  `;
}

function textAreaField(label, name, value, placeholder) {
  return `
    <label class="field">
      <span>${label}</span>
      <textarea name="${name}" rows="4" placeholder="${placeholder}">${escapeHtml(value)}</textarea>
    </label>
  `;
}

function selectField(label, name, current, items) {
  const options = items.map(([value, text]) => ({ value, label: text }));
  return `
    <label class="field">
      <span>${label}</span>
      <select name="${name}">${optionsHtml(options, current)}</select>
    </label>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function bindEvents() {
  const form = document.querySelector("#generation-form");
  const upload = document.querySelector("#image-upload");

  document.querySelectorAll("input[name], textarea[name], select[name]").forEach((element) => {
    element.addEventListener("input", (event) => {
      state.form[event.target.name] = event.target.value;
    });
  });

  upload?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    state.imageFile = file;
    state.imagePreview = URL.createObjectURL(file);
    render();
  });

  document.querySelectorAll("[data-job-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.activeJobId = button.dataset.jobId;
      render();
      await refreshActiveJob();
    });
  });

  form?.addEventListener("submit", handleSubmit);
}

async function handleSubmit(event) {
  event.preventDefault();
  state.error = "";

  if (!state.imageFile) {
    state.error = "Envie a foto da roupa antes de gerar o video.";
    render();
    return;
  }

  state.isSubmitting = true;
  render();

  const payload = new FormData();
  payload.append("image", state.imageFile);

  Object.entries(state.form).forEach(([key, value]) => {
    payload.append(key, value);
  });

  try {
    const response = await fetch(`${API_URL}/api/generations`, {
      method: "POST",
      body: payload
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Nao foi possivel iniciar a geracao.");
    }

    state.jobs = [data, ...state.jobs.filter((job) => job.id !== data.id)];
    state.activeJobId = data.id;
    startPolling();
  } catch (error) {
    state.error = error.message;
  } finally {
    state.isSubmitting = false;
    render();
  }
}

function startPolling() {
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(refreshActiveJob, 7000);
}

async function refreshActiveJob() {
  if (!state.activeJobId) return;

  const response = await fetch(`${API_URL}/api/generations/${state.activeJobId}`);
  const job = await response.json();

  state.jobs = [job, ...state.jobs.filter((item) => item.id !== job.id)];

  if (job.status === "COMPLETED" && pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }

  render();
}

async function loadMeta() {
  try {
    const [metaResponse, jobsResponse] = await Promise.all([
      fetch(`${API_URL}/api/meta`),
      fetch(`${API_URL}/api/generations`)
    ]);

    const meta = await metaResponse.json();
    const jobs = await jobsResponse.json();

    state.meta = meta;
    state.jobs = jobs.items || [];
  } catch {
    state.meta = { demoMode: true, models: [] };
  }

  render();
}

loadMeta();
