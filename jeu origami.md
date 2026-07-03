Appelons ce jeu **Carnot's Draft**, un incré;enteur avec une esthétique low poly, des origamis sur un fond noir. le but est d'augmenter l'entropie pour fracturer les plans du démon de Laplace.

## La boucle de gameplay

 La forme au centre est appelé le pliage, il faut la plier, régulierement le joueur se voit proposer une amélioration, augmentant la génération passive d'entropie


## Le style 

le pliage est bicolore et a une forme d'origami, se complexifiant en fil du temps


## Le scénario

Le joueur va utiliser le pliage pour augmenter l'entropie du monde, vaiquant le démon de Laplace.
En début de partie le fond est entierement blanc, le second principe thermodynamique écrit au centre, le joueur clique alors sur de delta, lancent la partie avec le pliage dans la forme du delta.


## L'entropie — le score

Un seul chiffre à suivre, affiché en haut : l'entropie, qui ne fait que monter. Elle grimpe à chaque pli manuel et en continu grâce aux plieuses passives. C'est elle qu'on dépense pour améliorer, et c'est elle qui dicte la fin du jeu quand elle atteint 10^104



## Les améliorations — les plieuses

Les améliorations sont des origamis qui plient tout seuls de plus en plus puissants. Chacune se paie en entropie et en produit passivement. Elles ponctuent aussi la montée en gamme débloquer une plieuse plus puissante, c'est franchir un palier. Elle seront achetable contre de l'entropie auprès du démon de Maxwell.

Plieuses automatiques, 
Plie de Miura, 
Usine,
Centre de recherche,
Dragon de Heighway,
Théorie du chaos, 
Attracteurs de Lorenz, 
Le Chat de Schrödinger,
Le Cerveau de Boltzmann,
White hole,




## La sauvegarde

Deux mécanismes complémentaires, sans serveur, cohérents avec l'approche local-first. Un autosave transparent via `localStorage` (sérialisation JS toutes les quelques secondes, relecture au chargement). Et un code exportable façon Kittens Game : état sérialisé, encodé en base64, affiché comme chaîne que le joueur copie, garde et recolle pour restaurer — pratique pour changer de machine. On prévoit un champ de version dans l'état pour pouvoir migrer ou rejeter proprement les vieux codes quand la structure changera. À noter : `localStorage` marche sur le site déployé mais est bloqué dans l'aperçu d'un artifact Claude, donc prévoir un fallback en mémoire pour prototyper.