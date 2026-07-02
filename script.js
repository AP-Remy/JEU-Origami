"use strict";

/* ============================================================
   Plier l'univers — prototype d'interface
   Le clic plie ; le pli produit de l'entropie ; l'entropie
   aveugle le démon (jauge de certitude) et fait défiler les
   paliers du fond. Économie volontairement minimale : elle
   sert de squelette pour brancher le vrai système plus tard.
   ============================================================ */

const SAVE_KEY = "plier-univers-save";
const SAVE_VERSION = 1;
const WIN_THRESHOLD = 1000; // entropie totale nécessaire pour dissoudre le démon (valeur de prototype)
const CLICK_GAIN = 1;
const TICK_MS = 200;
const MAX_CREASES = 30;

const TIERS = [
  { id: "carnot", name: "Feuille de Carnot", threshold: 0 },
  { id: "papier", name: "Papier", threshold: 0.15 },
  { id: "matiere", name: "Matière", threshold: 0.35 },
  { id: "vide", name: "Vide", threshold: 0.6 },
  { id: "espace-temps", name: "Espace-temps", threshold: 0.85 },
];

const PRODUCERS = [
  { id: "grue", name: "Grue", icon: "🕊️", baseCost: 10, rate: 0.1, unlockTier: 0 },
  { id: "grenouille", name: "Grenouille", icon: "🐸", baseCost: 150, rate: 1, unlockTier: 1 },
  { id: "dragon", name: "Dragon", icon: "🐉", baseCost: 2000, rate: 8, unlockTier: 2 },
];

function defaultState() {
  const owned = {};
  PRODUCERS.forEach((p) => (owned[p.id] = 0));
  return {
    v: SAVE_VERSION,
    entropy: 0,
    totalEntropy: 0,
    folds: 0,
    owned,
    won: false,
  };
}

/* ---------- Stockage : localStorage avec repli mémoire ---------- */
const memoryStore = {};
const storage = (() => {
  try {
    const testKey = "__plier_univers_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return {
      get: (k) => window.localStorage.getItem(k),
      set: (k, v) => window.localStorage.setItem(k, v),
      remove: (k) => window.localStorage.removeItem(k),
      persistent: true,
    };
  } catch (e) {
    return {
      get: (k) => (k in memoryStore ? memoryStore[k] : null),
      set: (k, v) => (memoryStore[k] = v),
      remove: (k) => delete memoryStore[k],
      persistent: false,
    };
  }
})();

let state = loadState();

function loadState() {
  const raw = storage.get(SAVE_KEY);
  if (!raw) return defaultState();
  try {
    return mergeWithDefaults(JSON.parse(raw));
  } catch (e) {
    return defaultState();
  }
}

function mergeWithDefaults(parsed) {
  if (!parsed || parsed.v !== SAVE_VERSION) return defaultState();
  const base = defaultState();
  return {
    ...base,
    ...parsed,
    owned: { ...base.owned, ...(parsed.owned || {}) },
  };
}

function saveState() {
  storage.set(SAVE_KEY, JSON.stringify(state));
  updateSaveStatus();
}

/* ---------- Références DOM ---------- */
const el = {
  body: document.body,
  entropyValue: document.getElementById("entropy-value"),
  entropyFill: document.getElementById("entropy-fill"),
  certaintyValue: document.getElementById("certainty-value"),
  certaintyFill: document.getElementById("certainty-fill"),
  origami: document.getElementById("origami"),
  creases: document.getElementById("creases"),
  foldCount: document.getElementById("fold-count"),
  shopList: document.getElementById("shop-list"),
  tiers: document.getElementById("tiers"),
  gearBtn: document.getElementById("gear-btn"),
  modalOverlay: document.getElementById("modal-overlay"),
  closeModalBtn: document.getElementById("close-modal-btn"),
  saveStatus: document.getElementById("save-status"),
  saveCode: document.getElementById("save-code"),
  copyCodeBtn: document.getElementById("copy-code-btn"),
  importCode: document.getElementById("import-code"),
  importBtn: document.getElementById("import-btn"),
  resetBtn: document.getElementById("reset-btn"),
  winOverlay: document.getElementById("win-overlay"),
};

/* ---------- Calculs dérivés ---------- */
function progressRatio() {
  return Math.min(state.totalEntropy / WIN_THRESHOLD, 1);
}

function certainty() {
  return Math.max(0, 100 - progressRatio() * 100);
}

function currentTierIndex() {
  const ratio = progressRatio();
  let idx = 0;
  TIERS.forEach((t, i) => {
    if (ratio >= t.threshold) idx = i;
  });
  return idx;
}

function producerCost(id) {
  const p = PRODUCERS.find((x) => x.id === id);
  const owned = state.owned[id] || 0;
  return Math.ceil(p.baseCost * Math.pow(1.15, owned));
}

function formatNumber(n) {
  if (n < 1000) return (Math.round(n * 10) / 10).toString();
  const units = ["K", "M", "B", "T"];
  let value = n;
  let unitIndex = -1;
  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }
  return `${value.toFixed(1)}${units[unitIndex]}`;
}

/* ---------- Rendu ---------- */
function renderHUD() {
  const ratio = progressRatio();
  const idx = currentTierIndex();
  const cur = TIERS[idx].threshold;
  const next = idx < TIERS.length - 1 ? TIERS[idx + 1].threshold : 1;
  const tierProgress = next > cur ? (ratio - cur) / (next - cur) : 1;

  el.entropyValue.textContent = formatNumber(state.totalEntropy);
  el.entropyFill.style.width = `${Math.min(100, Math.max(0, tierProgress * 100))}%`;

  const c = certainty();
  el.certaintyValue.textContent = `${Math.round(c)}%`;
  el.certaintyFill.style.width = `${c}%`;

  el.foldCount.textContent = `${state.folds} pli${state.folds === 1 ? "" : "s"}`;
}

