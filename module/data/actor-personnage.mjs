import { VERMINE } from "../config.mjs";

const fields = foundry.data.fields;

/**
 * Construit le schéma des 8 Caractéristiques.
 * Chaque caractéristique = valeur en D (0 à 5 ; humains 1 à 3).
 */
function caracteristiquesSchema() {
  const schema = {};
  for (const key of Object.keys(VERMINE.caracteristiques)) {
    schema[key] = new fields.SchemaField({
      value: new fields.NumberField({ required: true, integer: true, min: 0, max: 5, initial: 1 })
    });
  }
  return new fields.SchemaField(schema);
}

/** Construit le schéma des 30 Compétences (niveau + spécialités). */
function competencesSchema() {
  const schema = {};
  const niveaux = Object.keys(VERMINE.niveauxCompetence);
  for (const key of Object.keys(VERMINE.competences)) {
    schema[key] = new fields.SchemaField({
      niveau: new fields.StringField({ required: true, choices: niveaux, initial: "aucun" }),
      specialites: new fields.ArrayField(new fields.StringField({ blank: false }))
    });
  }
  return new fields.SchemaField(schema);
}

/** Schéma d'une Réserve (Sang-Froid ou Effort). */
function reserveSchema() {
  return new fields.SchemaField({
    value: new fields.NumberField({ required: true, integer: true, min: 0, initial: 8 }),
    bonusMax: new fields.NumberField({ required: true, integer: true, initial: 0 })
    // max est dérivé dans prepareDerivedData (base issue des Caractéristiques + âge + bonusMax)
  });
}

/** Schéma d'un niveau de Blessure. */
function blessureSchema(initSeuil, initCercles) {
  return new fields.SchemaField({
    seuil: new fields.NumberField({ required: true, integer: true, min: 1, max: 10, initial: initSeuil }),
    cercles: new fields.NumberField({ required: true, integer: true, min: 0, initial: initCercles }),
    coches: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 })
  });
}

export class PersonnageData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const niveauxAge = Object.keys(VERMINE.ages);
    const modes = Object.keys(VERMINE.modes);
    const totems = Object.keys(VERMINE.totems);
    const domaines = Object.keys(VERMINE.domaines);

    return {
      caracteristiques: caracteristiquesSchema(),
      competences: competencesSchema(),
      reserves: new fields.SchemaField({
        sangFroid: reserveSchema(),
        effort: reserveSchema()
      }),
      blessures: new fields.SchemaField({
        legere: blessureSchema(2, 3),
        grave: blessureSchema(6, 1),
        mortelle: blessureSchema(9, 1)
      }),
      reputation: new fields.NumberField({ required: true, integer: true, min: 0, initial: 10 }),
      xp: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      age: new fields.StringField({ required: true, choices: niveauxAge, initial: "adulte" }),
      mode: new fields.StringField({ required: true, choices: modes, initial: "survie" }),
      totem: new fields.StringField({ required: false, blank: true, choices: totems, initial: "" }),
      domainePredilection: new fields.StringField({ required: false, blank: true, choices: domaines, initial: "" }),
      chaman: new fields.BooleanField({ initial: false }),
      biographie: new fields.HTMLField(),
      notes: new fields.HTMLField()
    };
  }

  /** Dérivations : base des Réserves (somme des caractéristiques ± âge) et Malus de blessure. */
  prepareDerivedData() {
    const carac = this.caracteristiques;

    // Réserves : base = somme des caractéristiques du groupe + modificateur d'âge.
    const modAge = VERMINE.ages[this.age]?.modReserve ?? 0;
    for (const [rKey, caracKeys] of Object.entries(VERMINE.reserves)) {
      const base = caracKeys.reduce((sum, c) => sum + (carac[c]?.value ?? 0), 0);
      const res = this.reserves[rKey];
      res.base = base;
      res.max = Math.max(0, base + modAge + (res.bonusMax ?? 0));
      // On borne la valeur courante au maximum.
      if (res.value > res.max) res.value = res.max;
    }

    // Malus de blessure : seul le niveau le plus grave coché s'applique.
    let malus = 0;
    for (const key of ["mortelle", "grave", "legere"]) {
      if ((this.blessures[key]?.coches ?? 0) > 0) {
        malus = VERMINE.niveauxBlessure[key].malus;
        break;
      }
    }
    this.malusBlessure = malus;
  }

  /** Données exposées aux formules de jet. */
  getRollData() {
    const data = {};
    for (const [key, c] of Object.entries(this.caracteristiques)) {
      data[key] = c.value;
    }
    data.malusBlessure = this.malusBlessure ?? 0;
    return data;
  }
}
