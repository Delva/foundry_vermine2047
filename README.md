# Vermine 2047 — Système FoundryVTT (non officiel)

Système de jeu pour **FoundryVTT v12** implémentant les règles de **Vermine 2047**
(JDR post-apocalyptique © Studio Agate). Projet non officiel, à usage personnel.

> État : **MVP (v0.1.0)** — fiches Personnage & Créature, moteur de dés assisté
> (Main de d10, comptage des Réussites, Relances), Réserves et Blessures.

## Installation par manifest (recommandé)

> Nécessite un **dépôt public**. La distribution passe par les **Releases GitHub**
> (workflow `.github/workflows/release.yml`).

Publier une version :

```bash
git tag v0.1.0
git push --tags
```

Le workflow construit `system.zip`, injecte la version + les URL dans `system.json`
et crée la release. URL de manifest **stable** à coller dans Foundry
(*Configuration → Systèmes de jeu → Installer un système → URL du manifeste*) :

```
https://github.com/Delva/foundry_vermine2047/releases/latest/download/system.json
```

Foundry détectera automatiquement les futures versions (nouveaux tags `v*`).

## Installation (développement)

Foundry charge les systèmes depuis `<userData>/Data/systems/`. Sous Windows, le dossier
utilisateur par défaut est `%LOCALAPPDATA%\FoundryVTT\Data\systems`.

Créez une **jonction** (lien) vers ce dépôt, nommée exactement `vermine2047` :

```powershell
# PowerShell (adaptez le chemin de Data si besoin)
$data = "$env:LOCALAPPDATA\FoundryVTT\Data\systems"
New-Item -ItemType Junction -Path "$data\vermine2047" `
  -Target "c:\Users\Delvarion\Documents\codesource\foundry_vermine2047"
```

Puis, dans Foundry v12 : **Game Systems → le système « Vermine 2047 » apparaît → Créer un Monde** dessus.

> Le dossier lié **doit** s'appeler `vermine2047` (= `id` dans `system.json`), sinon
> les chemins `systems/vermine2047/...` (templates, styles) ne se résolvent pas.

## Test rapide (recette MVP)

1. Créer un **Personnage**, répartir les Caractéristiques (1–3D). Les Réserves
   (Sang-Froid / Effort) affichent un maximum calculé automatiquement (somme des
   Caractéristiques ± âge).
2. Onglet **Compétences** : passer p.ex. *Armes de tir* à **Confirmé**.
3. Cliquer sur le nom d'une Caractéristique ou d'une Compétence → **dialogue de Jet Vermine**.
   Choisir *Précision + Armes de tir*, Difficulté **7**, dépenser **1D** de Sang-Froid →
   la Main = Précision + 1 (compétence) + 1 (Sang-Froid). Lancer.
4. La **carte de chat** montre les dés (verts = Réussite ≥ Difficulté), le total et
   Succès/Échec. Utiliser un bouton **Relance** (Compétence/Effort) sur un dé raté.
5. Créer une **Créature** : Caractéristiques libres (0D → échec auto ; >3D possible).

## Architecture

- `system.json` / `template.json` — manifeste et déclaration des types.
- `module/config.mjs` — constantes de jeu (8 Caractéristiques, 30 Compétences en 6 domaines,
  niveaux, Totems, âges, modes, effets d'état).
- `module/data/` — DataModels (`foundry.abstract.TypeDataModel`) des Acteurs et Objets.
- `module/documents/actor.mjs` — classe Acteur + `rollAction()`.
- `module/dice/` — moteur de dés (`vermine-roll.mjs`) et dialogue (`roll-dialog.mjs`).
- `module/sheets/` — fiches (AppV1) Personnage / Créature / Objet.
- `templates/`, `styles/`, `lang/` — Handlebars, CSS, i18n (FR + EN).

## Le moteur de dés

```
Main (d10) = Caractéristique + Bonus Compétence (+1/+1/+2…) + Spécialité (+1)
           + Matériel (+1) + Entraide (+1/assistant) + Sang-Froid dépensé (− Malus de blessure)
Réussite   = dé ≥ Difficulté (3–10)
Succès     = Réussites ≥ (1 + Handicap)
Relances   = Compétence (Confirmé+) et Réserve d'Effort (après le jet)
```

## Données à confirmer (source officielle)

Certains tableaux du guide en ligne sont des images non exploitables. Valeurs
**placeholder** à vérifier avant l'automatisation (phase 2) :

- Bonus/Relances exacts des niveaux **Maître** et **Légende**.
- Formule **Santé → Seuils** de Blessure et nombre de **cercles par âge**.
- Coûts exacts de **guérison / récupération**.
- Modificateurs de Réserve selon l'âge (actuellement Jeune −1, Ancien −1).

## Feuille de route

- **Phase 2** — Combat & Santé : Dommages = base + Réussites, Protection→Blessures,
  Réaction/initiative, ActiveEffects des Malus.
- **Phase 3** — Le Groupe ✅ (acteur `groupe` : Réserve de Groupe, Moral, Totem/Instincts/Interdits, Niveau, Objectifs, membres, Capacités ; dépense de la Réserve de Groupe intégrée au jet).
- **Phase 4** — Compendiums (mécaniques) générés depuis les données du guide.
- **Phase 5** — Profils/archétypes, Rites chamaniques, maladies/venins, macros, thème.

---

*Vermine 2047 est une propriété de Studio Agate. Ce système est un projet de fan non
officiel et n'embarque pas les textes protégés de l'œuvre.*
