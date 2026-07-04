/**
 * Effets d'état (Status Effects) du système Vermine 2047.
 * Au MVP : marqueurs visuels sur les tokens. L'automatisation des Malus via ActiveEffects
 * est prévue en phase 2.
 */
export function registerStatusEffects() {
  const effets = [
    { id: "blessure-legere",   name: "VERMINE.Statut.blessureLegere",   img: "icons/svg/blood.svg" },
    { id: "blessure-grave",    name: "VERMINE.Statut.blessureGrave",    img: "icons/svg/blood.svg" },
    { id: "blessure-mortelle", name: "VERMINE.Statut.blessureMortelle", img: "icons/svg/skull.svg" },
    { id: "epuisement-effort",     name: "VERMINE.Statut.epuisementEffort",     img: "icons/svg/downgrade.svg" },
    { id: "epuisement-sangfroid",  name: "VERMINE.Statut.epuisementSangFroid",  img: "icons/svg/terror.svg" },
    { id: "stresse",    name: "VERMINE.Statut.stresse",    img: "icons/svg/daze.svg" },
    { id: "empoisonne", name: "VERMINE.Statut.empoisonne", img: "icons/svg/poison.svg" },
    { id: "en-feu",     name: "VERMINE.Statut.enFeu",      img: "icons/svg/fire.svg" },
    { id: "stabilise",  name: "VERMINE.Statut.stabilise",  img: "icons/svg/heal.svg" }
  ];

  // On repart des effets par défaut de Foundry en ajoutant les nôtres,
  // pour ne pas casser les intégrations tierces.
  CONFIG.statusEffects = CONFIG.statusEffects.concat(effets);
}