function renderTiers() {
  const idx = currentTierIndex();
  el.tiers.innerHTML = "";
  TIERS.forEach((t, i) => {
    const seg = document.createElement("div");
    seg.className = "tier-seg";
    if (i < idx) seg.classList.add("done");
    if (i === idx) seg.classList.add("active");
    seg.textContent = t.name;
    el.tiers.appendChild(seg);
  });
  el.body.dataset.tier = String(idx);
}

function renderShop() {
  const idx = currentTierIndex();
  el.shopList.innerHTML = "";
  PRODUCERS.forEach((p) => {
    if (idx < p.unlockTier) return;
    const cost = producerCost(p.id);
    const owned = state.owned[p.id] || 0;
    const affordable = state.entropy >= cost;

    const btn = document.createElement("button");
    btn.className = "shop-item";
    btn.disabled = !affordable;
    btn.innerHTML = `
      <span class="shop-icon">${p.icon}</span>
      <span>
        <span class="shop-name"><span>${p.name}</span><span class="shop-owned">${owned}</span></span>
        <span class="shop-meta"><span>${formatNumber(cost)} entropie</span><span>+${p.rate}/s</span></span>
      </span>
    `;
    btn.addEventListener("click", () => buyProducer(p.id));
    el.shopList.appendChild(btn);
  });
}

function renderAll() {
  renderHUD();
  renderTiers();
  renderShop();
}

/* ---------- Actions ---------- */
function addCrease() {
  const line = document.createElement("span");
  line.className = "crease";
  const angle = Math.round(Math.random() * 140 - 70);
  line.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  el.creases.appendChild(line);
  while (el.creases.children.length > MAX_CREASES) {
    el.creases.removeChild(el.creases.firstChild);
  }
}

function fold() {
  state.entropy += CLICK_GAIN;
  state.totalEntropy += CLICK_GAIN;
  state.folds += 1;

  el.origami.classList.toggle("folding");
  el.origami.classList.remove("pulse");
  void el.origami.offsetWidth; // relance l'animation
  el.origami.classList.add("pulse");
  addCrease();

  renderAll();
  checkWin();
}

function buyProducer(id) {
  const cost = producerCost(id);
  if (state.entropy < cost) return;
  state.entropy -= cost;
  state.owned[id] = (state.owned[id] || 0) + 1;
  renderAll();
}

function tickProduction() {
  const dt = TICK_MS / 1000;
  let gain = 0;
  PRODUCERS.forEach((p) => {
    gain += (state.owned[p.id] || 0) * p.rate * dt;
  });
  if (gain > 0) {
    state.entropy += gain;
    state.totalEntropy += gain;
    renderAll();
    checkWin();
  }
}

function checkWin() {
  if (!state.won && certainty() <= 0) {
    state.won = true;
    el.winOverlay.hidden = false;
  }
}

/* ---------- Sauvegarde / export / import ---------- */
function updateSaveStatus() {
  const mode = storage.persistent ? "sauvegarde locale active" : "mode mémoire (pas de localStorage ici)";
  const now = new Date().toLocaleTimeString("fr-FR");
  el.saveStatus.textContent = `Dernière sauvegarde : ${now} — ${mode}`;
}

function encodeState() {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

function decodeState(code) {
  return JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
}

function openModal() {
  el.saveCode.value = encodeState();
  el.modalOverlay.hidden = false;
  updateSaveStatus();
}

function closeModal() {
  el.modalOverlay.hidden = true;
  el.importCode.value = "";
}

/* ---------- Écouteurs ---------- */
el.origami.addEventListener("click", fold);

el.gearBtn.addEventListener("click", openModal);
el.closeModalBtn.addEventListener("click", closeModal);
el.modalOverlay.addEventListener("click", (e) => {
  if (e.target === el.modalOverlay) closeModal();
});

el.copyCodeBtn.addEventListener("click", async () => {
  el.saveCode.value = encodeState();
  el.saveCode.select();
  try {
    await navigator.clipboard.writeText(el.saveCode.value);
    el.saveStatus.textContent = "Code copié dans le presse-papiers.";
  } catch (e) {
    document.execCommand("copy");
    el.saveStatus.textContent = "Code copié (méthode de repli).";
  }
});

el.importBtn.addEventListener("click", () => {
  const code = el.importCode.value;
  if (!code.trim()) return;
  try {
    const parsed = decodeState(code);
    state = mergeWithDefaults(parsed);
    saveState();
    renderAll();
    closeModal();
  } catch (e) {
    el.saveStatus.textContent = "Code invalide ou illisible.";
  }
});

el.resetBtn.addEventListener("click", () => {
  if (!confirm("Réinitialiser toute la partie ? Cette action est irréversible.")) return;
  state = defaultState();
  storage.remove(SAVE_KEY);
  el.winOverlay.hidden = true;
  renderAll();
  closeModal();
});

el.winOverlay.addEventListener("click", () => {
  el.winOverlay.hidden = true;
});

/* ---------- Boucle & init ---------- */
setInterval(tickProduction, TICK_MS);
setInterval(saveState, 5000);

if (state.won) el.winOverlay.hidden = false;
renderAll();
updateSaveStatus();
