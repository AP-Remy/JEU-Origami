// dans script.js — le pont entre simon et le moteur

const SIMON_LONGUEURS    = [4, 5, 6];  // longueur de chaque manche successive
const SIMON_COTES        = ["haut", "droite", "bas", "gauche"];
const SIMON_COOLDOWN_MS  = 30000;
const SIMON_BUFF_MS      = 10000;
const SIMON_DELAI_FLASH  = 500;
const SIMON_DELAI_PAUSE  = 250;
const SIMON_DELAI_MANCHE = 2000;   // pause entre deux manches réussies

const elSimonCarte    = document.getElementById("simon");
const elSimonLancer   = document.getElementById("simon-lancer");
const elSimonResultat = document.getElementById("simon-resultat");
const elsSimonCotes   = document.querySelectorAll(".simon-cote");

let simonSequence     = [];    // la suite de côtés à reproduire pour la manche en cours
let simonIndexAttendu = 0;     // prochain index attendu dans la saisie du joueur
let simonManche       = 0;     // index de la manche en cours (0,1,2 -> longueurs 5,6,7)
let simonSaisieActive = false; // true pendant que le joueur peut cliquer
let simonEnCooldown   = false;

function simonAttendre(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function simonEclairerCote(cote, duree) {
  const el = document.querySelector(`.simon-cote[data-cote="${cote}"]`);
  el.classList.add("actif");
  setTimeout(() => el.classList.remove("actif"), duree);
}

function simonGenererSequence(longueur) {
  const sequence = [];
  for (let i = 0; i < longueur; i = i + 1) {
    sequence.push(SIMON_COTES[Math.floor(Math.random() * SIMON_COTES.length)]);
  }
  return sequence;
}

async function simonRejouerSequence() {
  simonSaisieActive = false;
  await simonAttendre(SIMON_DELAI_PAUSE);

  for (const cote of simonSequence) {
    simonEclairerCote(cote, SIMON_DELAI_FLASH);
    await simonAttendre(SIMON_DELAI_FLASH + SIMON_DELAI_PAUSE);
  }

  simonIndexAttendu = 0;
  simonSaisieActive = true;
}

async function simonDemarrerManche() {
  simonSequence = simonGenererSequence(SIMON_LONGUEURS[simonManche]);
  await simonRejouerSequence();
}

async function simonLancerManche() {
  if (simonEnCooldown || elSimonLancer.disabled) return;

  simonManche = 0;
  elSimonResultat.textContent = "";
  elSimonLancer.disabled = true;

  await simonDemarrerManche();
}

async function simonClicCote(cote) {
  if (!simonSaisieActive) return;

  simonEclairerCote(cote, 200);

  if (cote !== simonSequence[simonIndexAttendu]) {
    simonSaisieActive = false;
    simonTerminerJeu(false);
    return;
  }

  simonIndexAttendu = simonIndexAttendu + 1;

  if (simonIndexAttendu === simonSequence.length) {
    simonSaisieActive = false;

    if (simonManche === SIMON_LONGUEURS.length - 1) {
      simonTerminerJeu(true);
    } else {
      simonManche = simonManche + 1;
      await simonAttendre(SIMON_DELAI_MANCHE);
      simonDemarrerManche();
    }
  }
}

function simonTerminerJeu(victoire) {
  if (victoire) {
    etat.buffProductionJusqua = Date.now() + SIMON_BUFF_MS;
    elSimonResultat.textContent = "Trois manches réussies ! Production doublée pendant 10s.";
  } else {
    elSimonResultat.textContent = "";
  }

  afficher();
  simonDemarrerCooldown();
}

function simonDemarrerCooldown() {
  simonEnCooldown = true;
  elSimonCarte.classList.add("en-cooldown");

  setTimeout(function () {
    simonEnCooldown = false;
    elSimonCarte.classList.remove("en-cooldown");
    elSimonLancer.disabled = false;
  }, SIMON_COOLDOWN_MS);
}

elsSimonCotes.forEach(function (el) {
  el.addEventListener("click", function () {
    simonClicCote(el.dataset.cote);
  });
});

elSimonLancer.addEventListener("click", simonLancerManche);
