# Architecture technique — Système FoundryVTT v12

Patrons validés sur Vermine 2047. Adapter les noms au nouveau JDR.

## Arborescence

```
system.json                 manifeste (id, compat, esmodules, styles, languages, packs, packFolders)
template.json               déclare les types d'Acteurs et d'Objets (schémas vides, remplis par les DataModels)
lang/fr.json, en.json       i18n (toujours au moins 2 langues déclarées => les 2 fichiers doivent exister)
styles/<id>.css             thème
module/
  <id>.mjs                  point d'entrée : hooks init/ready, enregistrements
  config.mjs                CONFIG.<ID> : caracs, compétences, niveaux, listes fixes, types de dommages, traits…
  data/actor-*.mjs          DataModels des Acteurs
  data/item-data.mjs        DataModels des Objets (une classe par type)
  documents/actor.mjs       classe Actor (getRollData, méthodes ex. rollAction)
  sheets/*-sheet.mjs        fiches (ActorSheet / ItemSheet, AppV1)
  apps/*.mjs                fenêtres annexes (options, sélecteur de compendium…)
  dice/*.mjs                moteur de dés (dialogue + résolution + carte de chat)
  helpers/templates.mjs     preload + helpers Handlebars (eq, lt, or, join…)
  helpers/effects.mjs       CONFIG.statusEffects
templates/actor|item|dice/  Handlebars (+ parts/ pour les partials)
tools/pack-data.mjs         données curées des compendiums
tools/build-packs.mjs       compile les données en packs LevelDB (classic-level)
packs/                       packs compilés (gitignore ; construits en CI)
.github/workflows/release.yml
package.json                devDep classic-level + script build:packs
```

## Choix Foundry v12

- **ES Modules** (`esmodules` dans system.json).
- **Fiches AppV1** (`ActorSheet`/`ItemSheet`) : les plus stables/documentées en v12
  (ApplicationV2 possible mais plus mouvant). Enregistrer via `Actors.registerSheet` /
  `Items.registerSheet` après `unregisterSheet("core", …)`.
- **DataModels** enregistrés à l'`init` : `CONFIG.Actor.dataModels.<type> = MaClasse`.
  `template.json` liste les types (objets vides) ; le schéma réel vient du DataModel.
- **renderTemplate / loadTemplates** : globaux en v12 (pas `foundry.applications.handlebars.*`).
  Précharger les templates en **tableau** de chemins (les enregistre comme partials par chemin).
- `Math.clamp`, `foundry.utils.*` disponibles. Éviter `Date.now()`/`Math.random()` dans du code
  qui doit être déterministe (build de packs → générer les `_id` par hash du nom).

## Data-driven : config.mjs

Un objet `VERMINE = {}` exposé via `CONFIG.VERMINE` à l'init. Il centralise :
caractéristiques (avec regroupements), compétences (avec domaine/rareté), niveaux
(bonus/relances), listes fixes (âges, modes, totems, archétypes…), types de dommages,
traits, effets d'état. Les libellés pointent vers des clés i18n (`"VERMINE.Xxx"`).

Avantage : les fiches et le moteur itèrent sur la config → ajouter une donnée = 1 entrée
+ 1 clé i18n, sans toucher au code.

## DataModels

```js
export class PersonnageData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const f = foundry.data.fields;
    return { /* SchemaField / NumberField / StringField(choices) / ArrayField / HTMLField / ObjectField … */ };
  }
  prepareDerivedData() {
    // calculs dérivés (réserves = somme de caracs ± âge, seuils, malus…) et
    // LIBELLÉS D'AFFICHAGE (ex. this.labelDommages = "Vigueur+2 (L)") pour les templates.
  }
  getRollData() { /* expose les valeurs aux formules */ }
}
```
- Champs à choix restreints : `StringField({ choices: [...] })`.
- Valeurs éditables au clic (pips) : stocker un nombre, le muter via `actor.update`.
- Données « composées » (traits d'un objet) : `ObjectField` `{ cle: valeur|true }`, assemblées
  depuis le formulaire dans `_updateObject`.

## Moteur de dés (patron « pool + réussites »)

1. **Dialogue** (`dice/roll-dialog.mjs`) : construit la « main » à partir de
   caractéristique + compétence + bonus + ressources dépensées ; aperçu dynamique.
2. **Résolution** (`dice/*-roll.mjs`) : `new Roll("Nd10")`, compter les faces ≥ Difficulté,
   comparer au seuil requis, gérer relances (rejet d'un dé + recompte).
3. **Carte de chat** : template rendu, boutons de relance qui **relisent l'état depuis les
   flags du message** (`message.flags.<id>`), reconsomment la ressource et **mettent à jour**
   le message. Lier les boutons via `Hooks.on("renderChatMessage", …)`.

Adapter au moteur du JDR cible (d100, d6 pool, dés à succès, etc.) : seul le calcul change,
le schéma dialogue → roll → carte reste valable.

## Fiches

- Layout applicatif possible en CSS grid : barre latérale (nav) | corps (onglets) | rail permanent.
  Les onglets Foundry marchent avec `nav.sheet-tabs` (peut être vertical) + `section.sheet-body`.
- Interactions utiles : pips cliquables (valeurs/niveaux), recherche filtrante en direct,
  cases à cocher (blessures), objets dépliables (description + stats + actions),
  boutons d'action (jets, dégâts, usure).
- Fenêtres annexes (`apps/`) pour déporter les réglages rares (seuils, spécialités) et alléger la fiche.
- **Sélecteur de compendium** générique : au clic « + », lister les entrées du type demandé
  dans tous les packs Item et permettre l'import, sinon créer un objet vide. Le glisser-déposer
  d'un compendium vers une fiche marche nativement.

## Compendiums (voir deploiement.md pour le build)

- Données curées dans `tools/pack-data.mjs`, compilées en **LevelDB** par `tools/build-packs.mjs`
  (dépendance `classic-level`). Clés `!items!<id>` / `!macros!<id>`, valeur = document
  (`_id`, `_key`, `name`, `type`, `img`, `system`, …). `_id` déterministe = hash du nom.
- Déclarer chaque pack dans `system.json` (`packs` + `packFolders`).
- Packs **non versionnés** (`/packs/` dans `.gitignore`) : reconstruits en CI et inclus au zip.
