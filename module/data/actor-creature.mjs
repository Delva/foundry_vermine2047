const fields = foundry.data.fields;

function blessureSchema(initSeuil, initCercles) {
  return new fields.SchemaField({
    seuil: new fields.NumberField({ required: true, integer: true, min: 1, max: 10, initial: initSeuil }),
    cercles: new fields.NumberField({ required: true, integer: true, min: 0, initial: initCercles }),
    coches: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 })
  });
}

export class CreatureData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      gabarit: new fields.StringField({ required: false, blank: true, initial: "" }),
      taille: new fields.NumberField({ required: true, integer: true, min: 0, max: 3, initial: 1 }),
      // Certaines créatures utilisent des valeurs d'Action fixes (sans jet).
      valeursAction: new fields.StringField({ required: false, blank: true, initial: "" }),
      reaction: new fields.StringField({ required: false, blank: true, initial: "" }),
      attaque: new fields.StringField({ required: false, blank: true, initial: "" }),
      dommages: new fields.StringField({ required: false, blank: true, initial: "" }),
      protection: new fields.StringField({ required: false, blank: true, initial: "" }),
      // Réserve libre (pas de mécanique associée, simple compteur numérique).
      reserve: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      // Nombre de Relances offertes sur le Jet simplifié (même mécanique que les Relances de Compétence).
      relances: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      blessures: new fields.SchemaField({
        legere: blessureSchema(2, 3),
        grave: blessureSchema(6, 1),
        mortelle: blessureSchema(9, 1)
      }),
      // Réserves optionnelles (les créatures simples n'en ont pas).
      reserves: new fields.SchemaField({
        sangFroid: new fields.SchemaField({
          value: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
          max: new fields.NumberField({ integer: true, min: 0, initial: 0 })
        }),
        effort: new fields.SchemaField({
          value: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
          max: new fields.NumberField({ integer: true, min: 0, initial: 0 })
        })
      }),
      niveau: new fields.NumberField({ required: true, integer: true, min: 1, max: 3, initial: 1 }),
      type: new fields.StringField({ required: false, blank: true, initial: "" }),
      notes: new fields.HTMLField()
    };
  }
}
