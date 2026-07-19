# Brief agent — Créer un système FoundryVTT pour un JDR

Copiez-collez ce brief à un agent, en remplaçant les champs `<…>`. Fournissez-lui
aussi les autres fichiers de ce playbook comme référence.

---

## Contexte à fournir

- **Jeu** : `<Nom du JDR>` (© `<éditeur>`).
- **Version Foundry cible** : `<ex. v12 build 343>`.
- **Source des règles** : `<PDF / URL du guide / fichier de données>`.
  - Si un site web : cherche d'abord un fichier de données structuré
    (ex. `assets/data/*.js` chargé par l'app) — bien plus fiable que le HTML rendu.
- **Dépôt** : `<url git>` (créer public pour la distribution par manifest).
- **Langue** : `<fr / en / …>` (prévoir i18n dès le départ).

## Décisions à confirmer avec l'utilisateur (avant de coder)

1. Système complet (recommandé) vs module compagnon.
2. Périmètre de la 1re livraison : **MVP jouable d'abord** (recommandé) vs tout d'un bloc.
3. Niveau d'automatisation : **assisté** (recommandé) / minimal / fortement automatisé.
4. Contenu des compendiums : **mécaniques uniquement, paraphrasé** (recommandé) /
   complet avec textes / structure vide. (Respect des droits d'auteur — voir extraction-regles.md.)

## Marche à suivre

### Étape 0 — Comprendre le système de jeu
- Récupérer la source, identifier : le **moteur de résolution** (type de dés, seuils,
  réussites/échecs, relances, ressources), les **caractéristiques**, les **compétences**,
  la **santé/dégâts**, le **combat/initiative**, et les entités transverses (groupe, factions…).
- Extraire proprement (voir extraction-regles.md). Les **tableaux** sont souvent la donnée
  la plus précieuse et parfois cachés (blocs `table`, images…).
- Poser un `EnterPlanMode` : rédiger un plan avec le moteur de dés résumé, le data model,
  l'arborescence de fichiers, les phases, et une section « valeurs à confirmer ».

### Étape 1 — MVP (voir architecture.md)
Squelette (`system.json`, `template.json`, point d'entrée), `config.mjs`, DataModels +
fiches des 1–2 acteurs clés, **moteur de dés assisté** (dialogue → jet → carte de chat),
i18n, thème. Objectif : jouable et testable en jeu.

### Étape 2 — Distribution (voir deploiement.md)
Workflow GitHub Actions de release sur tag `v*`, URL de manifest stable, `.gitignore`.
Publier `v0.1.0`. Vérifier l'installation par manifest.

### Étapes suivantes — par phases (voir roadmap-type.md)
Combat & Santé automatisés (souvent bloqués par des tableaux chiffrés → demander/rechercher),
entités collectives, compendiums (build LevelDB), confort (macros, assistants, thème).
**Une phase = une release** avec bump de version + CHANGELOG.

## Règles de travail

- **Valide à chaque étape** : `node --check` sur les `.mjs`, `JSON.parse` sur les JSON,
  cross-check des clés i18n (utilisées vs présentes en FR **et** EN) et des chemins de templates.
- **Ne commit/tag que sur demande** ou selon la convention établie ; vérifier la CI après chaque tag.
- **Documente les incertitudes** (valeurs de tableaux non extraits) dans le README/CHANGELOG
  et dans le code (commentaires « À CONFIRMER »).
- **Respecte les droits** : mécaniques et valeurs chiffrées OK (données factuelles),
  pas de reproduction des longs textes/lore ; paraphrase les descriptions.
- Tiens un **TODO** (TodoWrite) par phase et une **mémoire projet** (état, source, à-faire).

## Livrables attendus

Système installable par manifest, README + CHANGELOG à jour, compendiums mécaniques,
fiches lisibles et thématisées, i18n complète, et ce playbook copié/actualisé pour la suite.
