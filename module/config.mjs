/**
 * Constantes du système Vermine 2047.
 * Toutes les données de jeu "fixes" (caractéristiques, compétences, niveaux, totems…)
 * sont centralisées ici et référencées via CONFIG.VERMINE.
 */

export const VERMINE = {};

/** Identifiant du système (doit correspondre à system.json). */
VERMINE.id = "vermine2047";

/**
 * Les 8 Caractéristiques, regroupées par type.
 * Valeur exprimée en "D" (nombre de d10). Humains : 1 à 3.
 */
VERMINE.caracteristiques = {
  vigueur:    { label: "VERMINE.Carac.vigueur",    groupe: "physique" },
  sante:      { label: "VERMINE.Carac.sante",      groupe: "physique" },
  precision:  { label: "VERMINE.Carac.precision",  groupe: "manuel" },
  reflexes:   { label: "VERMINE.Carac.reflexes",   groupe: "manuel" },
  savoir:     { label: "VERMINE.Carac.savoir",     groupe: "mental" },
  perception: { label: "VERMINE.Carac.perception", groupe: "mental" },
  volonte:    { label: "VERMINE.Carac.volonte",    groupe: "social" },
  empathie:   { label: "VERMINE.Carac.empathie",   groupe: "social" }
};

/** Groupes de caractéristiques (pour l'affichage et le calcul des Réserves). */
VERMINE.groupesCarac = {
  physique: "VERMINE.GroupeCarac.physique",
  manuel:   "VERMINE.GroupeCarac.manuel",
  mental:   "VERMINE.GroupeCarac.mental",
  social:   "VERMINE.GroupeCarac.social"
};

/** Caractéristiques composant chaque Réserve (base = somme des valeurs). */
VERMINE.reserves = {
  // Sang-Froid = mentales + sociales
  sangFroid: ["savoir", "perception", "volonte", "empathie"],
  // Effort = physiques + manuelles
  effort:    ["vigueur", "sante", "precision", "reflexes"]
};

/**
 * Les 6 domaines thématiques et leurs 5 compétences chacun.
 * rarete : 0 = basique, 1 = (I) rare, 2 = (II) très rare (Handicap si non maîtrisée).
 */
VERMINE.domaines = {
  homme:   "VERMINE.Domaine.homme",
  machine: "VERMINE.Domaine.machine",
  arme:    "VERMINE.Domaine.arme",
  animal:  "VERMINE.Domaine.animal",
  survie:  "VERMINE.Domaine.survie",
  terre:   "VERMINE.Domaine.terre"
};

