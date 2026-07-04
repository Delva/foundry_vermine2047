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
 * @param {number} opts.relancesCompetence - Relances offertes par la compétence.
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
  const html = await renderCarte(etat, flavor);

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

/** Rend la carte de chat à partir de l'état. */
async function renderCarte(etat, flavor) {
  const { reussites, succes, surplus } = evaluerEtat(etat);

  const des = etat.resultats.map(r => ({ valeur: r, reussite: r >= etat.difficulte }));

  // Relances encore disponibles : compétence (offertes) + Effort (réserve de l'acteur) + Groupe (non géré au MVP).
  const acteur = etat.actorId ? game.actors.get(etat.actorId) : null;
  const effortDispo = acteur?.system?.reserves?.effort?.value ?? 0;

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
    peutRelancerEffort: effortDispo > 0 && des.some(d => !d.reussite),
    relancesCompetence: etat.relancesCompetence,
    effortDispo
  };

  return renderTemplate(CARTE_TEMPLATE, donnees);
}

/**
 * Gestionnaire de clic sur un bouton de Relance dans une carte de chat.
 * Relance le plus petit dé raté, consomme la ressource, puis met à jour le message.
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

  // Trouver l'indice du plus petit dé raté.
  let idxCible = -1;
  let minVal = Infinity;
  etat.resultats.forEach((v, i) => {
    if (v < etat.difficulte && v < minVal) { minVal = v; idxCible = i; }
  });
  if (idxCible === -1) return; // rien à relancer

  const acteur = etat.actorId ? game.actors.get(etat.actorId) : null;

  // Consommer la ressource.
  if (source === "competence") {
    if (etat.relancesCompetence <= 0) return;
    etat.relancesCompetence -= 1;
  } else if (source === "effort") {
    const dispo = acteur?.system?.reserves?.effort?.value ?? 0;
    if (dispo <= 0) return ui.notifications.warn(game.i18n.localize("VERMINE.Jet.EffortInsuffisant"));
    if (acteur) await acteur.update({ "system.reserves.effort.value": dispo - 1 });
  } else {
    return;
  }

  // Relancer le dé.
  const relance = new Roll("1d10");
  await relance.evaluate();
  etat.resultats[idxCible] = relance.dice[0].results[0].result;

  const flavor = construireFlavor(etat);
  const html = await renderCarte(etat, flavor);
  await message.update({ content: html, flags: { vermine2047: etat } });
}
