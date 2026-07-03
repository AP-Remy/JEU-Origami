


const ENTROPIE_MAX = 1e104; // mort thermique = victoire


// --- Définition des plieuses ---

//{ id,nom, coutBase,facteur, prod}

const PLIEUSES = [
  { id: "mains",       nom: "Mains nues",                  coutBase: 15,                      facteur: 1.15, prod: 1,           icone: "icone_mains" },
  { id: "auto",        nom: "Plieuse automatique",         coutBase: 100,                     facteur: 1.15, prod: 10,             icone: "icone_auto" },
  { id: "miura",       nom: "Pli de Miura",                coutBase: 1100,                    facteur: 1.15, prod: 80,             icone: "icone_miura" },
  { id: "usine",       nom: "Usine de pliage",             coutBase: 12000,                   facteur: 1.15, prod: 500,            icone: "icone_usine" },
  { id: "heighway",    nom: "Dragon de Heighway",          coutBase: 130000,                  facteur: 1.15, prod: 2600,           icone: "icone_heighway" },
  { id: "labo",        nom: "Centre de recherche",         coutBase: 1400000,                 facteur: 1.15, prod: 14000,          icone: "icone_labo" },
  { id: "koch",        nom: "Flocon de Koch",              coutBase: 20000000,                facteur: 1.15, prod: 78000,          icone: "icone_koch" },
  { id: "boulanger",   nom: "Transformation du boulanger", coutBase: 330000000,               facteur: 1.15, prod: 440000,         icone: "icone_boulanger" },
  { id: "brownien",    nom: "Moteur brownien",             coutBase: 5100000000,              facteur: 1.15, prod: 2600000,        icone: "icone_brownien" },
  { id: "joule",       nom: "Détente de Joule",            coutBase: 75000000000,             facteur: 1.15, prod: 16000000,       icone: "icone_joule" },
  { id: "lorenz",      nom: "Attracteur de Lorenz",        coutBase: 1000000000000,           facteur: 1.15, prod: 100000000,      icone: "icone_lorenz" },
  { id: "landauer",    nom: "Effaceur de Landauer",        coutBase: 14000000000000,          facteur: 1.15, prod: 650000000,      icone: "icone_landauer" },
  { id: "turing",      nom: "Machine de Turing",           coutBase: 170000000000000,         facteur: 1.15, prod: 4300000000,     icone: "icone_turing" },
  { id: "schrodinger", nom: "Chat de Schrödinger",         coutBase: 2100000000000000,        facteur: 1.15, prod: 29000000000,    icone: "icone_schrodinger" },
  { id: "boltzmann",   nom: "Cerveau de Boltzmann",        coutBase: 26000000000000000,       facteur: 1.15, prod: 210000000000,   icone: "icone_boltzmann" },
  { id: "hawking",     nom: "Rayonnement de Hawking",      coutBase: 310000000000000000,      facteur: 1.15, prod: 1500000000000,  icone: "icone_hawking" },
  { id: "trounoir",    nom: "Trou noir",                   coutBase: 3900000000000000000,     facteur: 1.15, prod: 11000000000000, icone: "icone_trounoir" },
  { id: "wormhole",    nom: "Pont d'Einstein-Rosen",       coutBase: 48000000000000000000,    facteur: 1.15, prod: 83000000000000, icone: "icone_wormhole" },
  { id: "hulivers",    nom: "Effondrement du vide",        coutBase: 610000000000000000000,   facteur: 1.15, prod: 630000000000000, icone: "icone_hulivers" },
  { id: "mortthermique", nom: "Mort thermique",            coutBase: 1000000000000000000000000,  facteur: 1.15, prod: 5000000000000000, icone: "icone_mortthermique" },
];

// --- Définition des upgrades ---

// { id,nom, cout, desc,effet:{ cible, type, valeur} }

