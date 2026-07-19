import { VERMINE } from "../config.mjs";

const CARTE_TEMPLATE = "systems/vermine2047/templates/dice/roll-card.hbs";

/**
 * Exécute un Jet Vermine : lance une Main de d10 et compte les Réussites (dé ≥ Difficulté).
 *
 * @param {object} opts
 * @param {Actor}  opts.actor
 * @param {string} [opts.caracKey]        - Clé de caractéristique.
 * @param {string} [opts.competenceKey]   - Clé de compétence ("" si aucune).
 * @param {number} opts.difficulte        - Difficulté (3 à 10).
 * @param {number} [opts.handicap=0]       - Degré de Handicap (0 à 5). Réussites requises = 1 + handicap.
 * @param {object} opts.composants        - Détail de la Main { carac, competence, specialite, materiel, entraide, sangFroid, groupe }.
 * @param {number} opts.relancesCompetence - Nombre de dés relançables d'un coup (Compétence ou Créature).
 * @param {string} [opts.label]           - Libellé du jet.
 * @returns {Promise<ChatMessage>}
 */
export async function rollVermine(opts) {
  const {
    actor, caracKey = "", competenceKey = "",
    difficulte, handicap = 0, composants, relancesCompetence = 0, label = ""
  } = opts;

  const mainSize = Object.values(composants).reduce((s, n) => s + (Number(n) || 0), 0);

  // Une Main vide (0 dé) = Échec automatique.
  let resultats = [];
  if (mainSize > 0) {
    const roll = new Roll(`${mainSize}d10`);
    await roll.evaluate();
    resultats = roll.dice[0].results.map(r => r.result);
  }

  const etat = {
    actorId: actor?.id ?? null,
    caracKey, competenceKey,
    difficulte, handicap,
    requises: 1 + handicap,
    composants,
    mainSize,
    resultats,
    relancesCompetence,
    label
  };

  const flavor = construireFlavor(etat);
  const html = await renderCarte(etat, flavor, actor);

  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: html,
    flags: { vermine2047: etat },
    // Le son de dé standard, pour l'immersion.
    sound: CONFIG.sounds.dice
  });
}

/** Construit le libellé lisible du jet (Caractéristique + Compétence). */
function construireFlavor(etat) {
  const parts = [];
  if (etat.caracKey && VERMINE.caracteristiques[etat.caracKey]) {
    parts.push(game.i18n.localize(VERMINE.caracteristiques[etat.caracKey].label));
  }
  if (etat.competenceKey && VERMINE.competences[etat.competenceKey]) {
    parts.push(game.i18n.localize(VERMINE.competences[etat.competenceKey].label));
  }
  const base = parts.join(" + ");
  return etat.label ? (base ? `${etat.label} — ${base}` : etat.label) : base;
}

/** Calcule le nombre de Réussites et l'issue à partir de l'état courant. */
function evaluerEtat(etat) {
  const reussites = etat.resultats.filter(r => r >= etat.difficulte).length;
  return {
    reussites,
    succes: reussites >= etat.requises,
    surplus: Math.max(0, reussites - etat.requises)
  };
}

/**
 * Rend la carte de chat à partir de l'état.
 * @param {object} etat
 * @param {string} flavor
 * @param {Actor} [acteur] - Acteur réel ayant fait le jet (résolu via le speaker du
 *   message pour les relances, afin de gérer correctement les jetons non liés — un
 *   simple game.actors.get(id) renvoie l'acteur du monde, pas les données du jeton).
 */
async function renderCarte(etat, flavor, acteur = null) {
  const { reussites, succes, surplus } = evaluerEtat(etat);

  const des = etat.resultats.map(r => ({ valeur: r, reussite: r >= etat.difficulte }));

  // Relances encore disponibles : compétence (offertes) + Effort (réserve de l'acteur) + Groupe (non géré au MVP).
  acteur ??= etat.actorId ? game.actors.get(etat.actorId) : null;
  const effortDispo = acteur?.system?.reserves?.effort?.value ?? 0;
  // Plafond du nombre de dés relançables à l'Effort : la Caractéristique utilisée (même règle que le Sang-Froid).
  const caracVal = acteur?.system?.caracteristiques?.[etat.caracKey]?.value ?? 0;

  const donnees = {
    etat,
    flavor,
    des,
    reussites,
    requises: etat.requises,
    succes,
    surplus,
    mainVide: etat.mainSize === 0,
    peutRelancerCompetence: etat.relancesCompetence > 0 && des.some(d => !d.reussite),
    peutRelancerEffort: !etat.effortRelanceUtilisee && effortDispo > 0 && caracVal > 0 && des.some(d => !d.reussite),
    relancesCompetence: etat.relancesCompetence,
    effortDispo
  };

  return renderTemplate(CARTE_TEMPLATE, donnees);
}

