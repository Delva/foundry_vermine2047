# Journal des modifications

## [0.9.0] — Onglet Profil, Totems à l'en-tête & Créature simplifiée

### Ajouté
- **Instincts / Interdits de Totem** affichés dans l'en-tête de la fiche Personnage,
  dans un bloc flottant dédié à côté du bouton Lancer un dé ; se met à jour
  automatiquement au changement de Totem.
- **Nouvel onglet « Profil »** (entre Objets et Biographie) regroupant Capacités,
  Adaptations, Traumatismes, Historiques, Afflictions, Rites chamaniques et Profils.
- **Type d'objet Spécialité** : texte libre lié à une Compétence, avec description
  auto-générée (« Bonus de 1D aux lancers impliquant *Compétence* »).
- **Champ Fiabilité** (0–10) sur les Équipements.
- **Onglet Biographie** : blocs **Objectifs majeurs / mineurs** et **Instincts /
  Interdits personnels**, placés en tête d'onglet ; sélecteur de Domaine de
  prédilection retiré (redondant avec le clic sur le titre de domaine dans l'onglet
  Feuille).
- **Onglet Objets** : mise en forme alignée sur l'onglet Feuille (blocs et titres
  dépliables/repliables au clic) ; l'ajout d'un objet ouvre désormais sa fiche
  automatiquement au lieu de le créer silencieusement.
- **Fiche Créature/PNJ** :
  - Champs **Réaction** et **Attaque** (texte libre, comme les valeurs d'Action fixes).
  - Champ numérique **Réserve** (libre, sans mécanique associée).
  - Champ **Relances** : nombre de dés relançables d'un coup depuis la carte de chat
    (usage unique par jet), même mécanique que les Relances de niveau de Compétence.
  - **Bouton Lancer un dé** avec dialogue simplifié (nombre de dés fixe contre une
    Difficulté), sans Caractéristique ni Réserves de jeu.

### Retiré
- **Caractéristiques** retirées de la fiche Créature/PNJ (modèle de données, fiche,
  jets) : les Créatures/PNJ n'en utilisent pas, elles reposent sur les valeurs
  d'Action fixes et le nouveau Jet simplifié.

### Modifié
- **Relance (Compétence)** de la carte de chat : corrigée pour relancer d'un coup
  jusqu'à N dés ratés (N = valeur de Relances offerte), au lieu d'autoriser N clics
  relançant chacun 1 seul dé — usage unique par jet, comme la Relance d'Effort.
  Bouton renommé **« Relance »** (au lieu de « Relance (Compétence) »), la mécanique
  étant désormais partagée avec le champ Relances des Créatures.

---

## [0.8.0] — Compendium des Capacités de Totems

### Ajouté
- **Compendium « Capacités de Totems »** (80 entrées, 10 par Totem) : Capacités
  individuelles de Prédateur, Charognard, Symbiote, Parasite, Bâtisseur, Horde, Ruche
  et Solitaire, sous forme d'objets de type Capacité (`type: totem`), curées et
  reformulées à partir du guide officiel (jamais copiées mot pour mot).
- **Outillage de build des compendiums** (`tools/pack-data.mjs`, `tools/build-packs.mjs`,
  `package.json`) recréé — absent du dépôt jusqu'ici bien que documenté dans le README.
  Compile les packs LevelDB décrits dans `pack-data.mjs` via `npm run build:packs`.

---

## [0.7.5] — Correctif : plafond des Réserves qui se mélangeait avec la valeur

### Corrigé
- **Réserves (Sang-Froid / Effort)** : le plafond (max) était encore recalculé à chaque
  édition et pouvait se **mélanger avec les points possédés** (le max prenait la valeur
  courante) — le correctif 0.7.4 persistait cette valeur mélangée. Le plafond est
  désormais une valeur **purement stockée** : plus aucune dérivation ni mélange avec la
  valeur au fil des éditions. Les personnages d'avant le découplage sont initialisés une
  seule fois (migration au chargement, côté MJ) depuis l'ancien plafond dérivé (lu depuis
  la source, jamais mélangé à la valeur), puis le max reste stable et indépendant.
  Note : un personnage déjà touché par le bug peut recliquer « (Re)calculer depuis les
  Caractéristiques » (ou saisir le max) dans les Options — la valeur tient désormais.

## [0.7.4] — Correctif : plafond des Réserves qui retombait à 0

