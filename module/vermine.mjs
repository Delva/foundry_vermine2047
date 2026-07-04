import { VERMINE } from "./config.mjs";
import { PersonnageData } from "./data/actor-personnage.mjs";
import { CreatureData } from "./data/actor-creature.mjs";
import { GroupeData } from "./data/actor-groupe.mjs";
import { ArmeData, ProtectionData, EquipementData, CapaciteData } from "./data/item-data.mjs";
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

Hooks.once("ready", function () {
  console.log("Vermine 2047 | Système prêt");
});

// Câblage des boutons de Relance sur les cartes de chat.
Hooks.on("renderChatMessage", (message, html) => {
  html.find(".vermine-relance").on("click", onRelance);
});
