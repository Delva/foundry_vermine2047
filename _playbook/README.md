# Playbook — Créer un système FoundryVTT à partir d'un livre de règles

Ce dossier est une **méthodologie réutilisable**, tirée de la réalisation du système
**Vermine 2047** (FoundryVTT v12). Il permet de confier à un agent (ou de refaire
soi-même) la création d'un système Foundry pour **n'importe quel JDR**, à partir de
son livre de règles.

> Dossier **local uniquement** : il est ignoré par git (`/_playbook/` dans `.gitignore`)
> et n'est jamais inclus dans les releases. Copiez-le dans le nouveau projet pour le réutiliser.

## Contenu

| Fichier | Rôle |
|---|---|
| [AGENT-BRIEF.md](AGENT-BRIEF.md) | **Le point de départ** : brief prêt à coller pour lancer un agent sur un nouveau JDR. |
| [architecture.md](architecture.md) | Architecture technique d'un système Foundry v12 (fichiers, DataModels, fiches, moteur de dés, compendiums). |
| [extraction-regles.md](extraction-regles.md) | Comment extraire les règles/données d'un livre ou d'un site, et les considérations de droits d'auteur. |
| [deploiement.md](deploiement.md) | Distribution : GitHub Releases + Actions, URL de manifest, `.gitignore`. |
| [conventions.md](conventions.md) | Versionnage, CHANGELOG, README, i18n, messages de commit. |
| [roadmap-type.md](roadmap-type.md) | Découpage en phases type + gestion du TODO. |

## Philosophie en 8 principes

1. **Système, pas module.** Un JDR original = un *game system* Foundry (types d'Acteurs/Objets,
   fiches, moteur de dés propre). Le « module » ne convient que pour compléter un système existant.
2. **Data-driven.** Les données fixes du jeu (caractéristiques, compétences, niveaux, totems…)
   vivent dans un `config.mjs` unique référencé via `CONFIG.<ID>`. On code la mécanique une fois,
   on la nourrit de données.
3. **DataModels typés.** Chaque type d'Acteur/Objet a un `foundry.abstract.TypeDataModel`
   (`defineSchema` + `prepareDerivedData` pour les valeurs calculées et libellés d'affichage).
4. **MVP jouable d'abord.** Livrer vite un socle testable en jeu (fiches + moteur de dés),
   puis enrichir par phases. Chaque phase = une release.
5. **Assisté, pas magique.** Le moteur aide (construit les jets, compte, calcule), mais laisse
   le MJ décider ; l'automatisation lourde vient en dernier, quand les règles chiffrées sont sûres.
6. **Compendiums mécaniques, paraphrasés.** On embarque les *données de jeu* (valeurs, listes),
   pas les longs textes protégés. Voir [extraction-regles.md](extraction-regles.md).
7. **Distribution reproductible.** Un workflow CI construit les compendiums et publie une release
   versionnée à chaque tag `v*`. L'utilisateur installe via une URL de manifest stable.
8. **Traçabilité.** README + CHANGELOG + versionnage sémantique à jour à chaque release ;
   les valeurs incertaines (tableaux non extraits) sont documentées comme « à confirmer ».

## Résultat obtenu sur Vermine 2047 (exemple de référence)

- Types d'Acteurs : `personnage`, `creature`, `groupe`.
- Types d'Objets : `arme`, `protection`, `equipement`, `capacite`, `adaptation`,
  `traumatisme`, `historique`, `affliction`, `rite`, `profil`.
- Moteur de dés « pool + comptage de réussites » avec relances, réserves, carte de chat.
- 9 compendiums LevelDB générés depuis des données curées.
- Fiche applicative (barre latérale, rail, pips), sélecteur de compendium, système d'usure.
- Distribution par Releases GitHub (workflow CI), FR/EN.
- ~7 releases de v0.1.0 (MVP) à v0.6.2, en ~6 phases.
