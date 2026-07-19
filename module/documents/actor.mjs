import { ouvrirDialogueJet, ouvrirDialogueJetSimple } from "../dice/roll-dialog.mjs";

/**
 * Classe Acteur du système Vermine 2047.
 */
export class VermineActor extends Actor {
  /** @override */
  getRollData() {
    const data = { ...super.getRollData() };
    if (this.system.getRollData instanceof Function) {
      Object.assign(data, this.system.getRollData());
    }
    return data;
  }

  /**
   * Ouvre le dialogue de Jet Vermine, éventuellement pré-rempli.
   * @param {object} [preset] - { caracteristique, competence, difficulte }
   */
  async rollAction(preset = {}) {
    return ouvrirDialogueJet(this, preset);
  }

  /**
   * Ouvre le dialogue de Jet simplifié (nombre de dés fixe contre une Difficulté),
   * sans Caractéristique/Compétence ni Réserves. Utilisé par les Créatures/PNJ.
   * @param {object} [preset] - { nbDes, difficulte, label }
   */
  async rollSimple(preset = {}) {
    return ouvrirDialogueJetSimple(this, preset);
  }
}
