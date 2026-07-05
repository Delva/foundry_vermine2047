import { VERMINE } from "../config.mjs";
import { PersonnageOptions } from "../apps/personnage-options.mjs";
import { ajouterObjet } from "../apps/compendium-picker.mjs";

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
    // Vues d'objets (avec description enrichie, pour l'affichage dépliable).
    const vm = async (type) => {
      const list = this.actor.items.filter(i => i.type === type);
      return Promise.all(list.map(async (i) => ({
        id: i.id, name: i.name, img: i.img, type: i.type, system: i.system,
        isArme: i.type === "arme", isProtection: i.type === "protection",
        enrichedDesc: await TextEditor.enrichHTML(i.system.description ?? "", { async: true })
      })));
    };
    ctx.armes = await vm("arme");
    ctx.protections = await vm("protection");
    ctx.equipements = await vm("equipement");
    ctx.capacites = await vm("capacite");
    ctx.adaptations = await vm("adaptation");
    ctx.traumatismes = await vm("traumatisme");
    ctx.historiques = await vm("historique");
    ctx.afflictions = await vm("affliction");
    ctx.rites = await vm("rite");
    ctx.profils = await vm("profil");

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

    // Déplier/replier le détail d'un objet.
    html.find("[data-item-toggle]").on("click", (ev) => {
      const details = ev.currentTarget.closest(".objet").querySelector(".objet-details");
      if (details) details.hidden = !details.hidden;
    });

    // Armes : attaque et dégâts.
    html.find("[data-item-attaque]").on("click", (ev) => this._onAttaque(ev));
    html.find("[data-item-degats]").on("click", (ev) => this._onDegats(ev));

    // Usure : dégrader / réparer la Fiabilité.
    html.find("[data-fiab-delta]").on("click", (ev) => this._onFiabilite(ev));
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
    await ajouterObjet(this.actor, type);
  }

  _onItemEdit(ev) {
    const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
    this.actor.items.get(id)?.sheet.render(true);
  }

  async _onItemDelete(ev) {
    const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
    await this.actor.deleteEmbeddedDocuments("Item", [id]);
  }

  /** Attaque avec une arme : ouvre le Jet Vermine préréglé (Caractéristique + Compétence de l'arme). */
  _onAttaque(ev) {
    const item = this.actor.items.get(ev.currentTarget.closest("[data-item-id]").dataset.itemId);
    if (!item) return;
    const comp = item.system.competence;
    const carac = ["melee", "corpsACorps"].includes(comp) ? "vigueur" : "precision";
    this.actor.rollAction({ caracteristique: carac, competence: comp, label: item.name });
  }

  /** Lance les Dommages d'une arme : Dommages = base (+ Vigueur) + Réussites de l'attaque. */
  _onDegats(ev) {
    const item = this.actor.items.get(ev.currentTarget.closest("[data-item-id]").dataset.itemId);
    if (!item) return;
    const sys = item.system;
    const vig = this.actor.system.caracteristiques.vigueur.value;
    const base = (sys.degats ?? 0) + (sys.degatsVigueur ? vig : 0);
    const code = CONFIG.VERMINE.typesDommages[sys.typeDommages]?.code ?? "";

    const content = `<p>${game.i18n.localize("VERMINE.Degats.Base")} : <strong>${sys.labelDommages}</strong>${sys.degatsVigueur ? ` (Vigueur ${vig})` : ""}</p>
      <div class="form-group"><label>${game.i18n.localize("VERMINE.Degats.Reussites")}</label>
      <input type="number" name="reussites" value="0" min="0" autofocus /></div>`;

    new Dialog({
      title: `${game.i18n.localize("VERMINE.Item.Degats")} — ${item.name}`,
      content,
      buttons: {
        ok: {
          icon: '<i class="fas fa-burst"></i>',
          label: game.i18n.localize("VERMINE.Degats.Lancer"),
          callback: (html) => {
            const r = Math.max(0, Number((html[0] ?? html).querySelector('[name="reussites"]').value) || 0);
            const total = Math.max(0, base + r);
            ChatMessage.create({
              speaker: ChatMessage.getSpeaker({ actor: this.actor }),
              content: `<div class="vermine-degats-card"><header>${item.name}</header>
                <div class="ligne"><span class="lbl">${game.i18n.localize("VERMINE.Degats.Total")}</span>
                <span class="total">${total}</span> <span class="type">(${code})</span></div>
                <div class="detail">${base} (${game.i18n.localize("VERMINE.Degats.Base")}) + ${r} ${game.i18n.localize("VERMINE.Jet.Reussites")}</div></div>`
            });
          }
        },
        annuler: { icon: '<i class="fas fa-times"></i>', label: game.i18n.localize("VERMINE.Annuler") }
      },
      default: "ok"
    }, { classes: ["vermine2047", "dialog"] }).render(true);
  }

  /** Usure : dégrade ou répare la Fiabilité d'un objet (borne 0..fiabiliteMax). */
  async _onFiabilite(ev) {
    const delta = Number(ev.currentTarget.dataset.fiabDelta);
    const item = this.actor.items.get(ev.currentTarget.closest("[data-item-id]").dataset.itemId);
    if (!item) return;
    const max = item.system.fiabiliteMax ?? item.system.fiabilite ?? 0;
    const nv = Math.clamp((item.system.fiabilite ?? 0) + delta, 0, max);
    await item.update({ "system.fiabilite": nv });
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
