/**
 * Ajout d'un objet à un acteur : propose les entrées de compendium du type demandé
 * (avec recherche), ou la création d'un objet vide s'il n'y en a pas.
 */

/** Collecte les entrées de tous les compendiums d'Objets correspondant à un type. */
async function collecterEntrees(type) {
  const entrees = [];
  for (const pack of game.packs) {
    if (pack.documentName !== "Item") continue;
    let index;
    try {
      index = await pack.getIndex({ fields: ["type"] });
    } catch (e) {
      continue;
    }
    for (const e of index) {
      if (e.type !== type) continue;
      entrees.push({
        uuid: e.uuid ?? `Compendium.${pack.collection}.${e._id}`,
        name: e.name,
        img: e.img ?? "icons/svg/item-bag.svg",
        packLabel: pack.metadata.label
      });
    }
  }
  entrees.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return entrees;
}

/**
 * Ajoute un objet de type `type` à `actor` : ouvre un sélecteur de compendium
 * si des entrées existent, sinon crée un objet vide.
 */
export async function ajouterObjet(actor, type) {
  const typeLabel = game.i18n.localize(`TYPES.Item.${type}`);
  const creerVide = () => actor.createEmbeddedDocuments("Item", [{
    name: game.i18n.format("VERMINE.Item.Nouveau", { type: typeLabel }), type
  }]);

  const entrees = await collecterEntrees(type);
  if (!entrees.length) return creerVide();

  const lignes = entrees.map((e) => `
    <li class="picker-item" data-uuid="${e.uuid}" data-nom="${e.name.toLowerCase()}">
      <img src="${e.img}" /><span class="picker-nom">${e.name}</span>
      <span class="picker-pack">${e.packLabel}</span>
    </li>`).join("");

  const content = `
    <div class="vermine-picker">
      <input type="text" class="picker-search" placeholder="${game.i18n.localize("VERMINE.Comp.Rechercher")}" autofocus />
      <ul class="picker-liste">${lignes}</ul>
    </div>`;

  return new Promise((resolve) => {
    const dlg = new Dialog({
      title: `${game.i18n.localize("VERMINE.Item.Ajouter")} — ${typeLabel}`,
      content,
      buttons: {
        vide: {
          icon: '<i class="fas fa-plus"></i>',
          label: game.i18n.localize("VERMINE.Item.CreerVide"),
          callback: async () => resolve(await creerVide())
        },
        fermer: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("VERMINE.Annuler"),
          callback: () => resolve(null)
        }
      },
      default: "fermer",
      render: (html) => {
        const root = html[0] ?? html;
        root.querySelector(".picker-search")?.addEventListener("input", (ev) => {
          const q = ev.target.value.toLowerCase();
          root.querySelectorAll(".picker-item").forEach((li) => {
            li.style.display = li.dataset.nom.includes(q) ? "" : "none";
          });
        });
        root.querySelectorAll(".picker-item").forEach((li) => {
          li.addEventListener("click", async () => {
            const doc = await fromUuid(li.dataset.uuid);
            if (doc) await actor.createEmbeddedDocuments("Item", [doc.toObject()]);
            dlg.close();
            resolve(true);
          });
        });
      }
    }, { classes: ["vermine2047", "dialog", "vermine-picker-dialog"], width: 440 });
    dlg.render(true);
  });
}