const UPGRADES = [
  { id: "souple",      nom: "Papier souple",        cout: 15,        desc: "Double l'entropie de chaque clic",
    effet: { cible: "clic", type: "mult", valeur: 2 } },
  { id: "devinette",   nom: "Le compte est bon",    cout: 250,       desc: "Débloque le mini-jeu : devine le nombre manquant de la suite",
    effet: { cible: "puzzle", type: "unlock", valeur: 1 } },
  { id: "graisse",     nom: "Graissage des machines", cout: 300,     desc: "Double la cadence des plieuses automatiques",
    effet: { cible: "auto", type: "mult", valeur: 2 } },
  { id: "pianiste",    nom: "Doigts de pianiste",   cout: 500,       desc: "Double encore l'entropie de chaque clic",
    effet: { cible: "clic", type: "mult", valeur: 2 } },
  { id: "negentropie", nom: "Néguentropie",         cout: 100000,    desc: "Ordonne le chaos : -5 par clic",
    effet: { cible: "clic", type: "add", valeur: -5 } },
  { id: "souffle",     nom: "Souffle du dragon",    cout: 320000,    desc: "Double la production du Dragon de Heighway",
    effet: { cible: "heighway", type: "mult", valeur: 2 } },
  { id: "millegrues",  nom: "Un voeux de mille grues", cout: 50000,   desc: "x1000 sur l'entropie de chaque clic",
    effet: { cible: "clic", type: "mult", valeur: 1000 } },
  { id: "maekawa",     nom: "Théorème de Maekawa",  cout: 200000,   desc: "Un pli net vaut deux brouillons : double le clic",
    effet: { cible: "clic", type: "mult", valeur: 2 } },
  { id: "fleche",      nom: "Flèche du temps",      cout: 10000000,  desc: "Le temps ne recule pas : double toute la production",
    effet: { cible: "production", type: "mult", valeur: 2 } },
  { id: "secondprincipe", nom: "Second principe", cout: 20000000000000,  desc: "La loi qui gouverne tout : double le clic et la production",
    effet: { cible: "global", type: "mult", valeur: 2 } },
  { id: "papillon",    nom: "Effet papillon",       cout: 3000000000000,   desc: "Un battement d'aile déchaîne la tempête : double Lorenz",
    effet: { cible: "lorenz", type: "mult", valeur: 2 } },
  { id: "arret",       nom: "Problème de l'arrêt",  cout: 250000000000000, desc: "Elle ne s'arrête jamais : double la Machine de Turing",
    effet: { cible: "turing", type: "mult", valeur: 2 } },
  { id: "holographie", nom: "Principe holographique", cout: 3000000000, desc: "Toute l'information sur la surface : double toute la production",
    effet: { cible: "production", type: "mult", valeur: 2 } },
  { id: "horizon",     nom: "Horizon des évènements", cout: 8000000000000000000, desc: "Double la production du Trou noir",
    effet: { cible: "trounoir", type: "mult", valeur: 2 } },
  { id: "bigbang",     nom: "Big Bang",             cout: 120000000000000000000, desc: "Le grand commencement : triple le clic et la production",
    effet: { cible: "global", type: "mult", valeur: 3 } },
  { id: "ignorance",   nom: "Ignorance du démon",   cout: 8000000000000000000000, desc: "Moins Laplace comprend : triple toute la production",
    effet: { cible: "production", type: "mult", valeur: 3 } },
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
      <span class="prix">${formaterNombre(def.cout)}</span>`;

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


// --- Formatage des nombres ---

const PALIERS_NOMBRE = [
  { seuil: 1e9, symbole: "T" },
  { seuil: 1e6, symbole: "M" },
  { seuil: 1e3, symbole: "k" },
];

function formaterNombre(n) {
  const signe = n < 0 ? "-" : "";
  n = Math.abs(n);

  if (n >= 1e12) {
    return signe + n.toExponential(2).replace("e+", "e");
  }
  const palier = PALIERS_NOMBRE.find(p => n >= p.seuil);
  if (palier) {
    return signe + (n / palier.seuil).toFixed(2).replace(/\.?0+$/, "") + palier.symbole;
  }
  return signe + (Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/\.?0+$/, ""));
}

function formaterEntropie(n) {
  return Math.floor(Math.max(n, 0)).toLocaleString("fr-FR");
}


const RANGS_VISIBLES_AVANCE = 1;   // nb de plieuses non achetées montrées après la dernière achetée

const elPanneauPuzzle = document.getElementById("panneau-puzzle");
const elValiderPuzzle = document.getElementById("valider");

function afficher() {
  elEntropie.textContent = formaterEntropie(etat.entropie);

  elPanneauPuzzle.hidden = !etat.upgrades.includes("devinette");
  if (!elPanneauPuzzle.hidden) {
    elValiderPuzzle.textContent = "-" + formaterNombre(coutTentativePuzzle(etat));
  }

  let dernierRangPossede = -1;
  PLIEUSES.forEach((def, rang) => {
    if (etat.plieuses[def.id] > 0) dernierRangPossede = rang;
  });

  PLIEUSES.forEach((def, rang) => {
    const carte = elBoutique.querySelector(`[data-id="${def.id}"]`);
    const quantite = etat.plieuses[def.id];
    const prix = def.coutBase * def.facteur ** quantite;

    carte.querySelector(".prix").textContent = formaterNombre(Math.ceil(prix));
    carte.querySelector(".prod").textContent = formaterNombre(def.prod);
    carte.querySelector(".quantite").textContent = "×" + formaterNombre(quantite);

    carte.classList.toggle("indisponible", etat.entropie < prix);
    carte.style.display = rang > dernierRangPossede + RANGS_VISIBLES_AVANCE ? "none" : "";
  });

  let dernierRangUpgradePossede = -1;
  UPGRADES.forEach((def, rang) => {
    if (etat.upgrades.includes(def.id)) dernierRangUpgradePossede = rang;
  });

  UPGRADES.forEach((def, rang) => {
    const carte = elUpgrades.querySelector(`[data-id="${def.id}"]`);
    if (etat.upgrades.includes(def.id)) {
      carte.style.display = "none";     // possédé -> on cache la carte
    } else if (rang > dernierRangUpgradePossede + 2) {
      carte.style.display = "none";     // trop loin -> pas encore révélé
    } else {
      carte.style.display = "";         // à portée -> on la montre
      carte.classList.toggle("indisponible", etat.entropie < def.cout);
    }
  });
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

