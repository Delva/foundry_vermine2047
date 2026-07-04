/** Précharge les templates Handlebars et enregistre les partials. */
export async function preloadTemplates() {
  // Forme tableau : chaque template est enregistré comme partial sous son chemin complet,
  // ce qui permet le {{> systems/vermine2047/.../liste-objets.hbs}}.
  return loadTemplates([
    "systems/vermine2047/templates/actor/parts/liste-objets.hbs",
    "systems/vermine2047/templates/actor/personnage-sheet.hbs",
    "systems/vermine2047/templates/actor/creature-sheet.hbs",
    "systems/vermine2047/templates/item/item-sheet.hbs",
    "systems/vermine2047/templates/dice/roll-dialog.hbs",
    "systems/vermine2047/templates/dice/roll-card.hbs"
  ]);
}

/** Enregistre les helpers Handlebars du système. */
export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("lt", (a, b) => a < b);
  Handlebars.registerHelper("gt", (a, b) => a > b);
  Handlebars.registerHelper("join", (arr, sep) => Array.isArray(arr) ? arr.join(sep) : "");
}
