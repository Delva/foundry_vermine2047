import { VERMINE } from "../config.mjs";

/** Fiche générique pour tous les types d'objets. */
export class VermineItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "item"],
      template: "systems/vermine2047/templates/item/item-sheet.hbs",
      width: 500,
      height: 460
    });
  }

  async getData(options) {
    const ctx = await super.getData(options);
    ctx.system = this.item.system;
    ctx.VERMINE = VERMINE;
    ctx.isArme = this.item.type === "arme";
    ctx.isProtection = this.item.type === "protection";
    ctx.isEquipement = this.item.type === "equipement";
    ctx.isCapacite = this.item.type === "capacite";
    ctx.isAdaptation = this.item.type === "adaptation";
    ctx.isTraumatisme = this.item.type === "traumatisme";
    ctx.isHistorique = this.item.type === "historique";

    ctx.competencesOptions = Object.entries(VERMINE.competences)
      .map(([key, c]) => ({ key, label: game.i18n.localize(c.label) }));
    ctx.totemsOptions = Object.entries(VERMINE.totems)
      .map(([key, l]) => ({ key, label: game.i18n.localize(l) }));
    ctx.typesCapacite = Object.entries(VERMINE.typesCapacite)
      .map(([key, l]) => ({ key, label: game.i18n.localize(l) }));

    ctx.enrichedDesc = await TextEditor.enrichHTML(this.item.system.description ?? "", { async: true });
    return ctx;
  }
}
