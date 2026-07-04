import { VERMINE } from "../config.mjs";

/** Fiche des Créatures et PNJ. */
export class CreatureSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "actor", "creature"],
      template: "systems/vermine2047/templates/actor/creature-sheet.hbs",
      width: 620,
      height: 640
    });
  }

  async getData(options) {
    const ctx = await super.getData(options);
    const sys = this.actor.system;
    ctx.system = sys;
    ctx.VERMINE = VERMINE;

    ctx.caracs = Object.entries(VERMINE.caracteristiques).map(([key, c]) => ({
      key, label: game.i18n.localize(c.label), value: sys.caracteristiques[key].value
    }));

    ctx.blessuresAff = {};
    for (const key of Object.keys(VERMINE.niveauxBlessure)) {
      const b = sys.blessures[key];
      ctx.blessuresAff[key] = {
        label: game.i18n.localize(VERMINE.niveauxBlessure[key].label),
        seuil: b.seuil, cercles: b.cercles, coches: b.coches,
        dots: Array.from({ length: b.cercles }, (_, i) => ({ index: i, coche: i < b.coches }))
      };
    }

    ctx.capacites = this.actor.items.filter(i => i.type === "capacite");
    ctx.enrichedNotes = await TextEditor.enrichHTML(sys.notes ?? "", { async: true });
    return ctx;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find("[data-roll-carac]").on("click", (ev) =>
      this.actor.rollAction({ caracteristique: ev.currentTarget.dataset.rollCarac }));

    if (!this.isEditable) return;
    html.find("[data-blessure]").on("click", (ev) => {
      const el = ev.currentTarget;
      const niveau = el.dataset.blessure;
      const index = Number(el.dataset.index);
      const actuel = this.actor.system.blessures[niveau].coches;
      const nouveau = (actuel === index + 1) ? index : index + 1;
      this.actor.update({ [`system.blessures.${niveau}.coches`]: nouveau });
    });
    html.find("[data-item-create]").on("click", async () => {
      await this.actor.createEmbeddedDocuments("Item", [{
        name: game.i18n.format("VERMINE.Item.Nouveau", { type: game.i18n.localize("TYPES.Item.capacite") }),
        type: "capacite"
      }]);
    });
    html.find("[data-item-edit]").on("click", (ev) =>
      this.actor.items.get(ev.currentTarget.closest("[data-item-id]").dataset.itemId)?.sheet.render(true));
    html.find("[data-item-delete]").on("click", (ev) =>
      this.actor.deleteEmbeddedDocuments("Item", [ev.currentTarget.closest("[data-item-id]").dataset.itemId]));
  }
}
