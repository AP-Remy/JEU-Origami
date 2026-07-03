


const ENTROPIE_MAX = 1e104; // mort thermique = victoire


// --- Définition des plieuses ---

//{ id,nom, coutBase,facteur, prod}

const PLIEUSES = [
  { id: "auto",        nom: "Plieuse automatique",   coutBase: 15,          facteur: 1.15, prod: 1,    icone: "icone_auto" },
  { id: "miura",       nom: "Pli de Miura",          coutBase: 100,         facteur: 1.15, prod: 10,      icone: "icone_miura" },
  { id: "usine",       nom: "Usine",                 coutBase: 1100,        facteur: 1.15, prod: 70,      icone: "icone_usine" },
  { id: "recherche",   nom: "Centre de recherche",   coutBase: 12000,       facteur: 1.15, prod: 600,     icone: "icone_recherche" },
  { id: "heighway",    nom: "Dragon de Heighway",    coutBase: 130000,      facteur: 1.15, prod: 5000,    icone: "icone_heighway" },
  { id: "chaos",       nom: "Théorie du chaos",      coutBase: 1400000,     facteur: 1.15, prod: 10400,   icone: "icone_chaos" },
  { id: "lorenz",      nom: "Attracteur de Lorenz",  coutBase: 20000000,    facteur: 1.15, prod: 700000,   icone: "icone_lorenz" },
  { id: "schrodinger", nom: "Le Chat de Schrödinger",coutBase: 330000000,   facteur: 1.15, prod: 4400000,  icone: "icone_schrodinger" },
  { id: "boltzmann",   nom: "Le Cerveau de Boltzmann",coutBase: 5100000000, facteur: 1.15, prod: 26000000, icone: "icone_boltzmann" },
  { id: "whitehole",   nom: "White hole",            coutBase: 75000000000,facteur: 1.15, prod: 1600000000,icone: "icone_whitehole" },
];

// --- Définition des upgrades ---

// { id,nom, cout, desc,effet:{ cible, type, valeur} }

const UPGRADES = [
  { id: "souple",   nom: "Papier souple", cout: 15, desc: "Double l'entropie de chaque clic" ,effet: { cible: "clic", type: "mult", valeur: 2 } },
  { id: "graisse", nom: "Graissage des machine", cout: 50, desc: "Double la cadence de tous les producteurs",
  effet: { cible: "auto", type: "mult", valeur: 2 } },
];








function up_add(def) {                              // upgrades additives
  let somme = 0;
  for (const idUpgrade of etat.upgrades) {
    const up = UPGRADES.find(u => u.id === idUpgrade);
    const effet = up.effet;
    if (effet.cible !== def.id) continue;
    if (effet.type !== "add") continue;
    somme = somme + effet.valeur;
  }
  return somme;
}

function up_mult(def) {                               // upgrades multiplicatives
  let produit = 1;
  for (const idUpgrade of etat.upgrades) {
    const up = UPGRADES.find(u => u.id === idUpgrade);
    const effet = up.effet;
    if (effet.cible !== def.id) continue;
    if (effet.type !== "mult") continue;
    produit = produit * effet.valeur;
  }
  return produit;
}


function productionTotale(etat) {
  let total = 0;
  for (const def of PLIEUSES) {
      const quantite = etat.plieuses[def.id];    
      const production = def.prod;
      const upgrade_mult = up_mult(def); //  1 = pas de changement
      const upgrade_add = up_add(def); // 0 = pas de changement
      total = total + quantite * (production + upgrade_add) * upgrade_mult;
  }
  return total;
}


function production_par_clic(etat) {
  let add = 0;
  let mult = 1;
  for (const idUpgrade of etat.upgrades) {
    const up = UPGRADES.find(u => u.id === idUpgrade);
    const effet = up.effet;
    if (effet.cible !== "clic") continue;
    if (effet.type === "add")  add  = add  + effet.valeur;
    if (effet.type === "mult") mult = mult * effet.valeur;
  }
  return (1 + add) * mult;
}


