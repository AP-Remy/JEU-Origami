


const ENTROPIE_MAX = 1e104; // mort thermique = victoire


// --- Définition des plieuses ---

//{ id,nom, coutBase,facteur, prod}

const PLIEUSES = [
  { id: "mains",       nom: "Main",                  coutBase: 15,                      facteur: 1.15, prod: 1,           icone: "icone_mains" },
  { id: "auto",        nom: "Plieuse automatique",         coutBase: 100,                     facteur: 1.15, prod: 10,             icone: "icone_auto" },
  { id: "miura",       nom: "Pli de Miura",                coutBase: 1100,                    facteur: 1.15, prod: 80,             icone: "icone_miura" },
  { id: "usine",       nom: "Usine de pliage",             coutBase: 12000,                   facteur: 1.15, prod: 1000,            icone: "icone_usine" },
  { id: "heighway",    nom: "Dragon de Heighway",          coutBase: 130000,                  facteur: 1.15, prod: 2600,           icone: "icone_heighway" },
  { id: "labo",        nom: "Centre de recherche",         coutBase: 1400000,                 facteur: 1.15, prod: 14000,          icone: "icone_labo" },
  { id: "koch",        nom: "Flocon de Koch",              coutBase: 20000000,                facteur: 1.15, prod: 78000,          icone: "icone_koch" },
  { id: "boulanger",   nom: "Transformation du boulanger", coutBase: 330000000,               facteur: 1.15, prod: 1100000,         icone: "icone_boulanger" },
  { id: "brownien",    nom: "Moteur brownien",             coutBase: 5000000000,              facteur: 1.15, prod: 15000000,        icone: "icone_brownien" },
  { id: "joule",       nom: "Détente de Joule",            coutBase: 50000000000,             facteur: 1.15, prod: 200000000,       icone: "icone_joule" },
  { id: "lorenz",      nom: "Attracteur de Lorenz",        coutBase: 300000000000,           facteur: 1.15, prod: 1000000000,      icone: "icone_lorenz" },
  { id: "landauer",    nom: "Effaceur de Landauer",        coutBase: 1400000000000,          facteur: 1.15, prod: 4000000000,      icone: "icone_landauer" },
  { id: "turing",      nom: "Machine de Turing",           coutBase: 17000000000000,         facteur: 1.15, prod: 50000000000,     icone: "icone_turing" },
  { id: "schrodinger", nom: "Chat de Schrödinger",         coutBase: 210000000000000,        facteur: 1.15, prod: 700000000000,    icone: "icone_schrodinger" },
  { id: "boltzmann",   nom: "Cerveau de Boltzmann",        coutBase: 2600000000000000,       facteur: 1.15, prod: 7500000000000,   icone: "icone_boltzmann" },
  { id: "hawking",     nom: "Rayonnement de Hawking",      coutBase: 30000000000000000,      facteur: 1.15, prod: 100000000000000,  icone: "icone_hawking" },
  { id: "trounoir",    nom: "Trou noir",                   coutBase: 420000000000000000,     facteur: 1.15, prod: 1200000000000000, icone: "icone_trounoir" },
  { id: "wormhole",    nom: "Pont d'Einstein-Rosen",       coutBase: 4800000000000000000,    facteur: 1.15, prod: 12000000000000000, icone: "icone_wormhole" },
  { id: "hulivers",    nom: "Effondrement du vide",        coutBase: 61000000000000000000,   facteur: 1.15, prod: 100000000000000000, icone: "icone_hulivers" },
  { id: "mortthermique", nom: "Mort thermique",            coutBase: 1e104,  facteur: 1.15, prod: 100000000000000000000000, icone: "icone_mortthermique" },
];

// --- Définition des upgrades ---

// { id,nom, cout, desc,effet:{ cible, type, valeur} }

