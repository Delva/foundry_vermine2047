import { VERMINE } from "../config.mjs";
import { ajouterObjet } from "../apps/compendium-picker.mjs";

/** Fiche du Groupe. */
export class GroupeSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "actor", "groupe"],
      template: "systems/vermine2047/templates/actor/groupe-sheet.hbs",
      width: 720,
      height: 720
    });
  }

  async getData(options) {
    const ctx = await super.getData(options);
    const sys = this.actor.system;
    ctx.system = sys;
    ctx.VERMINE = VERMINE;

    // Réserve de Groupe en pips.
    const rg = sys.reserveGroupe;
    ctx.reservePips = Array.from({ length: rg.max ?? 0 }, (_, i) => ({ pos: i + 1, on: i < rg.value }));

    ctx.moralOptions = ["bon", "neutre", "bas"].map((k) => ({
      key: k, label: game.i18n.localize(`VERMINE.Moral.${k}`)
    }));

    // Résolution des membres (UUID → acteur).
    ctx.membres = [];
    for (const uuid of sys.membres ?? []) {
      const a = await fromUuid(uuid);
      if (a) ctx.membres.push({
        uuid, name: a.name, img: a.img,
        sf: a.system?.reserves?.sangFroid,
        ef: a.system?.reserves?.effort
      });
    }

    ctx.capacites = this.actor.items.filter((i) => i.type === "capacite");
    return ctx;
  }

  activateListeners(html) {
    super.activateListeners(html);

    if (!this.isEditable) return;

    // Réserve de Groupe via pips.
    html.find(".value-pip").on("click", (ev) => {
      const el = ev.currentTarget;
      const pos = Number(el.dataset.pos);
      const current = this.actor.system.reserveGroupe.value;
      const nv = (pos === current) ? pos - 1 : pos;
      this.actor.update({ "system.reserveGroupe.value": Math.max(0, nv) });
    });

    // Membres.
    html.find("[data-membre-delete]").on("click", (ev) => {
      const uuid = ev.currentTarget.closest("[data-uuid]").dataset.uuid;
      const membres = this.actor.system.membres.filter((m) => m !== uuid);
      this.actor.update({ "system.membres": membres });
    });
    html.find("[data-membre-open]").on("click", async (ev) => {
      const uuid = ev.currentTarget.closest("[data-uuid]").dataset.uuid;
      (await fromUuid(uuid))?.sheet.render(true);
    });

    // Capacités de Groupe.
    html.find("[data-item-create]").on("click", () => ajouterObjet(this.actor, "capacite"));
    html.find("[data-item-edit]").on("click", (ev) =>
      this.actor.items.get(ev.currentTarget.closest("[data-item-id]").dataset.itemId)?.sheet.render(true));
    html.find("[data-item-delete]").on("click", (ev) =>
      this.actor.deleteEmbeddedDocuments("Item", [ev.currentTarget.closest("[data-item-id]").dataset.itemId]));
  }

  /** @override — un acteur Personnage déposé sur la fiche devient membre. */
  async _onDropActor(event, data) {
    const actor = await fromUuid(data.uuid);
    if (!actor || actor.type !== "personnage") return false;
    const membres = new Set(this.actor.system.membres ?? []);
    if (membres.has(actor.uuid)) return false;
    membres.add(actor.uuid);
    return this.actor.update({ "system.membres": [...membres] });
  }
}