VERMINE.competences = {
  // L'Homme
  arts:         { label: "VERMINE.Comp.arts",         domaine: "homme",   rarete: 1 },
  civilisation: { label: "VERMINE.Comp.civilisation", domaine: "homme",   rarete: 2 },
  psychologie:  { label: "VERMINE.Comp.psychologie",  domaine: "homme",   rarete: 1 },
  rumeurs:      { label: "VERMINE.Comp.rumeurs",      domaine: "homme",   rarete: 0 },
  soins:        { label: "VERMINE.Comp.soins",        domaine: "homme",   rarete: 1 },
  // L'Arme
  armesFeu:     { label: "VERMINE.Comp.armesFeu",     domaine: "arme",    rarete: 2 },
  armesTir:     { label: "VERMINE.Comp.armesTir",     domaine: "arme",    rarete: 0 },
  armurerie:    { label: "VERMINE.Comp.armurerie",    domaine: "arme",    rarete: 2 },
  lancer:       { label: "VERMINE.Comp.lancer",       domaine: "arme",    rarete: 0 },
  melee:        { label: "VERMINE.Comp.melee",        domaine: "arme",    rarete: 0 },
  // L'Animal
  animalisme:   { label: "VERMINE.Comp.animalisme",   domaine: "animal",  rarete: 1 },
  dissection:   { label: "VERMINE.Comp.dissection",   domaine: "animal",  rarete: 2 },
  faune:        { label: "VERMINE.Comp.faune",        domaine: "animal",  rarete: 1 },
  repulsion:    { label: "VERMINE.Comp.repulsion",    domaine: "animal",  rarete: 0 },
  traces:       { label: "VERMINE.Comp.traces",       domaine: "animal",  rarete: 0 },
  // La Survie
  alimentation: { label: "VERMINE.Comp.alimentation", domaine: "survie",  rarete: 0 },
  athletisme:   { label: "VERMINE.Comp.athletisme",   domaine: "survie",  rarete: 0 },
  corpsACorps:  { label: "VERMINE.Comp.corpsACorps",  domaine: "survie",  rarete: 0 },
  discretion:   { label: "VERMINE.Comp.discretion",   domaine: "survie",  rarete: 0 },
  vigilance:    { label: "VERMINE.Comp.vigilance",    domaine: "survie",  rarete: 0 },
  // La Machine
  artisanat:    { label: "VERMINE.Comp.artisanat",    domaine: "machine", rarete: 2 },
  bricolage:    { label: "VERMINE.Comp.bricolage",    domaine: "machine", rarete: 0 },
  mecanique:    { label: "VERMINE.Comp.mecanique",    domaine: "machine", rarete: 2 },
  pilotage:     { label: "VERMINE.Comp.pilotage",     domaine: "machine", rarete: 1 },
  technologie:  { label: "VERMINE.Comp.technologie",  domaine: "machine", rarete: 2 },
  // La Terre
  environnement:{ label: "VERMINE.Comp.environnement",domaine: "terre",   rarete: 1 },
  flore:        { label: "VERMINE.Comp.flore",        domaine: "terre",   rarete: 1 },
  route:        { label: "VERMINE.Comp.route",        domaine: "terre",   rarete: 0 },
  toxiques:     { label: "VERMINE.Comp.toxiques",     domaine: "terre",   rarete: 2 },
  vestiges:     { label: "VERMINE.Comp.vestiges",     domaine: "terre",   rarete: 1 }
};

/**
 * Niveaux de maîtrise d'une compétence.
 * bonus   = dés ajoutés à la Main.
 * relances = relances offertes (à partir de Confirmé).
 * Bonus et Relances augmentent en alternance à chaque niveau (jamais les deux
 * à la fois) — confirmé par la fiche officielle des Niveaux.
 */
VERMINE.niveauxCompetence = {
  aucun:    { label: "VERMINE.Niveau.aucun",    bonus: 0, relances: 0, ordre: 0 },
  debutant: { label: "VERMINE.Niveau.debutant", bonus: 1, relances: 0, ordre: 1 },
  confirme: { label: "VERMINE.Niveau.confirme", bonus: 1, relances: 1, ordre: 2 },
  expert:   { label: "VERMINE.Niveau.expert",   bonus: 2, relances: 1, ordre: 3 },
  maitre:   { label: "VERMINE.Niveau.maitre",   bonus: 2, relances: 2, ordre: 4 },
  legende:  { label: "VERMINE.Niveau.legende",  bonus: 3, relances: 2, ordre: 5 }
};

/** Âges : impact sur les Réserves, compétences, particularités. */
VERMINE.ages = {
  jeune:  { label: "VERMINE.Age.jeune",  modReserve: -1 },
  adulte: { label: "VERMINE.Age.adulte", modReserve: 0 },
  ancien: { label: "VERMINE.Age.ancien", modReserve: -1 }
};

/** Modes de jeu. */
VERMINE.modes = {
  survie:     "VERMINE.Mode.survie",
  cauchemar:  "VERMINE.Mode.cauchemar",
  apocalypse: "VERMINE.Mode.apocalypse"
};

/** Les 8 Totems. */
VERMINE.totems = {
  predateur:  "VERMINE.Totem.predateur",
  symbiote:   "VERMINE.Totem.symbiote",
  charognard: "VERMINE.Totem.charognard",
  parasite:   "VERMINE.Totem.parasite",
  batisseur:  "VERMINE.Totem.batisseur",
  horde:      "VERMINE.Totem.horde",
  ruche:      "VERMINE.Totem.ruche",
  solitaire:  "VERMINE.Totem.solitaire"
};

