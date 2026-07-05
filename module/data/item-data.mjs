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
    const typesDommages = Object.keys(VERMINE.typesDommages);
    return {
      ...communs(),
      // Dommages de base (nombre). Si degatsVigueur, les Dommages = Vigueur + degats.
      degats: new fields.NumberField({ required: true, integer: true, min: -3, initial: 1 }),
      degatsVigueur: new fields.BooleanField({ initial: false }),
      typeDommages: new fields.StringField({ required: true, choices: typesDommages, initial: "lame" }),
      // Compétence utilisée pour attaquer avec cette arme.
      competence: new fields.StringField({ required: false, blank: true, choices: competences, initial: "melee" }),
      // Portées en mètres (0 = arme de contact). Courte puis Longue.
      porteeCourte: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      porteeLongue: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      fiabilite: new fields.NumberField({ required: false, integer: true, min: 0, initial: 6 }),
      fiabiliteMax: new fields.NumberField({ required: false, integer: true, min: 0, initial: 6 }),
      // Protection conférée (boucliers).
      protection: new fields.NumberField({ required: false, integer: true, min: 0, initial: 0 }),
      // Traits actifs et leur valeur éventuelle (ex. { rafale: 2, lourd: 3 }).
      traits: new fields.ObjectField({ initial: {} })
    };
  }

  /** Libellés d'affichage (dommages, portées, traits). */
  prepareDerivedData() {
    const code = VERMINE.typesDommages[this.typeDommages]?.code ?? "";
    const base = this.degatsVigueur ? `Vigueur+${this.degats}` : `${this.degats}`;
    this.labelDommages = `${base} (${code})`;
    this.labelPortees = (this.porteeCourte || this.porteeLongue)
      ? `${this.porteeCourte}/${this.porteeLongue}` : "—";
    this.labelTraits = Object.entries(this.traits ?? {})
      .filter(([, v]) => v !== false && v !== null && v !== undefined)
      .map(([k, v]) => {
        const t = VERMINE.traitsArme[k];
        const nom = t ? game.i18n.localize(t.label) : k;
        return (t?.valeur && typeof v === "number") ? `${nom} (${v})` : nom;
      }).join(", ");
  }
}

/** Protection / armure. */
export class ProtectionData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...communs(),
      // Indice de base (tous Dommages) et indice spécifique (contre un type précis).
      indiceBase: new fields.NumberField({ required: true, integer: true, min: 0, initial: 1 }),
      indiceSpecifique: new fields.NumberField({ required: false, integer: true, min: 0, initial: 0 }),
      // Type visé par l'indice spécifique (dommages ou effet : balle, gaz, radiations…).
      typeSpecifique: new fields.StringField({ required: false, blank: true, initial: "" }),
      fiabilite: new fields.NumberField({ required: false, integer: true, min: 0, initial: 5 }),
      fiabiliteMax: new fields.NumberField({ required: false, integer: true, min: 0, initial: 5 }),
      handicapMobilite: new fields.NumberField({ required: true, integer: true, min: 0, max: 3, initial: 0 }),
      traits: new fields.ObjectField({ initial: {} }),
      equipee: new fields.BooleanField({ initial: false })
    };
  }

  prepareDerivedData() {
    this.labelIndice = this.indiceSpecifique
      ? `${this.indiceBase}/${this.indiceSpecifique}${this.typeSpecifique ? ` (${this.typeSpecifique})` : ""}`
      : `${this.indiceBase}`;
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

/** Affliction : maladie, toxine, parasite ou addiction (Virulence + effets). */
export class AfflictionData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      categorie: new fields.StringField({
        required: true, choices: ["maladie", "toxine", "parasite", "addiction"], initial: "toxine"
      }),
      // Virulence = Difficulté du jet de Santé (ou de Volonté pour une addiction).
      virulence: new fields.NumberField({ required: true, integer: true, min: 0, max: 10, initial: 5 }),
      duree: new fields.StringField({ required: false, blank: true, initial: "" }),
      // Fréquence entre deux doses (addictions).
      frequence: new fields.StringField({ required: false, blank: true, initial: "" })
    };
  }
}

/** Rite chamanique. */
export class RiteData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      // Coût éventuel en Dés de Réserve.
      cout: new fields.NumberField({ required: false, integer: true, min: 0, initial: 0 }),
      portee: new fields.StringField({ required: false, blank: true, initial: "" }),
      duree: new fields.StringField({ required: false, blank: true, initial: "" })
    };
  }
}

/** Profil de personnage (fiche de référence : archétype, boost, capacité unique). */
export class ProfilData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const archetypes = Object.keys(VERMINE.archetypes);
    return {
      description: new fields.HTMLField(),
      archetype: new fields.StringField({ required: false, blank: true, choices: archetypes, initial: "" }),
      boost: new fields.StringField({ required: false, blank: true, initial: "" }),
      capaciteUnique: new fields.StringField({ required: false, blank: true, initial: "" }),
      competences: new fields.StringField({ required: false, blank: true, initial: "" })
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