### Corrigé
- **Réserves (Sang-Froid / Effort)** : le plafond (max) découplé n'était pas persisté et
  se re-dérivait des Caractéristiques à chaque édition, « retombant » à sa valeur dérivée
  (0 quand les Caractéristiques concernées étaient basses). Ajout d'une persistance du max
  au chargement (côté MJ) et d'un garde-fou empêchant un champ max vide dans les Options
  d'écraser la valeur. (Correctif incomplet — voir 0.7.5.)

## [0.7.3] — Points de Mutation & Réserves indépendantes

### Ajouté
- **Points de Mutation** : champ numérique dans l'en-tête de la fiche (après l'XP)
  pour stocker les dés de Mutation gagnés.

### Modifié
- **Réserves (Sang-Froid / Effort)** : désormais décorrélées des Caractéristiques
  après la création. Le maximum est une valeur stockée, éditable dans la page
  d'Options, avec un bouton « (Re)calculer depuis les Caractéristiques » pour
  l'initialiser à la création ; il se monte ensuite librement (XP), sans être
  modifié par les hausses de Caractéristiques (Mutation).

## [0.7.2] — Sang-Froid : sélection par boutons

### Modifié
- **Sang-Froid** (dialogue de Jet) : la dépense se choisit maintenant par des boutons
  d'action (`0`, `1D`, `2D`, …) au lieu d'un champ numérique. Le maximum affiché est le
  plus petit de la Réserve de Sang-Froid et de la Caractéristique sélectionnée, et les
  boutons se recalculent dynamiquement quand la Caractéristique change.

## [0.7.1] — Relance d'Effort : sélection par boutons

### Modifié
- **Relance d'Effort** : le choix du nombre de dés à relancer se fait désormais par
  des boutons d'action (`1D`, `2D`, …) plutôt qu'un champ numérique. Seules les
  possibilités valides sont proposées, bornées par le plus petit de la Réserve
  d'Effort, de la Caractéristique utilisée et du nombre de dés ratés.

## [0.7.0] — Nouvelle identité visuelle et corrections de jets

### Modifié
- **Thème « Nature Reclaimed »** : nouvelle palette de couleurs (sauge pâle / terre
  cuite sur fond dead-earth) appliquée à l'ensemble du système via les variables CSS
  partagées.
- **Bannières d'en-tête** sur les fiches Personnage, Groupe et Créature/PNJ : image de
  fond, portrait agrandi sans bordure, nom en grand, champs lisibles sur la photo.
  Personnage et Créature utilisent une illustration de forêt engloutie ; Groupe une
  illustration de ruines urbaines bioluminescentes (assets locaux dans `styles/img/`,
  plus de dépendance à une URL externe).
- **Fiche Personnage** : barre latérale supprimée, les onglets (Feuille/Objets/
  Biographie) sont désormais dans l'en-tête ; bouton **Lancer un dé** ajouté à côté de
  la recherche de compétences ; légende des Niveaux déplacée en bas de l'onglet
  Feuille ; format d'ouverture par défaut passé en paysage (1000×650).
- **Domaine de prédilection** : sélection directe en cliquant sur le titre d'un
  domaine de compétences (mise en évidence visuelle), en plus du menu déroulant de
  l'onglet Biographie — les deux pilotent le même champ, sans impact sur le jeu.
- **Ordre des groupes de compétences** harmonisé : Homme, Machine, Arme, Animal,
  Survie, Terre (partout où les domaines sont listés).
- **Champs Description / Biographie / Notes** : remplacement des éditeurs de texte
  riche (TinyMCE, instables dans ce contexte) par de simples champs multilignes,
  plus légers et fiables.

### Corrigé
- **Relance d'Effort** : usage unique par jet, avec choix du nombre de dés à relancer
  (plafonné par la Réserve disponible, le nombre de dés ratés, et la valeur de la
  Caractéristique utilisée — même règle que le Sang-Froid dépensé en amont dans la
  Main).
- **Sang-Froid à dépenser** (dialogue de Jet) : le plafond affiché tenait compte
  uniquement de la Réserve, pas de la Caractéristique sélectionnée ; il se recalcule
  maintenant dynamiquement à chaque changement du formulaire.
- **Résolution de l'acteur lors d'une Relance** : passe désormais par le speaker du
  message de chat plutôt que par l'acteur du monde, pour refléter correctement les
  jetons aux données non liées.
