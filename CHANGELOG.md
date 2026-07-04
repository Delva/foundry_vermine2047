# Journal des modifications

Toutes les évolutions notables du système **Vermine 2047** pour FoundryVTT.

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).
Ce projet suit un versionnage sémantique (`MAJEUR.MINEUR.CORRECTIF`).
Compatibilité : **FoundryVTT v12**.

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

[0.3.1]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.3.1
[0.3.0]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.3.0
[0.2.0]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.2.0
[0.1.3]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.1.3
[0.1.2]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.1.2
[0.1.1]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.1.1
[0.1.0]: https://github.com/Delva/foundry_vermine2047/releases/tag/v0.1.0
