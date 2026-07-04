import { VERMINE } from "../config.mjs";

/**
 * Fenêtre d'options du Personnage, séparée de la fiche.
 * Regroupe les réglages qui changent peu : seuils / nombre de cercles de Blessure
 * et Spécialités par compétence.
 */
export class PersonnageOptions extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "personnage-options"],
      template: "systems/vermine2047/templates/actor/personnage-options.hbs",
      width: 500,
      height: 640,
      submitOnChange: true,
      closeOnSubmit: false
    });
  }

  get title() {
    return `${game.i18n.localize("VERMINE.Options.Titre")} — ${this.object.name}`;
  }

  getData() {
    const sys = this.object.system;

    const blessures = Object.keys(VERMINE.niveauxBlessure).map((key) => ({
      key,
      label: game.i18n.localize(VERMINE.niveauxBlessure[key].label),
      seuil: sys.blessures[key].seuil,
      cercles: sys.blessures[key].cercles
    }));

    const domaines = {};
    for (const [dKey, dLabel] of Object.entries(VERMINE.domaines)) {
      domaines[dKey] = { label: game.i18n.localize(dLabel), competences: [] };
    }
    for (const [key, c] of Object.entries(VERMINE.competences)) {
      domaines[c.domaine].competences.push({
        key,
        label: game.i18n.localize(c.label),
        specialites: (sys.competences[key].specialites ?? []).join(", ")
      });
    }

    return { blessures, domaines };
  }

  async _updateObject(event, formData) {
    const data = {};
    for (const [k, v] of Object.entries(formData)) {
      if (k.startsWith("spec.")) {
        data[`system.competences.${k.slice(5)}.specialites`] =
          String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        data[k] = v;
      }
    }
    await this.object.update(data);
  }
}