- Divers ajustements d'affichage : zone de contenu des fiches d'Objet qui laissait un
  vide, unité « D » retirée des Caractéristiques de la fiche Créature.

---

## [0.6.4] — Champ XP

### Ajouté
- **Champ XP** (numérique) sur la fiche Personnage, dans l'en-tête, à la place du
  Mode de jeu.

### Retiré
- **Mode de jeu** masqué de la fiche Personnage (peu utile en jeu). Le champ reste
  dans le modèle de données (non affiché) pour ne pas perdre les valeurs déjà
  enregistrées sur les personnages existants.

---

## [0.6.3] — Correctif des niveaux de compétence

### Corrigé
- **Table des niveaux de compétence** (`VERMINE.niveauxCompetence`) alignée sur la
  fiche officielle des Niveaux : Bonus et Relances augmentent en alternance à chaque
  niveau. Expert passe de 2 Relances à **1**, Légende passe de 2D/3 Relances à
  **3D/2 Relances**. Corrige à la fois l'affichage des pastilles (type Bonus/Relance
  par niveau) sur la fiche Personnage et le nombre réel de dés/relances accordés
  lors d'un Jet Vermine pour ces niveaux.
- **Légende des Niveaux** (bandeau en haut de l'onglet Compétences) et **pastilles
  de chaque compétence** : les pastilles acquises affichent désormais tous les dés
  de **Bonus** d'un niveau puis toutes ses **Relances** (valeurs cumulées), au lieu
  d'alterner Bonus/Relance pastille par pastille — conforme à la fiche officielle.
  Les pastilles non encore acquises sont désormais neutres (rond vide, sans indice
  Bonus/Relance) — une même position pouvant être Bonus à un niveau et Relance à un
  autre, un aperçu par position aurait été trompeur.

---

## [0.6.2] — Détails d'objets dépliés par défaut

### Modifié
- Les détails d'un objet (description, stats, usure) sont désormais **affichés par
  défaut** sous la fiche ; un clic sur le nom permet toujours de replier/déplier.

---


## [0.6.1] — Objets dépliables, dégâts & usure

### Ajouté
- **Objets dépliables** sur la fiche : un clic sur le nom affiche les détails —
  description pour tous les types, stats d'équipement pour les armes/protections.
- **Bouton d'attaque** (ouvre le Jet Vermine préréglé) et **bouton de Dommages**
  (calcule base + Réussites, avec le type C/L/F/B) sur les armes.
- **Système d'usure** : la Fiabilité des armes et protections se dégrade et se
  répare dynamiquement (boutons −/+, bornée par la Fiabilité maximale).

### Corrigé
- **Menus déroulants illisibles** partout : les options s'affichent désormais sur
  fond sombre.

---


## [0.6.0] — Armes & Protections (phase 4)

### Ajouté
- **Modèles Arme et Protection enrichis** : type de Dommages (Choc/Lame/Feu/Balle),
  base Vigueur, portées courte/longue, indices de Protection (base + spécifique),
  Handicap de Mobilité, Fiabilité, et **Traits** structurés (les 17 Traits du jeu).
- **Fiche d'objet** : sections Arme et Protection complètes + bloc **Traits**
  (cases à cocher avec valeur (n)). Affichage des Dommages/Traits/Indice sur la fiche.
- **Compendiums Armes (35) et Protections (17)** reprenant les tables du jeu :
  armes à feu, mêlée, corps à corps, tir, lancer ; protections partielles/intégrales,
  combinaisons spéciales et boucliers.

---


Toutes les évolutions notables du système **Vermine 2047** pour FoundryVTT.

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).
Ce projet suit un versionnage sémantique (`MAJEUR.MINEUR.CORRECTIF`).
Compatibilité : **FoundryVTT v12**.

---

## [0.5.0] — Rites & Profils (fin de la phase 5)

### Ajouté
- **Type d'objet Rite chamanique** + compendium **Rites chamaniques** (16 Rites :
  appel, apprentissage, aspect totémique, bénédiction, communication animale,
  communion, contrition, divination, fertilité, guérison, guerrier, intercession,
  perception totémique, purification, rêve lucide, transfert) avec jet, coût et transe.
- **Type d'objet Profil** + compendium **Profils** (24 profils regroupés par archétype,
  avec Boost d'archétype, Capacité unique, Domaine de prédilection, Compétences et
  Spécialités suggérées). Les profils s'ajoutent comme fiches de référence sur le
  personnage (glisser-déposer ou sélecteur « + »).
