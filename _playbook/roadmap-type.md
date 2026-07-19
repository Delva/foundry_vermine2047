# Roadmap type & gestion du TODO

Découpage éprouvé sur Vermine 2047. Adapter selon le JDR ; **une phase = une release**.

## Phase 1 — MVP jouable
- Squelette (`system.json`, `template.json`, point d'entrée), `config.mjs`.
- DataModels + fiches des acteurs clés (personnage + PNJ/créature).
- Moteur de dés assisté complet (dialogue → jet → carte de chat → relances).
- Réserves/ressources, santé/blessures de base, effets d'état, i18n, thème.
- **But : jouable et testable en jeu.** → release `v0.1.0`.

## Phase « Distribution » (à faire tôt)
- Workflow CI de release, URL de manifest, `.gitignore`, README. Publier et tester l'install.

## Phase UI (souvent en //)
- Layout applicatif (barre latérale, rail), pips cliquables, recherche filtrante,
  fenêtre d'options annexe, objets dépliables. Itérer selon les retours (captures d'écran utiles).

## Phase — Entités collectives (si le jeu en a)
- Acteur « groupe/faction » (ressource commune, moral, objectifs, membres par glisser-déposer)
  et son intégration au moteur de dés.

## Phase — Compendiums (mécaniques)
- Types d'objets dédiés (dons, sorts, capacités, afflictions, équipement…).
- `tools/pack-data.mjs` (données curées, paraphrasées) + build LevelDB + déclaration dans system.json.
- Créatures/bestiaire = compendium d'Acteurs.

## Phase — Combat & Santé automatisés
- Dégâts = base + réussites, protection → blessures, initiative, ActiveEffects des malus.
- **Souvent bloquée** par des tableaux chiffrés en images (seuils, coûts, paliers) :
  les demander à l'utilisateur ou tenter de les retrouver (blocs `table`). Ne pas inventer.

## Phase — Confort
- Macros + API globale (`game.<id>.…`), sélecteur de compendium, assistants de création
  (profils/archétypes comme fiches de référence — éviter un wizard auto-stat fragile),
  thème poussé.

## Gestion du TODO
- Une liste TodoWrite par phase, un seul item `in_progress` à la fois.
- À chaque phase : coder → **valider** (checklist conventions.md) → bump + CHANGELOG →
  commit/tag → vérifier CI → mettre à jour la mémoire projet.
- Marquer clairement dans README/mémoire ce qui est fait (✅), en cours (🚧), bloqué (⏳).

## Signaux « demander à l'utilisateur »
- Choix structurants (système vs module, périmètre, automatisation, contenu compendiums).
- Tableaux chiffrés non extractibles (images) nécessaires à l'automatisation.
- Publication publique du dépôt (droits d'auteur).
- Ambiguïtés de maquette UI (proportions, emplacement d'un contrôle).
