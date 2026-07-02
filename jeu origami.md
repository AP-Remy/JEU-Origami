


---

# Plier l'univers — direction du jeu

Note de cadrage d'un jeu de navigateur incrémental (_idle / clicker_), pauvre en technique et riche en systèmes, dans la lignée d'_Universal Paperclips_. Elle fixe ce sur quoi on s'est mis d'accord et signale ce qui reste ouvert. À relire avant de coder.

## Le pitch en une phrase

On plie pour créer de l'ordre local ; chaque pli déverse de l'entropie dans l'univers ; cette entropie est le score, et c'est elle qui aveugle le démon de Laplace jusqu'à le dissoudre.

## Le fond (pourquoi ce n'est pas qu'un compteur)

Le cœur intellectuel repose sur une tension réelle, pas sur un thème plaqué. Plier, c'est ordonner : un pli inscrit de l'information, il crée de l'ordre local. Or ordonner localement coûte de l'entropie ailleurs — c'est le principe de Landauer : écrire ou effacer de l'information dissipe de la chaleur. Le pli est donc le moteur, et l'entropie est son gaz d'échappement. Le moteur et le score tirent en sens apparemment opposés, et c'est exactement cette contradiction qui fait le jeu.

Le raccord avec Laplace tient à la nature de son démon. Le démon idéal est omniscient par hypothèse : celui-là, on ne le bat pas, et il faut l'assumer. Mais un démon _incarné_ — qui doit réellement calculer, donc stocker et effacer de l'information, donc payer Landauer — a une mémoire finie. Comme l'entropie mesure le nombre de micro-états à distinguer (S = k ln W), la faire monter, c'est gonfler la description de l'univers au-delà de ce que ce démon peut tenir. On ne le trompe pas, on le noie. C'est la faille exacte par laquelle la physique moderne a enterré le démon de Laplace, et le jeu la rejoue.

Conséquence contre-intuitive mais qui tient jusqu'au bout : la mort thermique (entropie maximale) n'est pas un piège, c'est la victoire totale. Un univers uniforme au nombre de micro-états maximal porte l'information la plus lourde à décrire — donc la défaite la plus complète du démon.

## Le but, clair et visible

Le démon a une jauge de certitude affichée en permanence. Elle descend à mesure que l'entropie monte. Gagner, c'est la mettre à zéro : le démon devient aveugle, ne peut plus prédire, se dissout. Fin nette qui découle du thème au lieu d'être collée dessus. Le jeu a donc bien un début idiot, une escalade, et une conclusion — c'est ce qui le rend _complet_ et pas seulement long.

## La montée en gamme

On ne plie pas « une feuille » ou « un timbre » : on plie de l'information, ce qui rend le support secondaire et donne une progression naturelle du plieur de la carte au plieur du territoire. L'ordre retenu : d'abord l'énoncé du second principe par Carnot (les _mots_ de la loi), puis le papier, la matière, le vide, et enfin l'espace-temps lui-même — le support sur lequel la loi est écrite. Chaque palier exige un ordre de grandeur de force en plus et débloque un origami plus puissant.

## La décision de gameplay qui prime : simplicité + identité

Le geste noyau est le clic, un seul, comme dans un cliqueur classique. On a écarté l'idée d'un démon qui prédit et _annule_ le pli : un pli annulé par le hasard est une punition pour une faute que le joueur ne comprend pas, donc un mauvais retour. Le démon reviendra autrement, comme jauge à faire descendre, jamais comme videur qui reprend les jetons.

L'identité ne vient donc pas d'une mécanique compliquée mais du _rendu du geste_. Contrairement à Cookie Clicker, où le clic n'a pas de corps, ici un clic égale un pli, et un pli se voit : la forme à l'écran se replie réellement sur elle-même, une arête apparaît, la face change de teinte. Le geste laisse une trace permanente. On ne regarde pas un compteur monter à côté d'une image inerte — on transforme une forme sous sa main, pli après pli. Le même clic que les cliqueurs, mais qui _inscrit_ au lieu d'incrémenter.

La production passive (des origamis — grue, grenouille, dragon — qui plient tout seuls) viendra prendre le relais quand le poignet fatigue. Ordre de construction sain : le geste d'abord, l'économie ensuite.

## L'esthétique

Fond sombre, objets en origami colorés qui flottent dedans. Le noir n'est pas décoratif : il isole l'objet plié dans le vide pour que le regard s'y pose et que le pli soit l'événement. Le fond se re-teinte à chaque palier franchi (bureau, pièce, ciel, orbite, étoiles), matérialisant l'altitude gagnée. Techniquement trivial : polygones pleins en Canvas 2D ou `clip-path: polygon()` en CSS, deux teintes par face pour marquer l'arête du pli. Zéro moteur, zéro asset, déployable sur GitHub Pages.

## La disposition à l'écran

L'objet qu'on plie possède le centre ; tout le reste est de la périphérie. Le HUD est en haut, avec l'entropie à gauche (elle monte, c'est la production) et la certitude du démon à droite (elle descend, c'est le but) — deux barres opposées, toujours visibles, jamais cliquables. Le centre ne contient que l'origami, et le clic est _sur_ l'objet, pas sur un bouton à côté. La boutique des plieuses passives se range dans une colonne à droite, par convention du genre et parce qu'on l'utilise par salves, pas en continu. En bas, une barre de paliers (feuille de Carnot → papier → matière → vide → espace-temps) sert de repère de progression. Un engrenage dans un coin planque le rare et l'administratif (sauvegarde, options).

La règle qui garde l'écran simple : le geste fait mille fois est au centre et gratuit à atteindre ; ce qu'on fait de temps en temps est en périphérie ; ce qu'on fait une fois est caché.

## La sauvegarde

Deux mécanismes complémentaires, sans serveur, cohérents avec l'approche local-first. Un autosave transparent via `localStorage` (sérialisation JSON toutes les quelques secondes, relecture au chargement). Et un code exportable façon Kittens Game : état sérialisé, encodé en base64, affiché comme chaîne que le joueur copie, garde et recolle pour restaurer — pratique pour changer de machine. On prévoit un champ de version dans l'état pour pouvoir migrer ou rejeter proprement les vieux codes quand la structure changera. À noter : `localStorage` marche sur le site déployé mais est bloqué dans l'aperçu d'un artifact Claude, donc prévoir un fallback en mémoire pour prototyper.