- Constante d'archétypes (Chasseurs, Combattants, Nomades, Spécialistes, Survivants,
  Chamans) et affichage des Rites/Profils sur la fiche Personnage.

La **phase 5 (Confort)** est ainsi complète.

---

## [0.4.1] — Sélecteur de compendium

### Ajouté
- **Sélecteur de compendium au clic sur « + »** : sur les fiches (Personnage,
  Créature, Groupe), ajouter un objet ouvre la liste des entrées de compendium du
  type concerné (avec recherche), ou permet de créer un objet vide. Fonctionne pour
  tous les types (Adaptations/Mutations, Traumatismes, Historique, Afflictions,
  Capacités, et les futurs compendiums).

### Note
- Le **glisser-déposer** d'une entrée de compendium directement sur une fiche
  fonctionnait déjà nativement et reste disponible.

---

## [0.4.0] — Confort (phase 5, 1ᵉʳ lot)

### Ajouté
- **Macros** : API `game.vermine.rollDialog(actor)` et compendium **Macros** avec une
  macro « Jet Vermine » prête à poser sur la barre — elle ouvre le dialogue de jet
  pour le jeton sélectionné ou le personnage assigné.
- **Type d'objet Affliction** (maladie / toxine-venin / parasite / addiction) :
  Virulence, durée, fréquence, effets ; fiche dédiée et affichage sur la fiche
  Personnage.
- **Compendium Afflictions** (7 entrées curées : venin de scorpion, veuve noire,
  frelon, feuille de coca, scolopendre, infection de plaie, fièvre des marais).

---

## [0.3.1] — Refonte visuelle de la fiche Personnage

### Modifié
- **Nouvelle disposition applicative** : barre latérale gauche (identité + navigation
  Feuille / Objets / Biographie), en-tête avec les champs et la recherche, et un
  **rail droit permanent** pour les Réserves et les Blessures.
- L'onglet **Feuille** réunit désormais Caractéristiques et Compétences.
- **Pips de Relance affichés par une croix (✕)** : les niveaux de compétence qui
  octroient une Relance (Confirmé, Expert, Légende) sont matérialisés par une croix
  plutôt qu'une pastille pleine, comme sur la fiche officielle (`●✕✕`). La légende
  reflète cette distinction.
- Palette et contrastes retravaillés (vert acide, fond plus sombre).

---

## [0.3.0] — Compendiums (phase 4)

