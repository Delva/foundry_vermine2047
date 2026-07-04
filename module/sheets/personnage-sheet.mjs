import { VERMINE } from "../config.mjs";

/** Fiche du Personnage joueur. */
export class PersonnageSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "actor", "personnage"],
      template: "systems/vermine2047/templates/actor/personnage-sheet.hbs",
      width: 740,
      height: 800,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "principal" }]
    });
  }

  /** @override */
  async getData(options) {
    const ctx = await super.getData(options);
    const sys = this.actor.system;
    ctx.system = sys;
    ctx.VERMINE = VERMINE;

    // Caractéristiques regroupées par type.
    ctx.groupes = {};
    for (const gKey of Object.keys(VERMINE.groupesCarac)) {
      ctx.groupes[gKey] = { label: game.i18n.localize(VERMINE.groupesCarac[gKey]), caracs: [] };
    }
    for (const [key, c] of Object.entries(VERMINE.caracteristiques)) {
      ctx.groupes[c.groupe].caracs.push({
        key, label: game.i18n.localize(c.label), value: sys.caracteristiques[key].value
      });
    }

    // Compétences regroupées par domaine.
    ctx.domaines = {};
    for (const [dKey, dLabel] of Object.entries(VERMINE.domaines)) {
      ctx.domaines[dKey] = { label: game.i18n.localize(dLabel), competences: [] };
    }
    for (const [key, c] of Object.entries(VERMINE.competences)) {
      const comp = sys.competences[key];
      ctx.domaines[c.domaine].competences.push({
        key,
        label: game.i18n.localize(c.label),
        rarete: c.rarete,
        niveau: comp.niveau,
        specialites: comp.specialites ?? []
      });
    }

    // Blessures : pré-calcul des cercles pour l'affichage.
    ctx.blessuresAff = {};
    for (const key of Object.keys(VERMINE.niveauxBlessure)) {
      const b = sys.blessures[key];
      ctx.blessuresAff[key] = {
        label: game.i18n.localize(VERMINE.niveauxBlessure[key].label),
        seuil: b.seuil,
        cercles: b.cercles,
        coches: b.coches,
        dots: Array.from({ length: b.cercles }, (_, i) => ({ index: i, coche: i < b.coches }))
      };
    }

    // Options de niveau pour les <select>.
    ctx.niveauxOptions = Object.entries(VERMINE.niveauxCompetence)
      .map(([key, n]) => ({ key, label: game.i18n.localize(n.label) }));

    // Objets classés par type.
    ctx.armes = this.actor.items.filter(i => i.type === "arme");
    ctx.protections = this.actor.items.filter(i => i.type === "protection");
    ctx.equipements = this.actor.items.filter(i => i.type === "equipement");
    ctx.capacites = this.actor.items.filter(i => i.type === "capacite");

    ctx.enrichedBio = await TextEditor.enrichHTML(sys.biographie ?? "", { async: true });
    ctx.enrichedNotes = await TextEditor.enrichHTML(sys.notes ?? "", { async: true });

    return ctx;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Jets (toujours autorisés, même en lecture seule pour les observateurs propriétaires).
    html.find("[data-roll-carac]").on("click", (ev) => {
      const carac = ev.currentTarget.dataset.rollCarac;
      this.actor.rollAction({ caracteristique: carac });
    });
    html.find("[data-roll-competence]").on("click", (ev) => {
      const comp = ev.currentTarget.dataset.rollCompetence;
      this.actor.rollAction({ competence: comp });
    });

    if (!this.isEditable) return;

    // Cercles de blessure cliquables.
    html.find("[data-blessure]").on("click", (ev) => this._onToggleBlessure(ev));

    // Gestion des objets.
    html.find("[data-item-create]").on("click", (ev) => this._onItemCreate(ev));
    html.find("[data-item-edit]").on("click", (ev) => this._onItemEdit(ev));
    html.find("[data-item-delete]").on("click", (ev) => this._onItemDelete(ev));
  }

  _onToggleBlessure(ev) {
    const el = ev.currentTarget;
    const niveau = el.dataset.blessure;
    const index = Number(el.dataset.index); // 0-based
    const actuel = this.actor.system.blessures[niveau].coches;
    // Clic sur le cercle n : coche jusqu'à n+1 ; re-clic sur le dernier coché : décoche.
    const nouveau = (actuel === index + 1) ? index : index + 1;
    this.actor.update({ [`system.blessures.${niveau}.coches`]: nouveau });
  }

  async _onItemCreate(ev) {
    const type = ev.currentTarget.dataset.itemCreate;
    const name = game.i18n.format("VERMINE.Item.Nouveau", {
      type: game.i18n.localize(`TYPES.Item.${type}`)
    });
    await this.actor.createEmbeddedDocuments("Item", [{ name, type }]);
  }

  _onItemEdit(ev) {
    const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
    this.actor.items.get(id)?.sheet.render(true);
  }

  async _onItemDelete(ev) {
    const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
    await this.actor.deleteEmbeddedDocuments("Item", [id]);
  }

  /** @override — convertit les spécialités saisies en CSV vers des tableaux. */
  async _updateObject(event, formData) {
    for (const key of Object.keys(formData)) {
      if (key.startsWith("spec.")) {
        const compKey = key.slice(5);
        formData[`system.competences.${compKey}.specialites`] =
          String(formData[key] ?? "").split(",").map(s => s.trim()).filter(Boolean);
        delete formData[key];
      }
    }
    return super._updateObject(event, formData);
  }
}
