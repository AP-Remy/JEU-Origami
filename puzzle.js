// dans script.js — le pont entre puzzle et moteur
function recompenserPuzzle(score) {
  const secondes = 20;
  const bonus = productionTotale(etat) * secondes * (score / 100);
  etat.entropie = etat.entropie + bonus;
  afficher();
}