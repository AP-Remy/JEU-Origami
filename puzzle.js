// dans script.js — le pont entre puzzle et moteur
function coutTentativePuzzle(etat) {
  return productionTotale(etat) * 15;
}

function recompenserPuzzle(score) {
  const secondes = 20;
  const bonus = productionTotale(etat) * secondes * (score / 100);
  etat.entropie = etat.entropie + bonus;
  afficher();
  return bonus;
}

let puzzleCourant = null;   // on retient la suite affichée pour la noter ensuite



function genererSuite() {
  const taille = 5;
  const max = 20 + Math.floor(Math.random() * 180);
  const suite = [];

  for (let i = 0; i < taille; i = i + 1) {
    const n = 1 + Math.floor(Math.random() * max);
    suite.push(n);
  }

  const trou = Math.floor(Math.random() * taille);

  return { suite, trou };
}





function afficherPuzzle() {
  puzzleCourant = genererSuite();

  const elSuite = document.getElementById("suite");
  let texte = "";

  for (let i = 0; i < puzzleCourant.suite.length; i = i + 1) {
    if (i === puzzleCourant.trou) {
      texte = texte + " ? ";
    } else {
      texte = texte + " " + puzzleCourant.suite[i] + " ";
    }
  }

  elSuite.textContent = texte;
}





function validerPuzzle() {
  const elReponse  = document.getElementById("reponse");
  const elResultat = document.getElementById("resultat");
  const elValider  = document.getElementById("valider");

  const valeur = elReponse.value.trim();
  if (valeur === "") {
    return;
  }

  const candidat = Number(valeur);

  if (String(Math.abs(candidat)).length > 2) {
    elResultat.textContent = "Le nombre ne peut pas dépasser 2 chiffres.";
    return;
  }

  const coutTentative = coutTentativePuzzle(etat);
  if (etat.entropie < coutTentative) {
    elResultat.textContent = "Pas assez d'entropie pour tenter.";
    return;
  }
  etat.entropie = etat.entropie - coutTentative;

  const suiteSansTrou = [];
  for (let i = 0; i < puzzleCourant.suite.length; i = i + 1) {
    if (i !== puzzleCourant.trou) {
      suiteSansTrou.push(puzzleCourant.suite[i]);
    }
  }

  const voisinGauche = puzzleCourant.suite[puzzleCourant.trou - 1];
  const voisinDroit  = puzzleCourant.suite[puzzleCourant.trou + 1];

  const score = evaluer(candidat, suiteSansTrou, voisinGauche, voisinDroit);
  const gain  = recompenserPuzzle(score);

  elResultat.textContent = score + "% -> + " + formaterNombre(gain) + "  Entropie";
  elReponse.value = "";

  // on laisse le temps au joueur de voir son score avant d'enchaîner
  elValider.disabled = true;
  setTimeout(function () {
    elValider.disabled = false;
    afficherPuzzle();
  }, 1500);
}




function evaluer(candidat, suite, voisinGauche, voisinDroit) {
  let score = 100;

  for (const n of suite) {
    // chiffre en commun : on compare les deux nombres transformés en texte
    const chiffresCandidat = String(candidat);
    const chiffresN = String(n);
    for (const c of chiffresCandidat) {
      if (chiffresN.includes(c)) {
        score = score - 10;    // chaque chiffre partagé enleve 5
      }
    }

    // diviseur commun (autre que 1) : on cherche le PGCD par l'algorithme d'Euclide
    let a = candidat;
    let b = n;
    while (b !== 0) {
      const reste = a % b;
      a = b;
      b = reste;
    }
    if (a > 1) {
      score = score - 7;
    }
  }

  // encadré : le candidat tombe-t-il entre ses deux voisins immédiats ?
  if (voisinGauche !== undefined && voisinDroit !== undefined) {
    const mini = Math.min(voisinGauche, voisinDroit);
    const maxi = Math.max(voisinGauche, voisinDroit);
    if (candidat > mini && candidat < maxi) {
      score = score - 20;
    }
  }

  // premier : aucun diviseur entre 2 et la racine de candidat, malus dans tous les cas
  let estPremier = candidat >= 2;
  for (let i = 2; i * i <= candidat; i = i + 1) {
    if (candidat % i === 0) {
      estPremier = false;
      break;
    }
  }
  if (estPremier) {
    score = score - 11;
  }

  // à un seul chiffre : trop facile à deviner au pif
  if (candidat >= 0 && candidat <= 9) {
    score = score - 20;
  }

  return Math.max(1, score);
}





document.getElementById("valider").addEventListener("click", validerPuzzle);
afficherPuzzle();

