import { VERMINE } from "../config.mjs";

const fields = foundry.data.fields;

/** Champs communs à tous les objets. */
function communs() {
  return {
    description: new fields.HTMLField(),
    rarete: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
    quantite: new fields.NumberField({ required: true, integer: true, min: 0, initial: 1 })
  };
}

/** Arme (mêlée, tir, feu, lancer). Dommages, portées, traits. */
export class ArmeData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const competences = Object.keys(VERMINE.competences);
    const traits = Object.keys(VERMINE.traitsArme);
    return {
      ...communs(),
      // Dommages de base (ex. "3", "Vigueur+1", "2 (L)"). Chaîne libre au MVP.
      dommages: new fields.StringField({ required: false, blank: true, initial: "" }),
      // Compétence utilisée pour attaquer avec cette arme.
      competence: new fields.StringField({ required: false, blank: true, choices: competences, initial: "melee" }),
      portees: new fields.StringField({ required: false, blank: true, initial: "" }),
      fiabilite: new fields.NumberField({ required: false, integer: true, min: 0, initial: 0 }),
      // Protection conférée (boucliers).
      protection: new fields.NumberField({ required: false, integer: true, min: 0, initial: 0 }),
      // Traits actifs et leur valeur éventuelle (ex. { rafale: 2 }).
      traits: new fields.ObjectField({ initial: {} }),
      _traitsDispo: new fields.StringField({ required: false, blank: true, initial: traits.join(",") })
    };
  }
}

/** Protection / armure. */
export class ProtectionData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...communs(),
      // Indice de Protection (ex. "3" ou "3/5" pour physique/perforant).
      indice: new fields.StringField({ required: false, blank: true, initial: "" }),
      zones: new fields.StringField({ required: false, blank: true, initial: "" }),
      handicapMobilite: new fields.NumberField({ required: true, integer: true, min: 0, max: 3, initial: 0 }),
      equipee: new fields.BooleanField({ initial: false })
    };
  }
}

/** Équipement générique. */
export class EquipementData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...communs(),
      poids: new fields.NumberField({ required: false, min: 0, initial: 0 })
    };
  }
}

/** Adaptation ou Mutation (Dés d'Évolution). */
export class AdaptationData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      // "adaptation" (1D/2D) ou "mutation" (3D/4D).
      categorie: new fields.StringField({ required: true, choices: ["adaptation", "mutation"], initial: "adaptation" }),
      // Coût en Dés d'Évolution (1 à 4).
      cout: new fields.NumberField({ required: true, integer: true, min: 1, max: 4, initial: 1 })
    };
  }
}

/** Traumatisme (faiblesse héritée du passé). */
export class TraumatismeData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      categorie: new fields.StringField({ required: true, choices: ["physique", "psychologique"], initial: "physique" })
    };
  }
}

/** Élément d'Historique. */
export class HistoriqueData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      // Coût en points (les Historiques marqués d'un astérisque coûtent 2).
      cout: new fields.NumberField({ required: true, integer: true, min: 1, max: 2, initial: 1 })
    };
  }
}

/** Capacité (de Totem ou de Profil). */
export class CapaciteData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const types = Object.keys(VERMINE.typesCapacite);
    const totems = Object.keys(VERMINE.totems);
    return {
      description: new fields.HTMLField(),
      type: new fields.StringField({ required: true, choices: types, initial: "totem" }),
      totem: new fields.StringField({ required: false, blank: true, choices: totems, initial: "" }),
      niveau: new fields.NumberField({ required: true, integer: true, min: 1, max: 3, initial: 1 })
    };
  }
}
