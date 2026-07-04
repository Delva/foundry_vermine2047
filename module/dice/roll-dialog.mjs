import { VERMINE } from "../config.mjs";
import { rollVermine } from "./vermine-roll.mjs";

const DIALOG_TEMPLATE = "systems/vermine2047/templates/dice/roll-dialog.hbs";

/**
 * Ouvre le dialogue de construction de la Main puis lance le Jet Vermine.
 * @param {Actor} actor
 * @param {object} [preset] - { caracteristique, competence, difficulte, handicap, label }
 */
export async function ouvrirDialogueJet(actor, preset = {}) {
  const sys = actor.system;

  // Caractéristiques disponibles.
  const caracs = Object.entries(VERMINE.caracteristiques).map(([key, c]) => ({
    key,
    label: game.i18n.localize(c.label),
    value: sys.caracteristiques?.[key]?.value ?? 0
  }));

  // Compétences groupées par domaine, avec niveau connu de l'acteur.
  const domaines = {};
  for (const [dKey, dLabel] of Object.entries(VERMINE.domaines)) {
    domaines[dKey] = { label: game.i18n.localize(dLabel), competences: [] };
  }
  for (const [key, c] of Object.entries(VERMINE.competences)) {
    const niveau = sys.competences?.[key]?.niveau ?? "aucun";
    const infoNiveau = VERMINE.niveauxCompetence[niveau];
    domaines[c.domaine].competences.push({
      key,
      label: game.i18n.localize(c.label),
      niveau,
      niveauLabel: game.i18n.localize(infoNiveau.label),
      bonus: infoNiveau.bonus,
      relances: infoNiveau.relances
    });
  }

  const data = {
    caracs,
    domaines,
    difficultes: VERMINE.difficultes,
    caracDefaut: preset.caracteristique ?? "vigueur",
    compDefaut: preset.competence ?? "",
    diffDefaut: preset.difficulte ?? 7,
    handicapDefaut: preset.handicap ?? 0,
    sangFroidDispo: sys.reserves?.sangFroid?.value ?? 0,
    effortDispo: sys.reserves?.effort?.value ?? 0,
    malusBlessure: sys.malusBlessure ?? 0
  };

  const contenu = await renderTemplate(DIALOG_TEMPLATE, data);

  return new Promise((resolve) => {
    const dlg = new Dialog({
      title: `${game.i18n.localize("VERMINE.Jet.Titre")} — ${actor.name}`,
      content: contenu,
      buttons: {
        lancer: {
          icon: '<i class="fas fa-dice-d10"></i>',
          label: game.i18n.localize("VERMINE.Jet.Lancer"),
          callback: async (html) => resolve(await lancerDepuisFormulaire(actor, html, preset))
        },
        annuler: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("VERMINE.Annuler"),
          callback: () => resolve(null)
        }
      },
      default: "lancer",
      render: (html) => activerApercu(html, actor)
    }, { classes: ["vermine2047", "dialog", "jet-dialog"], width: 460 });
    dlg.render(true);
  });
}

/** Calcule la taille de la Main à partir du formulaire (pour l'aperçu et le lancer). */
function lireComposants(actor, html) {
  const root = html[0] ?? html;
  const val = (sel) => root.querySelector(sel);

  const caracKey = val('[name="caracteristique"]').value;
  const competenceKey = val('[name="competence"]').value;
  const difficulte = Number(val('[name="difficulte"]').value);
  const handicap = Number(val('[name="handicap"]').value);
  const sangFroid = Math.max(0, Number(val('[name="sangFroid"]').value) || 0);
  const materiel = val('[name="materiel"]').checked ? 1 : 0;
  const entraide = Math.max(0, Number(val('[name="entraide"]').value) || 0);
  const specialite = val('[name="specialite"]').checked ? 1 : 0;

  const caracVal = actor.system.caracteristiques?.[caracKey]?.value ?? 0;

  // Bonus de compétence.
  let bonusComp = 0;
  let relancesCompetence = 0;
  if (competenceKey) {
    const niveau = actor.system.competences?.[competenceKey]?.niveau ?? "aucun";
    const info = VERMINE.niveauxCompetence[niveau];
    bonusComp = info.bonus;
    relancesCompetence = info.relances;
  }

  // Plafond du Sang-Froid = valeur de la Caractéristique (et réserve disponible).
  const sfDispo = actor.system.reserves?.sangFroid?.value ?? 0;
  const sangFroidUtilise = Math.min(sangFroid, caracVal, sfDispo);

  // Malus de blessure (retire des dés, minimum 0).
  const malus = actor.system.malusBlessure ?? 0;

  const composants = {
    carac: caracVal,
    competence: bonusComp,
    specialite,
    materiel,
    entraide,
    sangFroid: sangFroidUtilise,
    malus: -malus
  };

  return { caracKey, competenceKey, difficulte, handicap, composants, relancesCompetence, sangFroidUtilise };
}

/** Met en place l'aperçu dynamique de la taille de Main. */
function activerApercu(html, actor) {
  const root = html[0] ?? html;
  const apercu = root.querySelector(".apercu-main");
  const maj = () => {
    const { composants } = lireComposants(actor, html);
    const total = Math.max(0, Object.values(composants).reduce((s, n) => s + n, 0));
    if (apercu) apercu.textContent = String(total);
  };
  root.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("change", maj);
    el.addEventListener("keyup", maj);
  });
  maj();
}

/** Exécute le jet après validation du formulaire. */
async function lancerDepuisFormulaire(actor, html, preset) {
  const { caracKey, competenceKey, difficulte, handicap, composants, relancesCompetence, sangFroidUtilise } =
    lireComposants(actor, html);

  // La valeur "malus" est stockée en négatif ; on borne la Main à >= 0 dans le moteur.
  // On dépense réellement le Sang-Froid.
  if (sangFroidUtilise > 0) {
    const cur = actor.system.reserves.sangFroid.value;
    await actor.update({ "system.reserves.sangFroid.value": Math.max(0, cur - sangFroidUtilise) });
  }

  return rollVermine({
    actor, caracKey, competenceKey, difficulte, handicap,
    composants, relancesCompetence, label: preset.label ?? ""
  });
}