function plier(etat) {
  const gain = production_par_clic(etat);
  etat.entropie = etat.entropie + gain;
  afficher();
}










function acheterPlieuse(etat, id) {
  const def = PLIEUSES.find(p => p.id === id);
  const quantite = etat.plieuses[id];
  const prix = def.coutBase * def.facteur ** quantite;

  if (etat.entropie < prix) {
    return false;
  }

  etat.entropie = etat.entropie - prix;
  etat.plieuses[id] = etat.plieuses[id] + 1;
  return true;
}

function acheterUpgrade(etat, id) {
  const def = UPGRADES.find(u => u.id === id);

  if (etat.upgrades.includes(id)) {
    return false;
  }
  if (etat.entropie < def.cout) {
    return false;
  }

  etat.entropie = etat.entropie - def.cout;
  etat.upgrades.push(id);
  return true;
}




// --- Sauvegarde ---

const VERSION_SAUVEGARDE = 1;
const CLE_SAUVEGARDE = "carnotsDraft_save";
let sauvegardeMemoire = null;   // secours si localStorage est indisponible (ex: aperçu d'artifact)

function etatVersSauvegarde(etat) {
  return {
    version: VERSION_SAUVEGARDE,
    entropie: etat.entropie,
    plieuses: etat.plieuses,
    upgrades: etat.upgrades,
  };
}

function appliquerSauvegarde(etat, sauvegarde) {
  if (!sauvegarde || sauvegarde.version !== VERSION_SAUVEGARDE) {
    return false;
  }

  etat.entropie = sauvegarde.entropie ?? 0;
  for (const def of PLIEUSES) {
    etat.plieuses[def.id] = sauvegarde.plieuses?.[def.id] ?? 0;
  }
  etat.upgrades = (sauvegarde.upgrades ?? []).filter(id => UPGRADES.some(u => u.id === id));
  return true;
}

function sauvegarder() {
  const donnees = JSON.stringify(etatVersSauvegarde(etat));
  try {
    localStorage.setItem(CLE_SAUVEGARDE, donnees);
  } catch {
    sauvegardeMemoire = donnees;
  }
}

function charger() {
  let donnees;
  try {
    donnees = localStorage.getItem(CLE_SAUVEGARDE);
  } catch {
    donnees = sauvegardeMemoire;
  }
  if (!donnees) return;

  try {
    appliquerSauvegarde(etat, JSON.parse(donnees));
  } catch {
    // sauvegarde corrompue -> on l'ignore
  }
}

function exporterCode() {
  return btoa(JSON.stringify(etatVersSauvegarde(etat)));
}

function importerCode(code) {
  try {
    return appliquerSauvegarde(etat, JSON.parse(atob(code.trim())));
  } catch {
    return false;
  }
}

function reinitialiser() {
  etat = etatInitial();
  sauvegardeMemoire = null;
  try {
    localStorage.removeItem(CLE_SAUVEGARDE);
  } catch {
    // rien à faire
  }
}










const elBoutique = document.getElementById("boutique");

function construireBoutique() {
  elBoutique.innerHTML = "";

  for (const def of PLIEUSES) {
    const carte = document.createElement("button");
    carte.className = "plieuse";
    carte.dataset.id = def.id;

    carte.innerHTML = `
      <svg class="icone" viewBox="0 0 40 40"><use href="#${def.icone}"/></svg>
      <div class="infos">
        <span class="nom">${def.nom}</span>
        <span class="desc">${def.desc ?? ""}</span>
      </div>
      <div class="chiffres">
        <span class="prix"></span>
        <span class="quantite"></span>
        <span class="prod"></span>
      </div>`;

    carte.addEventListener("click", function () {
      acheterPlieuse(etat, def.id);
      afficher();
    });

    elBoutique.appendChild(carte);
  }
}





const elUpgrades = document.getElementById("upgrades");

