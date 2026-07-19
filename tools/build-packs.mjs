/**
 * Compile les packs (compendiums) LevelDB à partir de tools/pack-data.mjs.
 * Usage : npm run build:packs
 *
 * Ne reconstruit que les packs pour lesquels un export existe dans pack-data.mjs.
 * Un pack déjà compilé et non présent dans pack-data.mjs (ex. adaptations,
 * profils…) n'est pas touché.
 */
import { ClassicLevel } from "classic-level";
import { randomBytes } from "node:crypto";
import { rm, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as packData from "./pack-data.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PACKS_DIR = path.join(ROOT, "..", "packs");

/** Génère un identifiant Foundry (16 caractères alphanumériques). */
function randomID(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length];
  return out;
}

/** Complète une entrée source avec les champs de document Foundry standards. */
function toDocument(entry, sort) {
  const id = randomID();
  return {
    _id: id,
    name: entry.name,
    img: entry.img ?? "icons/svg/item-bag.svg",
    type: entry.type,
    system: entry.system,
    effects: [],
    folder: null,
    sort,
    ownership: { default: 0 },
    flags: {},
    _stats: { systemId: "vermine2047", coreVersion: "12" }
  };
}

async function buildPack(name, entries) {
  const dir = path.join(PACKS_DIR, name);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const db = new ClassicLevel(dir, { valueEncoding: "json" });
  await db.open();
  let sort = 0;
  for (const entry of entries) {
    const doc = toDocument(entry, (sort += 100000));
    await db.put(`!items!${doc._id}`, doc);
  }
  await db.close();
  console.log(`✓ packs/${name} (${entries.length} entrées)`);
}

for (const [name, entries] of Object.entries(packData)) {
  if (!Array.isArray(entries)) continue;
  await buildPack(name, entries);
}
