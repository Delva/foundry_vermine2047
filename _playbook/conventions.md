# Conventions

## Versionnage (sémantique)

- `MAJEUR.MINEUR.CORRECTIF`.
- **MINEUR** : nouvelle fonctionnalité / phase (nouveau type d'acteur, compendiums, moteur…).
- **CORRECTIF** : ajustements UI, corrections, retouches (ex. lisibilité, un bouton).
- Une **release = un tag `v*`** = une entrée CHANGELOG. Historique Vermine : v0.1.0 (MVP),
  v0.1.x (UI), v0.2.0 (Groupe), v0.3.x (compendiums), v0.4.x (confort), v0.5.0 (rites/profils),
  v0.6.x (armes/protections, ajustements).

## CHANGELOG.md

Format *Keep a Changelog*, antéchronologique, une section par version :
`## [x.y.z] — Titre` puis rubriques `### Ajouté / Modifié / Corrigé`, et liens de release en bas.
Écrire en langue du projet, orienté utilisateur (ce qui change pour lui), concis.

## README.md

- Installation par **manifest** (recommandée) + installation dev (clone + build packs).
- Le nom du dossier système doit être **exactement l'`id`** (sinon les chemins
  `systems/<id>/…` ne se résolvent pas).
- Résumé du moteur de dés, arborescence, feuille de route (✅/🚧/⏳),
  section « valeurs à confirmer », et mention `© éditeur` + statut non officiel.

## i18n

- Toujours déclarer ≥ 2 langues dans `system.json` → **les fichiers doivent exister**
  (sinon Foundry plante). Maintenir FR **et** EN synchronisés (mêmes clés).
- Clés préfixées `<ID>.Domaine.cle` ; libellés des types Foundry via `TYPES.Actor.<type>` /
  `TYPES.Item.<type>`.
- **Cross-check systématique** (script) : clés utilisées (dans `.hbs`/`.mjs`) présentes en FR
  et EN, et aucune désync FR/EN.

## Messages de commit

- Style : `type(scope): résumé` (`feat`, `fix`, `chore`, `docs`, `ci`), corps en puces, langue du projet.
- Terminer par la ligne `Co-Authored-By:` requise par l'environnement, le cas échéant.
- **Ne pas commiter/taguer sans accord** (ou selon la cadence convenue avec l'utilisateur).

## Validation avant release (script rapide)

```
node --check <chaque .mjs>
node -e "JSON.parse(fs.readFileSync('<json>'))"      # system.json, template.json, lang/*.json, package.json
# i18n : clés utilisées ⊆ FR ∩ EN ; désync FR/EN = 0
# templates : tous les chemins {{> systems/<id>/…}} existent
node tools/build-packs.mjs                            # les packs se compilent
```
Puis, après le tag, vérifier la CI et l'asset `latest`.

## Mémoire & suivi

- Tenir un **TODO** (TodoWrite) par phase.
- Tenir une **note mémoire projet** : état courant, version, source des données, pièges
  d'extraction, valeurs à confirmer, prochaines phases. (Sur Vermine, mémoire dédiée
  `vermine2047-projet` + index MEMORY.md.)
