import { ouvrirDialogueJet } from "../dice/roll-dialog.mjs";

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
}
