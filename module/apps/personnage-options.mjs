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

    const reserves = Object.keys(VERMINE.reserves).map((key) => ({
      key,
      label: game.i18n.localize(`VERMINE.Reserve.${key}`),
      value: sys.reserves[key].value,
      max: sys.reserves[key].max
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

    return { blessures, reserves, domaines };
  }

  /** @override — branche le bouton de recalcul des plafonds de Réserve. */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".recalc-reserves").on("click", () => this._recalculerReserves());
  }

  /**
   * (Re)calcule le max de chaque Réserve depuis les Caractéristiques courantes :
   * somme des Caractéristiques du groupe + modificateur d'âge, borné à 0..10.
   * À utiliser à la création ; ensuite le max se monte librement via l'XP.
   */
  async _recalculerReserves() {
    const sys = this.object.system;
    const modAge = VERMINE.ages[sys.age]?.modReserve ?? 0;
    const data = {};
    for (const [rKey, caracKeys] of Object.entries(VERMINE.reserves)) {
      const base = caracKeys.reduce((sum, c) => sum + (sys.caracteristiques?.[c]?.value ?? 0), 0);
      data[`system.reserves.${rKey}.max`] = Math.max(0, Math.min(10, base + modAge));
    }
    await this.object.update(data);
    this.render();
  }

  async _updateObject(event, formData) {
    const data = {};
    for (const [k, v] of Object.entries(formData)) {
      if (k.startsWith("spec.")) {
        data[`system.competences.${k.slice(5)}.specialites`] =
          String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      } else if (k.endsWith(".max") && (v === null || v === "" || Number.isNaN(Number(v)))) {
        // Champ de plafond de Réserve vidé : on ne l'écrase pas à 0.
        continue;
      } else {
        data[k] = v;
      }
    }
    await this.object.update(data);
  }
}
