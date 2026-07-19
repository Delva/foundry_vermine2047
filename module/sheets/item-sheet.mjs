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
    ctx.isAffliction = this.item.type === "affliction";
    ctx.isRite = this.item.type === "rite";
    ctx.isProfil = this.item.type === "profil";
    ctx.isSpecialite = this.item.type === "specialite";
    ctx.archetypesOptions = Object.entries(VERMINE.archetypes)
      .map(([key, l]) => ({ key, label: game.i18n.localize(l) }));

    ctx.competencesOptions = Object.entries(VERMINE.competences)
      .map(([key, c]) => ({ key, label: game.i18n.localize(c.label) }));
    ctx.typesDommagesOptions = Object.entries(VERMINE.typesDommages)
      .map(([key, d]) => ({ key, label: game.i18n.localize(d.label) }));

    // Traits : liste avec état actif et valeur courante (pour armes/protections).
    if (ctx.isArme || ctx.isProtection) {
      const actifs = this.item.system.traits ?? {};
      ctx.traitsListe = Object.entries(VERMINE.traitsArme).map(([key, t]) => {
        const v = actifs[key];
        return {
          key,
          label: game.i18n.localize(t.label),
          aValeur: t.valeur,
          actif: v !== undefined && v !== false && v !== null,
          valeur: (typeof v === "number") ? v : (t.valeur ? 1 : "")
        };
      });
    }
    ctx.totemsOptions = Object.entries(VERMINE.totems)
      .map(([key, l]) => ({ key, label: game.i18n.localize(l) }));
    ctx.typesCapacite = Object.entries(VERMINE.typesCapacite)
      .map(([key, l]) => ({ key, label: game.i18n.localize(l) }));

    return ctx;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Spécialité : la Description propose « Bonus de 1D aux lancers impliquant
    // <Compétence> » d'après la Compétence choisie. Pré-remplie si vide au premier
    // affichage ; toujours réécrite si l'utilisateur change de Compétence (le texte
    // libre déjà personnalisé n'est donc écrasé qu'en cas de changement délibéré).
    if (this.item.type === "specialite") {
      const root = html[0] ?? html;
      const select = root.querySelector('[name="system.competence"]');
      const texte = root.querySelector('[name="system.description"]');
      const description = () => {
        const competence = select?.options[select.selectedIndex]?.text ?? "";
        return game.i18n.format("VERMINE.Specialite.Description", { competence });
      };
      if (texte && !texte.value.trim()) texte.value = description();
      select?.addEventListener("change", () => { if (texte) texte.value = description(); });
    }
  }

  /** @override — assemble l'objet `system.traits` à partir des champs trait.<clé>.*. */
  async _updateObject(event, formData) {
    if (this.item.type === "arme" || this.item.type === "protection") {
      const traits = {};
      for (const [key, t] of Object.entries(VERMINE.traitsArme)) {
        const actif = formData[`trait.${key}.actif`];
        if (actif) traits[key] = t.valeur ? (Number(formData[`trait.${key}.valeur`]) || 1) : true;
      }
      // Nettoie les champs temporaires et réécrit l'objet complet des traits.
      for (const key of Object.keys(formData)) {
        if (key.startsWith("trait.")) delete formData[key];
      }
      formData["system.traits"] = traits;
    }
    return super._updateObject(event, formData);
  }
}
