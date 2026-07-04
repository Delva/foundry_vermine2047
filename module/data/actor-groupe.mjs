import { VERMINE } from "../config.mjs";

const fields = foundry.data.fields;

/**
 * Le Groupe : entité collective partagée par les personnages.
 * Porte le Totem de Groupe, la Réserve de Groupe (régie par le Moral),
 * le Niveau, les Objectifs et les membres.
 */
export class GroupeData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const totems = Object.keys(VERMINE.totems);
    return {
      totem: new fields.StringField({ required: false, blank: true, choices: totems, initial: "" }),
      // Textes libres, une entrée par ligne.
      instincts: new fields.StringField({ required: false, blank: true, initial: "" }),
      interdits: new fields.StringField({ required: false, blank: true, initial: "" }),

      reserveGroupe: new fields.SchemaField({
        value: new fields.NumberField({ required: true, integer: true, min: 0, initial: 6 }),
        max: new fields.NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),
      // Moral : indicateur qualitatif (bon / neutre / bas).
      moral: new fields.StringField({
        required: true,
        choices: ["bon", "neutre", "bas"],
        initial: "neutre"
      }),

      niveau: new fields.NumberField({ required: true, integer: true, min: 1, max: 5, initial: 1 }),
      reputation: new fields.NumberField({ required: true, integer: true, min: 0, initial: 10 }),

      objectifMajeur: new fields.StringField({ required: false, blank: true, initial: "" }),
      objectifsMineurs: new fields.StringField({ required: false, blank: true, initial: "" }),

      // UUID des acteurs membres (ex. "Actor.xxxxxxxx").
      membres: new fields.ArrayField(new fields.StringField({ blank: false })),

      notes: new fields.HTMLField()
    };
  }
}