const UPGRADES = [
  { id: "souple",      nom: "Papier souple",        cout: 15,        desc: "Double l'entropie de chaque clic et la production des Mains nues",
    effet: { cible: "clic+mains", type: "mult", valeur: 2 } },
  { id: "graisse",     nom: "Graissage des machines", cout: 300,     desc: "+ 100% de cadence des plieuses automatiques",
    effet: { cible: "auto", type: "mult", valeur: 2 } },
  { id: "pianiste",    nom: "Doigts de pianiste",   cout: 500,       desc: "Double encore l'entropie de chaque clic",
    effet: { cible: "clic", type: "mult", valeur: 2 } },
  { id: "negentropie", nom: "Néguentropie",         cout: 100000,    desc: "Ordonne le chaos : Réduit la force du clic",
    effet: { cible: "clic", type: "mult", valeur: 0.9} },
  { id: "devinette",   nom: "Engendrer le chaos",    cout: 100000,       desc: "On parie ?",
    effet: { cible: "puzzle", type: "unlock", valeur: 1 } },
  { id: "petitschinois", nom: "Les petits chinois",  cout: 25000,    desc: " + 50% de cadence dans les usines ",
    effet: { cible: "usine", type: "mult", valeur: 1.5 } },
  { id: "souffle",     nom: "Souffle du dragon",    cout: 320000,    desc: "Double la production du Dragon de Heighway",
    effet: { cible: "heighway", type: "mult", valeur: 2 } },
  { id: "millegrues",  nom: "Un voeux de mille grues", cout: 100000,   desc: "x1000 sur l'entropie de chaque clic",
    effet: { cible: "clic", type: "mult", valeur: 1000 } },
  { id: "maekawa",     nom: "Théorème de Maekawa",  cout: 200000,   desc: "Un pli net vaut deux brouillons : double le clic",
    effet: { cible: "clic", type: "mult", valeur: 2 } },
  { id: "fleche",      nom: "Flèche du temps",      cout: 10000000,  desc: "Le temps ne recule pas : double toute la production",
    effet: { cible: "production", type: "mult", valeur: 2 } },
  { id: "nothing",      nom: "Rien n'est gratuit",      cout: 0,  desc: "Ne fait rien, ou presque",
    effet: { cible: "production", type: "mult", valeur: 1 } },
  { id: "cafe", nom: "café", cout: 5000000,  desc: "Du café pour les chercheurs, + 70% de découvertes",
    effet: { cible: "labo", type: "mult", valeur: 1.7 } },
  { id: "neige", nom: "Il neige !", cout: 150000000,  desc: "Des flocons partout",
    effet: { cible: "koch", type: "mult", valeur: 3 } },
  { id: "calculateur", nom: "Super Calculateur", cout: 300000000,  desc: "Entropie x3 pour le boulanger",
    effet: { cible: "boulanger", type: "mult", valeur: 3 } },
  { id: "4dimension", nom: "Dimension 4", cout: 5000000000,  desc: "Le clic change de niveau",
    effet: { cible: "clic", type: "add", valeur: 1000 } },
  { id: "secondprincipe", nom: "Second principe", cout: 100000000000,  desc: "La loi qui gouverne tout : doule le clic et la production",
    effet: { cible: "global", type: "mult", valeur: 2 } },
  { id: "papillon",    nom: "Effet papillon",       cout: 3000000000000,   desc: "Un battement d'aile déchaîne la tempête : triple Lorenz",
    effet: { cible: "lorenz", type: "mult", valeur: 2 } },
  { id: "bruitthermique",       nom: "Bruit thermique",  cout: 50000000000000, desc: "Les moteurs Browniens sont en surrégime",
    effet: { cible: "brownien", type: "add", valeur: 4000000000 } },
  { id: "arret",       nom: "Problème de l'arrêt",  cout: 250000000000000, desc: "Elle ne s'arrête jamais : + 30% sur la Machine de Turing",
    effet: { cible: "turing", type: "mult", valeur: 2 } },
  { id: "univers", nom: "Quelque part dans l'univers", cout: 6000000000000000, desc: "Le cerveau de Boltzmann existe ailleurs, + 40% d'entropie",
    effet: { cible: "boltzmann", type: "mult", valeur: 1.4 } },
  { id: "holographie", nom: "Principe holographique", cout: 100000000000000000, desc: "Toute l'information de la surface : x4 sur toute la production",
    effet: { cible: "production", type: "mult", valeur: 2 } },
  { id: "horizon",     nom: "Horizon des évènements", cout: 8000000000000000000, desc: "Double la production du Trou noir",
    effet: { cible: "trounoir", type: "mult", valeur: 2 } },
  { id: "bigbang",     nom: "Big Bang",             cout: 120000000000000000000, desc: "Le grand commencement : triple le clic et la production",
    effet: { cible: "global", type: "mult", valeur: 3 } },
  { id: "ignorance",   nom: "Ignorance du démon",   cout: 800000000000000000000, desc: "Moins Laplace comprend : x1000 sur toute la production",
    effet: { cible: "production", type: "mult", valeur: 1000 } },
];








function cibleInclut(cible, ...noms) {              // une cible peut viser plusieurs id, ex: "clic+mains"
  const cibles = cible.split("+");
  return noms.some(nom => cibles.includes(nom));
}

