/**
 * Compile les données curées (tools/pack-data.mjs) en packs LevelDB lisibles par
 * FoundryVTT v12, dans packs/<name>/.
 *
 * Usage : node tools/build-packs.mjs   (ou npm run build:packs)
 */
import { ClassicLevel } from "classic-level";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PACKS } from "./pack-data.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACKS_DIR = path.join(ROOT, "packs");

/** Identifiant déterministe de 16 caractères alphanumériques (stable entre builds). */
function makeId(seed) {
  const h = crypto.createHash("md5").update(seed).digest("base64").replace(/[^a-zA-Z0-9]/g, "");
  return (h + "0000000000000000").slice(0, 16);
}

/** Document Item minimal attendu dans un pack v12. */
function buildDoc(doc) {
  const _id = makeId(`${doc.type}:${doc.name}`);
  return {
    _id,
    _key: `!items!${_id}`,
    name: doc.name,
    type: doc.type,
    img: doc.img ?? "icons/svg/item-bag.svg",
    system: doc.system ?? {},
    effects: [],
    folder: null,
    sort: 0,
    flags: {},
    _stats: { systemId: "vermine2047", coreVersion: "12" }
  };
}

async function buildPack(pack) {
  const dest = path.join(PACKS_DIR, pack.name);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });

  const db = new ClassicLevel(dest, { keyEncoding: "utf8", valueEncoding: "json" });
  const batch = db.batch();
  for (const raw of pack.docs) {
    const doc = buildDoc(raw);
    batch.put(doc._key, doc);
  }
  await batch.write();
  await db.close();
  console.log(`  ✓ ${pack.name} : ${pack.docs.length} documents → packs/${pack.name}`);
}

console.log("Vermine 2047 | Compilation des compendiums…");
fs.mkdirSync(PACKS_DIR, { recursive: true });
for (const pack of PACKS) {
  await buildPack(pack);
}
console.log("Terminé.");
