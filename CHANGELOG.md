# Journal des modifications

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