function up_add(def) {                              // upgrades additives
  let somme = 0;
  for (const idUpgrade of etat.upgrades) {
    const up = UPGRADES.find(u => u.id === idUpgrade);
    const effet = up.effet;
    if (!cibleInclut(effet.cible, def.id, "production", "global")) continue;
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
    if (!cibleInclut(effet.cible, def.id, "production", "global")) continue;
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
  if (Date.now() < etat.buffProductionJusqua) {
    total = total * 2;
  }
  return total;
}


function production_par_clic(etat) {
  let add = 0;
  let mult = 1;
  for (const idUpgrade of etat.upgrades) {
    const up = UPGRADES.find(u => u.id === idUpgrade);
    const effet = up.effet;
    if (!cibleInclut(effet.cible, "clic", "global")) continue;
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
    boutiqueDebloquee: etat.boutiqueDebloquee,
    ameliorationsDebloquees: etat.ameliorationsDebloquees,
    tauxDebloque: etat.tauxDebloque,
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
  etat.boutiqueDebloquee = sauvegarde.boutiqueDebloquee ?? false;
  etat.ameliorationsDebloquees = sauvegarde.ameliorationsDebloquees ?? false;
  etat.tauxDebloque = sauvegarde.tauxDebloque ?? false;
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















const SEUIL_BOUTIQUE      = 15;    // entropie à atteindre pour révéler les plieuses
const SEUIL_AMELIORATIONS = 50;    // entropie à atteindre pour révéler les améliorations
const SEUIL_TAUX          = 1000;  // entropie à atteindre pour révéler l'entropie/seconde

function etatInitial() {
  return {
    entropie: 0,        // entropie — la monnaie, chez Maxwell
    parClic: 1,         // entropie gagnée par pli manuel
    plieuses: Object.fromEntries(PLIEUSES.map(p => [p.id, 0])),   // les plieuses possédées {id, quantité}
    upgrades: [],        // les upgrades possédées
    boutiqueDebloquee: false,       // reste vrai une fois atteint, même si on dépense sous le seuil
    ameliorationsDebloquees: false,
    tauxDebloque: false,
    buffProductionJusqua: 0,        // horodatage de fin du buff x2 (Simon) ; 0 = pas de buff actif
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

// --- Suivi de la révélation des plieuses, pour auto-scroll vers les nouvelles cartes ---
let dernierRangRevele = -1;     // rang le plus avancé révélé lors du rendu précédent
let premierAffichage = true;    // true tant que afficher() n'a pas encore tourné une 1re fois

const elJeu               = document.querySelector(".jeu");
const elPanneauPuzzle     = document.getElementById("panneau-puzzle");
const elSectionPuzzle     = document.getElementById("section-puzzle");
const elPanneauPlieuses   = document.getElementById("panneau-plieuses");
const elSectionAmeliorations = document.getElementById("section-ameliorations");
const elValiderPuzzle     = document.getElementById("valider");
const elEntropieTaux      = document.getElementById("entropie-taux");
const elAirePliageNote    = document.getElementById("aire-pliage-note");
const elPuissanceClic     = document.getElementById("puissance-clic");
const elSectionSimon      = document.getElementById("section-simon");

function afficher() {
  elEntropie.textContent = formaterEntropie(etat.entropie);

  if (etat.entropie >= SEUIL_BOUTIQUE) etat.boutiqueDebloquee = true;
  if (etat.entropie >= SEUIL_AMELIORATIONS) etat.ameliorationsDebloquees = true;
  if (etat.entropie >= SEUIL_TAUX) etat.tauxDebloque = true;

  elEntropieTaux.hidden = !etat.tauxDebloque;
  if (!elEntropieTaux.hidden) {
    elEntropieTaux.textContent = "+" + formaterNombre(productionTotale(etat)) + "/s";
  }

  elPuissanceClic.hidden = !etat.tauxDebloque;
  if (!elPuissanceClic.hidden) {
    elPuissanceClic.textContent = "Puissance du clic : +" + formaterNombre(production_par_clic(etat));
  }

  elAirePliageNote.hidden = etat.boutiqueDebloquee;

  elPanneauPlieuses.hidden = !etat.boutiqueDebloquee;
  elSectionAmeliorations.hidden = !etat.ameliorationsDebloquees;

  const puzzleDebloque = etat.upgrades.includes("devinette");
  const simonDebloque = etat.plieuses.boltzmann > 0;
  elSectionPuzzle.hidden = !puzzleDebloque;
  elSectionSimon.hidden = !simonDebloque;
  elPanneauPuzzle.hidden = !(puzzleDebloque || simonDebloque);

  elJeu.classList.toggle("sans-puzzle", elPanneauPuzzle.hidden);
  elJeu.classList.toggle("sans-panneau", elPanneauPlieuses.hidden);

  if (puzzleDebloque) {
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

  const rangReveleActuel = Math.min(dernierRangPossede + RANGS_VISIBLES_AVANCE, PLIEUSES.length - 1);
  if (!premierAffichage && rangReveleActuel > dernierRangRevele) {
    const carteRevelee = elBoutique.querySelector(`[data-id="${PLIEUSES[rangReveleActuel].id}"]`);
    carteRevelee?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }
  dernierRangRevele = rangReveleActuel;
  premierAffichage = false;

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

