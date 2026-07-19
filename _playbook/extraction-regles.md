# Extraction des règles d'un livre / site

## Trouver la meilleure source

Par ordre de fiabilité :
1. **Fichier de données structuré** d'une appli web (ex. un `assets/data/*.js` qui définit
   un objet global `window.XXX_PAGES`). C'est de l'or : contenu déjà découpé en blocs typés.
   → Repérer via l'HTML : les `<script src="...">`.
2. **PDF officiel** : lisible, mais tableaux/mises en page à parser manuellement.
3. **HTML rendu** d'un SPA : souvent vide au chargement (JS) → peu exploitable directement.

## Cas d'un dump de données structuré (patron Vermine)

Le fichier définissait `window.VERMINE_PAGES = [ { livre, page, titre, chapitre, blocs:[…] } ]`.
Chaque bloc a un type `t` : `h1|h2|h3|p|li|**table**`.

Charger sans navigateur, avec un shim :
```js
global.window = {};
require("./donnees.js");
const pages = global.window.VERMINE_PAGES;
```

**Piège majeur rencontré** : un premier script d'extraction ne rendait que
`h1/h2/h3/li/p` → les **tableaux** (armes, protections, matériel…) étaient invisibles
et apparaissaient comme `undefined`. Or les blocs `table` (`{ t:"table", entetes:[…], lignes:[[…]] }`)
contenaient les données les plus précieuses. **Toujours inspecter TOUS les types de blocs** :
```js
const types = new Set(); for (const p of pages) for (const b of p.blocs||[]) types.add(b.t);
// puis dumper les blocs table : p.blocs.filter(b => b.t === "table")
```
Autre piège : la **numérotation de page** de la source diffère du livre physique ; se repérer
au titre/chapitre, pas au numéro.

## Déléguer l'extraction à des sous-agents

Efficace : lancer des agents « Explore » en parallèle, chacun sur un chapitre (dés, combat,
santé…), avec une consigne ciblée : « extrais la mécanique chiffrée, formules exactes, ignore
la narration ; signale les `undefined` (images) ». Le résultat sert de spec pour le data model.

## Ce qu'il faut extraire (checklist)

- Moteur de résolution : dé(s), pool, seuil de réussite, réussites requises, échec/critique, relances.
- Ressources (points de tension, mana, réserves…) : sources, dépense avant/après le jet.
- Caractéristiques (liste, échelle, regroupements) et compétences (liste, niveaux, ce qu'ils donnent).
- Santé : seuils/paliers, dégâts → blessures, malus, guérison.
- Combat : initiative, ordre, attaque/défense (carac+compétence), dégâts, protection.
- Objets : armes (dégâts, portées, traits), protections (indices), consommables.
- Contenu de compendiums : listes (dons, sorts, capacités, créatures…) avec leurs valeurs.
- **Tableaux chiffrés** souvent en images → à demander à l'utilisateur si non extractibles.

## Droits d'auteur (à respecter absolument)

- **OK** : les *mécaniques* et *valeurs chiffrées factuelles* (une machette fait 3 dégâts,
  une compétence donne +1 dé) ; ce sont des faits de jeu, non protégeables en tant que tels.
- **OK** : résumer/citer ponctuellement une source qu'on vous a fournie.
- **À éviter** : reproduire les **longs textes** (lore, descriptions d'ambiance, fiction),
  recopier une œuvre en la modifiant à peine.
- **Pratique retenue** : compendiums « mécaniques uniquement », descriptions **paraphrasées**
  et courtes (1–2 phrases). Documenter la source (© éditeur) dans le README.
- Si l'utilisateur veut publier : lui rappeler que le dépôt devient public ; garder le contenu
  transformatif/mécanique, pas la reproduction intégrale.
