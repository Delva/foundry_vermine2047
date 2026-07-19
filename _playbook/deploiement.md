# Déploiement & distribution

## Principe

L'utilisateur installe le système dans Foundry via une **URL de manifest** stable pointant
vers le `system.json` de la **dernière release GitHub**. Un workflow CI construit les
compendiums et publie une release (zip + manifest) à chaque tag `v*`.

> **Le dépôt doit être public** : Foundry télécharge sans authentification. Les release
> assets d'un dépôt privé renvoient 404 → l'installation par manifest échoue.

## system.json (champs de distribution)

```json
"version": "0.1.0",
"compatibility": { "minimum": "12", "verified": "12", "maximum": "12" },
"url": "https://github.com/<owner>/<repo>",
"manifest": "https://github.com/<owner>/<repo>/releases/latest/download/system.json",
"download": "https://github.com/<owner>/<repo>/releases/latest/download/system.zip"
```
Le workflow réécrit `version`/`manifest`/`download` dans le `system.json` de l'asset au moment
du tag (download pointant vers la version précise, manifest vers `latest`).

## Workflow `.github/workflows/release.yml` (schéma)

Déclencheur : `push` de tags `v*`. Étapes :
1. `checkout`.
2. Déduire la version depuis `GITHUB_REF_NAME` (`v0.3.0` → `0.3.0`).
3. Injecter version/manifest/download dans `system.json` (petit script Node).
4. `setup-node` → `npm install` → `npm run build:packs` (construit `packs/` en LevelDB).
5. `zip -r system.zip . -x ".git/*" ".github/*" "node_modules/*" "tools/*" "*.zip" ".gitignore" "package*.json"`.
6. `softprops/action-gh-release@v2` : publie la release avec `system.json` + `system.zip`.

Permissions : `contents: write`.

**Piège heredoc dans YAML** : un `node <<'EOF' … EOF` dans un `run: |` fonctionne si le
corps ET le `EOF` de fermeture ont la **même indentation** (YAML retire l'indentation commune,
laissant `EOF` en début de ligne). Délimiteur entre quotes (`<<'EOF'`) pour ne pas expandre
les backticks/`${}` du script.

## Build des packs

- `package.json` : `type: module`, devDep `classic-level`, script `build:packs`.
- `tools/build-packs.mjs` ouvre un `ClassicLevel` par pack (`keyEncoding: "utf8"`,
  `valueEncoding: "json"`), écrit chaque doc sous la clé `!items!<id>` (ou `!macros!<id>`).
  `_id` = 16 chars alphanumériques **déterministes** (hash MD5 du nom → base64 nettoyé),
  pour que les rebuilds soient stables.
- `.gitignore` : `/packs/` (artefacts binaires reconstruits en CI ; jamais commités).
- Installation dev (clone) : lancer `npm install && npm run build:packs` pour voir les packs.

## Publier une version

```bash
# bump system.json + CHANGELOG, puis :
git commit -am "…"
git push
git tag -a v0.x.y -m "…"
git push origin v0.x.y
```
Puis vérifier la CI (`completed/success`) et que l'asset `system.json` de `latest` porte la
bonne version. Contrôle rapide via l'API :
`curl -sL .../releases/latest/download/system.json` → champ `version`.

## URL à donner à l'utilisateur

```
https://github.com/<owner>/<repo>/releases/latest/download/system.json
```
À coller dans Foundry : Configuration → Systèmes de jeu → Installer un système → URL du manifeste.
Foundry détecte ensuite les futures versions automatiquement.
