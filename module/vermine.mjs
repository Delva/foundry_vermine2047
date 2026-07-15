import { VERMINE } from "./config.mjs";
import { PersonnageData } from "./data/actor-personnage.mjs";
import { CreatureData } from "./data/actor-creature.mjs";
import { GroupeData } from "./data/actor-groupe.mjs";
import { ArmeData, ProtectionData, EquipementData, CapaciteData, AdaptationData, TraumatismeData, HistoriqueData, AfflictionData, RiteData, ProfilData } from "./data/item-data.mjs";
import { ouvrirDialogueJet } from "./dice/roll-dialog.mjs";
import { VermineActor } from "./documents/actor.mjs";
import { PersonnageSheet } from "./sheets/personnage-sheet.mjs";
import { CreatureSheet } from "./sheets/creature-sheet.mjs";
import { GroupeSheet } from "./sheets/groupe-sheet.mjs";
import { VermineItemSheet } from "./sheets/item-sheet.mjs";
import { preloadTemplates, registerHandlebarsHelpers } from "./helpers/templates.mjs";
import { registerStatusEffects } from "./helpers/effects.mjs";
import { onRelance } from "./dice/vermine-roll.mjs";

Hooks.once("init", function () {
  console.log("Vermine 2047 | Initialisation du système");

  CONFIG.VERMINE = VERMINE;

  // Classe de document personnalisée.
  CONFIG.Actor.documentClass = VermineActor;

  // DataModels des Acteurs.
  CONFIG.Actor.dataModels.personnage = PersonnageData;
  CONFIG.Actor.dataModels.creature = CreatureData;
  CONFIG.Actor.dataModels.groupe = GroupeData;

  // DataModels des Objets.
  CONFIG.Item.dataModels.arme = ArmeData;
  CONFIG.Item.dataModels.protection = ProtectionData;
  CONFIG.Item.dataModels.equipement = EquipementData;
  CONFIG.Item.dataModels.capacite = CapaciteData;
  CONFIG.Item.dataModels.adaptation = AdaptationData;
  CONFIG.Item.dataModels.traumatisme = TraumatismeData;
  CONFIG.Item.dataModels.historique = HistoriqueData;
  CONFIG.Item.dataModels.affliction = AfflictionData;
  CONFIG.Item.dataModels.rite = RiteData;
  CONFIG.Item.dataModels.profil = ProfilData;

  // Fiches.
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("vermine2047", PersonnageSheet, {
    types: ["personnage"], makeDefault: true, label: "VERMINE.Fiche.Personnage"
  });
  Actors.registerSheet("vermine2047", CreatureSheet, {
    types: ["creature"], makeDefault: true, label: "VERMINE.Fiche.Creature"
  });
  Actors.registerSheet("vermine2047", GroupeSheet, {
    types: ["groupe"], makeDefault: true, label: "VERMINE.Fiche.Groupe"
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("vermine2047", VermineItemSheet, {
    makeDefault: true, label: "VERMINE.Fiche.Objet"
  });

  registerHandlebarsHelpers();
  registerStatusEffects();
  preloadTemplates();
});

Hooks.once("ready", async function () {
  console.log("Vermine 2047 | Système prêt");
  // API publique pour les macros.
  game.vermine = {
    rollDialog: (actor, preset = {}) => {
      const a = actor ?? canvas.tokens?.controlled[0]?.actor ?? game.user.character;
      if (!a) return ui.notifications.warn(game.i18n.localize("VERMINE.Macro.AucunActeur"));
      return ouvrirDialogueJet(a, preset);
    }
  };

  if (game.user.isGM) await migrerReservesMax();
});

/**
 * Migration v0.7.4 : persiste UNE fois le plafond (`max`) des Réserves pour les
 * personnages créés avant le découplage (max absent en base). La valeur écrite est
 * l'ancien plafond dérivé (somme des Caractéristiques du groupe + modificateur d'âge
 * + éventuel bonusMax), lu directement depuis la source — jamais mélangé avec la
 * valeur possédée. Une fois persisté, le max reste stocké, indépendant et éditable ;
 * la migration ne le retouche plus (condition `max === undefined`).
 */
async function migrerReservesMax() {
  const updates = [];
  for (const actor of game.actors) {
    if (actor.type !== "personnage") continue;
    const sysSrc = actor._source?.system;
    const src = sysSrc?.reserves;
    if (!src) continue;
    const modAge = VERMINE.ages[sysSrc.age]?.modReserve ?? 0;
    const data = {};
    for (const [rKey, caracKeys] of Object.entries(VERMINE.reserves)) {
      if (src[rKey] && src[rKey].max === undefined) {
        const base = caracKeys.reduce((sum, c) => sum + (sysSrc.caracteristiques?.[c]?.value ?? 0), 0);
        const derive = base + modAge + (src[rKey].bonusMax ?? 0);
        data[`system.reserves.${rKey}.max`] = Math.max(0, Math.min(10, derive));
      }
    }
    if (Object.keys(data).length) updates.push({ _id: actor.id, ...data });
  }
  if (updates.length) {
    await Actor.updateDocuments(updates);
    console.log(`Vermine 2047 | Réserves migrées (max persisté) pour ${updates.length} personnage(s).`);
  }
}

// Câblage des boutons de Relance sur les cartes de chat.
Hooks.on("renderChatMessage", (message, html) => {
  html.find(".vermine-relance").on("click", onRelance);
});