/** Relance les `nb` dés ratés les plus faibles (mutate etat.resultats). */
async function relancerDes(etat, nb) {
  const cibles = etat.resultats
    .map((v, i) => i)
    .filter(i => etat.resultats[i] < etat.difficulte)
    .sort((a, b) => etat.resultats[a] - etat.resultats[b])
    .slice(0, nb);
  for (const idx of cibles) {
    const relance = new Roll("1d10");
    await relance.evaluate();
    etat.resultats[idx] = relance.dice[0].results[0].result;
  }
}

/** Dialogue de choix du nombre de dés à relancer avec la Réserve d'Effort (1 à max). Renvoie 0 si annulé. */
function demanderNombreDesEffort(max) {
  return new Promise((resolve) => {
    const content = `<p class="notes">${game.i18n.localize("VERMINE.Jet.NombreDes")}</p>`;
    let resolved = false;
    // Un bouton d'action par possibilité valide (1D … maxD).
    const buttons = {};
    for (let i = 1; i <= max; i++) {
      buttons[`d${i}`] = {
        icon: '<i class="fas fa-dice"></i>',
        label: `${i}D`,
        callback: () => { resolved = true; resolve(i); }
      };
    }
    buttons.annuler = {
      icon: '<i class="fas fa-times"></i>',
      label: game.i18n.localize("VERMINE.Annuler"),
      callback: () => { resolved = true; resolve(0); }
    };
    new Dialog({
      title: game.i18n.localize("VERMINE.Jet.RelanceEffort"),
      content,
      buttons,
      default: `d${max}`,
      close: () => { if (!resolved) resolve(0); }
    }, { classes: ["vermine2047", "dialog"] }).render(true);
  });
}

/**
 * Gestionnaire de clic sur un bouton de Relance dans une carte de chat.
 * Compétence : relance 1 dé par clic, tant que des relances sont offertes.
 * Effort : usage unique par jet — demande le nombre de dés à relancer (borné par la
 * Réserve disponible et le nombre de dés ratés), les relance tous ensemble.
 */
export async function onRelance(event) {
  event.preventDefault();
  const bouton = event.currentTarget;
  const source = bouton.dataset.source; // "competence" | "effort"
  const messageId = bouton.closest("[data-message-id]")?.dataset.messageId;
  const message = game.messages.get(messageId);
  if (!message) return;

  const etat = foundry.utils.deepClone(message.flags?.vermine2047);
  if (!etat) return;

  // Seul l'auteur du message ou le MJ peut relancer.
  if (!game.user.isGM && message.author?.id !== game.user.id) {
    return ui.notifications.warn(game.i18n.localize("VERMINE.Jet.RelanceInterdite"));
  }

  const nbRates = etat.resultats.filter(v => v < etat.difficulte).length;
  if (nbRates === 0) return; // rien à relancer

  // Résolu via le speaker du message (gère les jetons non liés) plutôt que
  // game.actors.get(etat.actorId), qui renverrait toujours l'acteur du monde.
  const acteur = ChatMessage.getSpeakerActor(message.speaker) ?? (etat.actorId ? game.actors.get(etat.actorId) : null);

  if (source === "competence") {
    if (etat.relancesCompetence <= 0) return;
    // relancesCompetence est un nombre de dés à relancer (pas un nombre de clics) :
    // un seul clic consomme tout le pool d'un coup (usage unique par jet).
    const nb = Math.min(etat.relancesCompetence, nbRates);
    etat.relancesCompetence = 0;
    await relancerDes(etat, nb);
  } else if (source === "effort") {
    if (etat.effortRelanceUtilisee) return; // usage unique par jet
    const dispo = acteur?.system?.reserves?.effort?.value ?? 0;
    if (dispo <= 0) return ui.notifications.warn(game.i18n.localize("VERMINE.Jet.EffortInsuffisant"));

    // Plafonné par la Réserve disponible, les dés ratés, et la Caractéristique utilisée
    // (même règle que le Sang-Froid dépensé en amont dans la Main, cf. roll-dialog.mjs).
    const caracVal = acteur?.system?.caracteristiques?.[etat.caracKey]?.value ?? 0;
    const max = Math.min(dispo, nbRates, caracVal);
    if (max <= 0) return ui.notifications.warn(game.i18n.localize("VERMINE.Jet.EffortInsuffisant"));
    const nb = await demanderNombreDesEffort(max);
    if (!nb) return; // annulé

    if (acteur) await acteur.update({ "system.reserves.effort.value": dispo - nb });
    etat.effortRelanceUtilisee = true;
    await relancerDes(etat, nb);
  } else {
    return;
  }

  const flavor = construireFlavor(etat);
  const html = await renderCarte(etat, flavor, acteur);
  await message.update({ content: html, flags: { vermine2047: etat } });
}