function construireUpgrades() {
  elUpgrades.innerHTML = "";

  for (const def of UPGRADES) {
    const carte = document.createElement("button");
    carte.className = "upgrade";
    carte.dataset.id = def.id;

    carte.innerHTML = `
      <div class="infos">
        <span class="nom">${def.nom}</span>
        <span class="desc">${def.desc ?? ""}</span>
      </div>
      <span class="prix">${def.cout}</span>`;

    carte.addEventListener("click", function () {
      acheterUpgrade(etat, def.id);
      afficher();
    });

    elUpgrades.appendChild(carte);
  }
}















function etatInitial() {
  return {
    entropie: 0,        // entropie — la monnaie, chez Maxwell
    parClic: 1,         // entropie gagnée par pli manuel
    plieuses: Object.fromEntries(PLIEUSES.map(p => [p.id, 0])),   // les plieuses possédées {id, quantité}
    upgrades: []        // les upgrades possédées
  };
}
let etat = etatInitial()
charger();


let dernierTick = Date.now();   // horodatage du dernier passage, en millisecondes
function tick() {
  const maintenant = Date.now();
  const dt = (maintenant - dernierTick) / 1000;   // secondes écoulées depuis le dernier tick
  dernierTick = maintenant;
  etat.entropie = etat.entropie + productionTotale(etat) * dt;
  afficher();
}
setInterval(tick, 100);   // on appelle tick 10 fois par seconde


const elEntropie = document.getElementById("entropie");
const elPliage   = document.getElementById("pliage");


function afficher() {
  elEntropie.textContent = Math.floor(etat.entropie);

  for (const def of PLIEUSES) {
    const carte = elBoutique.querySelector(`[data-id="${def.id}"]`);
    const quantite = etat.plieuses[def.id];
    const prix = def.coutBase * def.facteur ** quantite;

    carte.querySelector(".prix").textContent = Math.ceil(prix);
    carte.querySelector(".prod").textContent = def.prod;
    carte.querySelector(".quantite").textContent = "×" + quantite;
  }
  for (const def of UPGRADES) {
    const carte = elUpgrades.querySelector(`[data-id="${def.id}"]`);
    if (etat.upgrades.includes(def.id)) {
      carte.style.display = "none";     // possédé -> on cache la carte
    } else {
      carte.style.display = "";         // pas encore -> on la montre
    }
  }
}


elPliage.addEventListener("click", function () {
  plier(etat);
  afficher();
});
construireBoutique();
construireUpgrades();
afficher();

setInterval(sauvegarder, 10000);   // autosave toutes les 10 secondes
window.addEventListener("beforeunload", sauvegarder);


// --- Menu des réglages ---

const elReglagesBouton  = document.getElementById("reglages-bouton");
const elReglagesPanneau = document.getElementById("reglages-panneau");
const elReglagesFermer  = document.getElementById("reglages-fermer");
const elCodeExport      = document.getElementById("code-export");
const elCodeImport      = document.getElementById("code-import");
const elImportMessage   = document.getElementById("import-message");

function ouvrirReglages() {
  elCodeExport.value = exporterCode();
  elImportMessage.textContent = "";
  elReglagesPanneau.hidden = false;
}

function fermerReglages() {
  elReglagesPanneau.hidden = true;
}

elReglagesBouton.addEventListener("click", ouvrirReglages);
elReglagesFermer.addEventListener("click", fermerReglages);
elReglagesPanneau.addEventListener("click", function (evenement) {
  if (evenement.target === elReglagesPanneau) fermerReglages();
});

document.getElementById("bouton-exporter").addEventListener("click", function () {
  elCodeExport.value = exporterCode();
});

document.getElementById("bouton-copier").addEventListener("click", function () {
  navigator.clipboard.writeText(elCodeExport.value);
});

document.getElementById("bouton-importer").addEventListener("click", function () {
  const succes = importerCode(elCodeImport.value);
  elImportMessage.textContent = succes ? "Partie restaurée." : "Code invalide.";
  if (succes) {
    afficher();
    sauvegarder();
  }
});

document.getElementById("bouton-reinitialiser").addEventListener("click", function () {
  if (confirm("Réinitialiser la partie ? Cette action est irréversible.")) {
    reinitialiser();
    afficher();
    fermerReglages();
  }
});

