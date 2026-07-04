import { VERMINE } from "../config.mjs";
import { PersonnageOptions } from "../apps/personnage-options.mjs";

/** Fiche du Personnage joueur. */
export class PersonnageSheet extends ActorSheet {
  /** @override — ajoute un bouton « Options » dans la barre de titre. */
  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    if (this.isEditable) {
      buttons.unshift({
        label: game.i18n.localize("VERMINE.Options.Titre"),
        class: "vermine-options",
        icon: "fas fa-sliders",
        onclick: () => new PersonnageOptions(this.actor).render(true)
      });
    }
    return buttons;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "actor", "personnage"],
      template: "systems/vermine2047/templates/actor/personnage-sheet.hbs",
      width: 740,
      height: 800,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "feuille" }]
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
    const MAX_CARAC = 5;
    for (const [key, c] of Object.entries(VERMINE.caracteristiques)) {
      const value = sys.caracteristiques[key].value;
      ctx.groupes[c.groupe].caracs.push({
        key,
        label: game.i18n.localize(c.label),
        value,
        pips: Array.from({ length: MAX_CARAC }, (_, i) => ({ pos: i + 1, on: i < value }))
      });
    }

    // Réserves affichées en pips (0 → max dérivé).
    ctx.reservesAff = {};
    for (const rKey of Object.keys(VERMINE.reserves)) {
      const r = sys.reserves[rKey];
      const max = r.max ?? 0;
      ctx.reservesAff[rKey] = {
        label: game.i18n.localize(`VERMINE.Reserve.${rKey}`),
        value: r.value,
        max,
        pips: Array.from({ length: max }, (_, i) => ({ pos: i + 1, on: i < r.value }))
      };
    }

    // Sous-titre latéral (mode · totem).
    ctx.modeLabel = game.i18n.localize(VERMINE.modes[sys.mode] ?? "");
    ctx.totemLabel = sys.totem ? game.i18n.localize(VERMINE.totems[sys.totem]) : "";

    // Niveaux affichés en pips (Débutant → Légende ; on exclut "Aucun").
    // Un niveau qui octroie une Relance supplémentaire est marqué "relance" (croix ✕),
    // sinon "bonus" (dé, cercle plein) — à la manière de la fiche officielle.
    const niveauxTri = Object.entries(VERMINE.niveauxCompetence)
      .filter(([, n]) => n.ordre >= 1)
      .sort((a, b) => a[1].ordre - b[1].ordre);
    let prevRelances = 0;
    const kindsByOrdre = [];
    const pipLevels = niveauxTri.map(([key, n]) => {
      const kind = n.relances > prevRelances ? "relance" : "bonus";
      prevRelances = n.relances;
      kindsByOrdre[n.ordre - 1] = kind;
      return { key, ordre: n.ordre, label: game.i18n.localize(n.label), kind };
    });
    for (const l of pipLevels) l.pipsDemo = kindsByOrdre.slice(0, l.ordre).map((k) => ({ kind: k }));
    ctx.pipLevels = pipLevels;

    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

    // Compétences regroupées par domaine.
    ctx.domaines = {};
    for (const [dKey, dLabel] of Object.entries(VERMINE.domaines)) {
      ctx.domaines[dKey] = { label: game.i18n.localize(dLabel), competences: [] };
    }
    for (const [key, c] of Object.entries(VERMINE.competences)) {
      const comp = sys.competences[key];
      const niveauOrdre = VERMINE.niveauxCompetence[comp.niveau]?.ordre ?? 0;
      const label = game.i18n.localize(c.label);
      ctx.domaines[c.domaine].competences.push({
        key,
        label,
        search: norm(label),
        rarete: c.rarete,
        niveau: comp.niveau,
        niveauLabel: game.i18n.localize(VERMINE.niveauxCompetence[comp.niveau].label),
        niveauOrdre,
        specialites: comp.specialites ?? [],
        pips: pipLevels.map((l) => ({
          compKey: key, niveauKey: l.key, ordre: l.ordre, label: l.label, kind: l.kind, on: l.ordre <= niveauOrdre
        }))
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

    // Objets classés par type.
    ctx.armes = this.actor.items.filter(i => i.type === "arme");
    ctx.protections = this.actor.items.filter(i => i.type === "protection");
    ctx.equipements = this.actor.items.filter(i => i.type === "equipement");
    ctx.capacites = this.actor.items.filter(i => i.type === "capacite");
    ctx.adaptations = this.actor.items.filter(i => i.type === "adaptation");
    ctx.traumatismes = this.actor.items.filter(i => i.type === "traumatisme");
    ctx.historiques = this.actor.items.filter(i => i.type === "historique");
    ctx.afflictions = this.actor.items.filter(i => i.type === "affliction");

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

    // Recherche de compétences (filtre en temps réel, même en lecture seule).
    html.find(".comp-search").on("input", (ev) => this._onSearchCompetence(ev, html));

    if (!this.isEditable) return;

    // Cercles de blessure cliquables.
    html.find("[data-blessure]").on("click", (ev) => this._onToggleBlessure(ev));

    // Niveau de compétence via pips cliquables.
    html.find(".comp-pip").on("click", (ev) => this._onTogglePip(ev));

    // Valeurs (Caractéristiques, Réserves) via pips cliquables.
    html.find(".value-pip").on("click", (ev) => this._onValuePip(ev));

    // Gestion des objets.
    html.find("[data-item-create]").on("click", (ev) => this._onItemCreate(ev));
    html.find("[data-item-edit]").on("click", (ev) => this._onItemEdit(ev));
    html.find("[data-item-delete]").on("click", (ev) => this._onItemDelete(ev));
  }

  /** Clic sur un pip : fixe le niveau ; re-clic sur le niveau courant = retour à « Aucun ». */
  _onTogglePip(ev) {
    const el = ev.currentTarget;
    const comp = el.dataset.comp;
    const ordre = Number(el.dataset.ordre);
    const niveauActuel = this.actor.system.competences[comp].niveau;
    const ordreActuel = CONFIG.VERMINE.niveauxCompetence[niveauActuel]?.ordre ?? 0;
    const nouveau = (ordre === ordreActuel) ? "aucun" : el.dataset.niveau;
    this.actor.update({ [`system.competences.${comp}.niveau`]: nouveau });
  }

  /** Clic sur un pip de valeur (Caractéristique / Réserve) : fixe la valeur ; re-clic = décrémente. */
  _onValuePip(ev) {
    const el = ev.currentTarget;
    const path = el.dataset.target;      // ex. system.caracteristiques.vigueur.value
    const pos = Number(el.dataset.pos);
    const current = foundry.utils.getProperty(this.actor, path) ?? 0;
    const nouveau = (pos === current) ? pos - 1 : pos;
    this.actor.update({ [path]: Math.max(0, nouveau) });
  }

  /** Filtre les compétences affichées selon la recherche (insensible à la casse et aux accents). */
  _onSearchCompetence(ev, html) {
    const q = ev.currentTarget.value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const root = html[0] ?? html;
    root.querySelectorAll(".competence-ligne").forEach((row) => {
      const match = !q || (row.dataset.compLabel ?? "").includes(q);
      row.style.display = match ? "" : "none";
    });
    // Masque les domaines sans résultat.
    root.querySelectorAll(".domaine").forEach((dom) => {
      const visible = [...dom.querySelectorAll(".competence-ligne")].some((r) => r.style.display !== "none");
      dom.style.display = visible ? "" : "none";
    });
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
