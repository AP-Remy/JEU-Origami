
function etatInitial() {
  return {
    entropie: 0,        // entropie — la monnaie, chez Maxwell
    parClic: 1,         // entropie gagnée par pli manuel
    plieuses: Object.fromEntries(PLIEUSES.map(p => [p.id, 0])),
  };
}


const ENTROPIE_MAX = 1e104; // mort thermique = victoire


// --- Définition des plieuses ---
const PLIEUSES = [
  { id: "auto",     nom: "Plieuse automatique", coutBase: 15,     facteur: 1.15, prod: 0.1 },
  { id: "usine",    nom: "Usine",               coutBase: 100,    facteur: 1.15, prod: 1 },
  { id: "miura",    nom: "Pli de Miura",        coutBase: 1100,   facteur: 1.15, prod: 8 },
  { id: "heighway", nom: "Dragon de Heighway",  coutBase: 12000,  facteur: 1.15, prod: 42 },
  { id: "lorenz",   nom: "Attracteur de Lorenz",coutBase: 130000, facteur: 1.15, prod: 256 },
];

// --- Définition des upgrades ---

const UPGRADE = [
  { id: "souple",     nom: "papier souple", coutBase: 15, effet: { cible: "clic", type: "mult", valeur: 2 } },
];