/** Niveaux de Blessure. valeurMalus = Malus en D quand ce niveau est le plus grave. */
VERMINE.niveauxBlessure = {
  legere:   { label: "VERMINE.Blessure.legere",   malus: 1, perteReserve: 1 },
  grave:    { label: "VERMINE.Blessure.grave",    malus: 2, perteReserve: 2 },
  mortelle: { label: "VERMINE.Blessure.mortelle", malus: 3, perteReserve: 3 }
};

/** Échelle de Difficulté (3 à 10). */
VERMINE.difficultes = {
  3: "VERMINE.Difficulte.evidente",
  5: "VERMINE.Difficulte.facile",
  7: "VERMINE.Difficulte.difficile",
  9: "VERMINE.Difficulte.tresDifficile",
  10: "VERMINE.Difficulte.quasiImpossible"
};

/** État d'alerte au combat → Difficulté du jet de Réaction (Réflexes + Vigilance). */
VERMINE.alertes = {
  offensif: { label: "VERMINE.Alerte.offensif", difficulte: 5 },
  actif:    { label: "VERMINE.Alerte.actif",    difficulte: 7 },
  passif:   { label: "VERMINE.Alerte.passif",   difficulte: 9 }
};

/** Types de Dommages. code = suffixe affiché entre parenthèses. */
VERMINE.typesDommages = {
  choc:  { label: "VERMINE.Degats.choc",  code: "C" },
  lame:  { label: "VERMINE.Degats.lame",  code: "L" },
  feu:   { label: "VERMINE.Degats.feu",   code: "F" },
  balle: { label: "VERMINE.Degats.balle", code: "B" }
};

/**
 * Traits du matériel (armes, protections, objets).
 * valeur = true si le Trait prend un nombre (n).
 */
VERMINE.traitsArme = {
  bienConcu:    { label: "VERMINE.Trait.bienConcu",    valeur: false },
  cassant:      { label: "VERMINE.Trait.cassant",      valeur: false },
  coque:        { label: "VERMINE.Trait.coque",        valeur: true },
  duree:        { label: "VERMINE.Trait.duree",        valeur: true },
  etanche:      { label: "VERMINE.Trait.etanche",      valeur: false },
  fetiche:      { label: "VERMINE.Trait.fetiche",      valeur: false },
  incapacitant: { label: "VERMINE.Trait.incapacitant", valeur: true },
  intimidant:   { label: "VERMINE.Trait.intimidant",   valeur: false },
  lourd:        { label: "VERMINE.Trait.lourd",        valeur: true },
  malus:        { label: "VERMINE.Trait.malus",        valeur: true },
  maniable:     { label: "VERMINE.Trait.maniable",     valeur: false },
  ponctuel:     { label: "VERMINE.Trait.ponctuel",     valeur: true },
  portee:       { label: "VERMINE.Trait.portee",       valeur: true },
  pratique:     { label: "VERMINE.Trait.pratique",     valeur: false },
  rapide:       { label: "VERMINE.Trait.rapide",       valeur: true },
  rafale:       { label: "VERMINE.Trait.rafale",       valeur: true },
  zone:         { label: "VERMINE.Trait.zone",         valeur: true }
};

/** Archétypes de personnage (regroupent les profils). */
VERMINE.archetypes = {
  chasseurs:    "VERMINE.Archetype.chasseurs",
  combattants:  "VERMINE.Archetype.combattants",
  nomades:      "VERMINE.Archetype.nomades",
  specialistes: "VERMINE.Archetype.specialistes",
  survivants:   "VERMINE.Archetype.survivants",
  chamans:      "VERMINE.Archetype.chamans"
};

/** Types de Capacités (Totem / Profil). */
VERMINE.typesCapacite = {
  totem:  "VERMINE.TypeCapacite.totem",
  profil: "VERMINE.TypeCapacite.profil",
  boost:  "VERMINE.TypeCapacite.boost"
};
