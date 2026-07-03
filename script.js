


const ENTROPIE_MAX = 1e104; // mort thermique = victoire


// --- Définition des plieuses ---

//{ id,nom, coutBase,facteur, prod}

const PLIEUSES = [
  { id: "auto",     nom: "Plieuse automatique", coutBase: 15,     facteur: 1.15, prod: 0.1 , icone: "icone_auto"},
  { id: "usine",    nom: "Usine",               coutBase: 100,    facteur: 1.15, prod: 1 , icone: "icone_usine"},
  { id: "miura",    nom: "Pli de Miura",        coutBase: 1100,   facteur: 1.15, prod: 8 , icone: "icone_miura"},
  { id: "heighway", nom: "Dragon de Heighway",  coutBase: 12000,  facteur: 1.15, prod: 42 , icone: "icone_heighway"},
  { id: "lorenz",   nom: "Attracteur de Lorenz",coutBase: 130000, facteur: 1.15, prod: 256, icone: "icone_lorenz" },
];

// --- Définition des upgrades ---

// { id,nom, cout, desc,effet:{ cible, type, valeur} }

const UPGRADES = [
  { id: "souple",   nom: "Papier souple", cout: 15, desc: "Double l'entropie de chaque clic" ,effet: { cible: "clic", type: "mult", valeur: 2 } },
  { id: "graisse", nom: "Graissage des machine", cout: 50, desc: "Double la cadence des machines",
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



















function etatInitial() {
  return {
    entropie: 0,        // entropie — la monnaie, chez Maxwell
    parClic: 1,         // entropie gagnée par pli manuel
    plieuses: Object.fromEntries(PLIEUSES.map(p => [p.id, 0])),   // les plieuses possédées {id, quantité}
    upgrades: []        // les upgrades possédées
  };
}
let etat = etatInitial()



let dernierTick = Date.now();   // horodatage du dernier passage, en millisecondes
function tick() {
  const maintenant = Date.now();
  const dt = (maintenant - dernierTick) / 1000;   // secondes écoulées depuis le dernier tick
  dernierTick = maintenant;

  etat.entropie = etat.entropie + productionTotale(etat) * dt;
}
setInterval(tick, 100);   // on appelle tick 10 fois par seconde