### Ajouté
- **Nouveaux types d'objets** : Adaptation / Mutation, Traumatisme, Historique
  (modèles de données, fiche d'objet dédiée, affichage sur la fiche Personnage).
- **Compendiums (mécaniques)**, générés depuis des données curées et paraphrasées :
  - **Adaptations & Mutations** (41 entrées : Adaptations 1D/2D, Mutations 3D/4D).
  - **Traumatismes** (18 entrées : physiques et psychologiques).
  - **Historique** (12 éléments).
- **Chaîne de génération des packs** : `tools/pack-data.mjs` (contenu) +
  `tools/build-packs.mjs` (compilation LevelDB via `classic-level`), commande
  `npm run build:packs`. Les packs sont compilés automatiquement à la release (CI) et
  inclus dans l'archive ; ils ne sont pas versionnés dans le dépôt.

### Notes
- Compendiums Armes / Protections et Bestiaire reportés (tableaux en images à extraire).

---

## [0.2.0] — Le Groupe

### Ajouté
- **Nouveau type d'acteur « Groupe »** (phase 3) :
  - Totem de Groupe avec **Instincts** et **Interdits** (texte libre, une entrée par ligne).
  - **Réserve de Groupe** affichée en pastilles cliquables, avec maximum éditable.
  - Indicateur de **Moral** (Bon / Neutre / Bas).
  - **Niveau**, **Réputation**, **Objectif majeur** et **Objectifs mineurs**.
  - **Membres** ajoutés par glisser-déposer de personnages : affichage du nom et des
    Réserves (Sang-Froid / Effort), ouverture de la fiche et retrait.
  - **Capacités de Groupe** (objets embarqués).
- **Dépense de la Réserve de Groupe dans le jet** : lorsqu'un personnage appartient à
  un Groupe, le dialogue de Jet Vermine propose de puiser dans la Réserve de Groupe
  (plafonnée par la Caractéristique et par la réserve disponible), décomptée
  automatiquement sur l'acteur Groupe.

---

## [0.1.3] — Fenêtre d'options et gain de place

### Ajouté
- **Fenêtre d'Options du personnage** (bouton dans la barre de titre de la fiche),
  regroupant les réglages qui changent peu :
  - Seuils et nombre de cercles de chaque niveau de Blessure.
  - Spécialités par compétence.

### Modifié
- **Spécialités retirées des lignes de compétences** pour gagner de la place ; elles
  sont désormais éditées dans la fenêtre d'Options.
- **Blessures compactées** sur la fiche : seuls le nom, le seuil (en rappel) et les
  **pastilles à cocher/décocher** restent affichés.
- **Champ de recherche de compétences remonté dans l'en-tête**, aligné à droite au
  niveau des champs Âge / Mode de jeu / Totem / Réputation.

---

## [0.1.2] — Bloc permanent et pastilles de valeur

### Ajouté
- **Pastilles cliquables pour les Caractéristiques et les Réserves** (clic pour fixer
  la valeur, nouveau clic sur la valeur courante pour la décrémenter), avec lecture
  chiffrée à côté.

### Modifié
- **Refonte de la disposition** de la fiche Personnage :
  - Bloc **toujours affiché** en haut : Caractéristiques sur les 2/3 en **4 blocs
    côte à côte**, Réserves sur le dernier tiers, Blessures juste en dessous.
  - Suppression de l'onglet « Principal » (le bloc est désormais permanent).
- **Onglets réduits** à Compétences / Objets / Biographie (Compétences par défaut).

---

## [0.1.1] — Pastilles de niveau et recherche

### Ajouté
- **Niveaux de compétence en pastilles cliquables** (Débutant → Légende), à la manière
  de la fiche officielle, en remplacement des listes déroulantes. Un nouveau clic sur
  le niveau courant le remet à « Aucun ». Légende de correspondance affichée.
- **Recherche de compétences en temps réel** (insensible à la casse et aux accents),
  masquant les domaines sans résultat.

### Modifié
- **Refonte de la lisibilité** : mise en page en colonne flexible (corps défilant,
  suppression de la zone vide), blocs présentés en cartes, icônes d'onglets,
  contrastes et espacements améliorés.

---

## [0.1.0] — Version initiale (MVP)

### Ajouté
- **Système de jeu FoundryVTT v12** pour Vermine 2047 (game *system*).
- **Moteur de dés Vermine** :
  - Dialogue de construction de la **Main** (Caractéristique + Compétence + Spécialité
    + Matériel + Entraide + Sang-Froid).
  - Lancer de d10, comptage des **Réussites** (dé ≥ Difficulté), Succès si
    Réussites ≥ (1 + Handicap).
  - **Relances** (Compétence à partir de Confirmé, Réserve d'Effort) depuis la carte
    de chat, avec recomptage.
- **Acteur Personnage** : 8 Caractéristiques, 30 Compétences en 6 domaines (niveaux et
  spécialités), Réserves Sang-Froid / Effort (maximum dérivé des Caractéristiques et de
  l'âge), Blessures Légère / Grave / Mortelle (seuils, cercles, Malus), Réputation,
  Âge, Mode de jeu, Totem, inventaire.
- **Acteur Créature / PNJ** : caractéristiques libres (0D à > 3D), gabarit / taille,
  valeurs d'action fixes, dommages / protection, Blessures, capacités.
- **Objets** : arme, protection, équipement, capacité (modèles de données et fiche).
- **Effets d'état** de base (blessures, épuisement, stressé, empoisonné, en feu…).
- **Localisation** française et anglaise.
- **Distribution** : manifeste et workflow GitHub Actions de release versionnée
  (installation et mises à jour dans Foundry via l'URL de manifest).

### À confirmer (valeurs provisoires)
- Bonus / Relances exacts des niveaux **Maître** et **Légende**.
- Formule **Santé → Seuils** de Blessure et nombre de cercles par âge.
- Coûts exacts de guérison / récupération.

---

[0.9.0]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.9.0
[0.6.2]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.6.2
[0.6.1]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.6.1
[0.6.0]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.6.0
[0.5.0]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.5.0
[0.4.1]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.4.1
[0.4.0]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.4.0
[0.3.1]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.3.1
[0.3.0]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.3.0
[0.2.0]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.2.0
[0.1.3]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.1.3
[0.1.2]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.1.2
[0.1.1]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.1.1
[0.1.0]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.1.0
