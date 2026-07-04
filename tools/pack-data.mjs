/**
 * Données curées des compendiums (mécaniques uniquement, descriptions paraphrasées).
 * Source : guide Vermine 2047 (© Studio Agate). Aucun texte long de l'œuvre n'est reproduit.
 * Compilé en packs LevelDB par tools/build-packs.mjs.
 */

const p = (s) => `<p>${s}</p>`;

// --- Adaptations (1D / 2D) et Mutations (3D / 4D) ---
const adaptations = [
  // Adaptations 1D
  ["Anticipation", "adaptation", 1, "Peut utiliser Empathie au lieu de Réflexes pour esquiver un adversaire humain ; une telle esquive réussie regagne 1D de Sang-Froid."],
  ["Au bout de l'effort", "adaptation", 1, "Peut dépenser sur un jet un nombre de Dés de Réserve égal à la Caractéristique utilisée +1 (au lieu d'un seul)."],
  ["Dur au mal", "adaptation", 1, "Le Seuil de Blessure Légère augmente de 1."],
  ["Endurance", "adaptation", 1, "Toutes les pertes de Réserve d'Effort sont réduites de 1D (minimum 1D)."],
  ["Force mentale", "adaptation", 1, "Aucun Malus d'Épuisement aux Actions mentales et sociales quand le Sang-Froid est vide (Malus normal de 2D si les deux Réserves sont vides)."],
  ["Frappe lourde", "adaptation", 1, "À mains nues, les Dommages sont égaux à la Vigueur (C)."],
  ["Œil de lynx", "adaptation", 1, "Bonus de 1D aux Actions impliquant l'acuité visuelle."],
  ["Résistance", "adaptation", 1, "Aucun Malus d'Épuisement aux Actions physiques et manuelles quand l'Effort est vide (Malus normal de 2D si les deux Réserves sont vides)."],
  ["Silencieux", "adaptation", 1, "Bonus de 1D aux Actions de discrétion lorsqu'il est seul."],
  ["Vigilance", "adaptation", 1, "N'est jamais considéré comme Passif ; gagne 1 Réussite supplémentaire sur ses jets de Vigilance réussis."],
  ["Volonté de fer", "adaptation", 1, "Bonus de 1D aux jets liés au moral, au stress ou à la détermination."],
  // Adaptations 2D
  ["Adrénaline", "adaptation", 2, "En combat, ne subit pas la perte de Dés de Réserve liée aux Blessures ; en fin de combat, perd 2D d'Effort et 1D de Sang-Froid par Blessure subie."],
  ["Aura d'optimisme", "adaptation", 2, "Réduit de 2D les pertes de Réserve de Groupe dues à un événement traumatisant dont il est témoin."],
  ["Cicatrisation rapide", "adaptation", 2, "La Difficulté des soins qui lui sont prodigués est réduite de 2 ; le coût de guérison est réduit de 1D par type de Blessure."],
  ["Défenses immunitaires", "adaptation", 2, "La Virulence d'une infection est réduite de 1 ; le soigneur gagne 1 Réussite supplémentaire en cas de succès."],
  ["Habitué à la faim", "adaptation", 2, "Le premier jour de privation totale ou de rationnement n'a aucun effet sur lui."],
  ["Insensible", "adaptation", 2, "L'Intensité des événements stressants est diminuée d'un niveau ; aucun jet requis pour un événement Mineur."],
  ["Instinct", "adaptation", 2, "Empathie + Vigilance (Difficulté 9) pour pressentir un danger naturel ou animal ; chaque Réussite donne une information ; devient Actif (et ses compagnons s'il les prévient)."],
  ["Réflexes éclairs", "adaptation", 2, "Bonus de 2D au jet de Réaction."],
  ["Résistance à la chaleur", "adaptation", 2, "Aucune perte de Réserve, Malus de récupération ni Dommages cumulatifs dus aux fortes chaleurs."],
  ["Résistance au froid", "adaptation", 2, "Aucune perte de Réserve, Malus de récupération ni Dommages cumulatifs dus au froid extrême."],
  ["Résistance aux toxines", "adaptation", 2, "La Virulence des poisons et toxines est réduite de 1 ; une famille choisie voit sa Virulence réduite de 3."],
  ["Santé de fer", "adaptation", 2, "Les Malus de récupération d'Effort dus aux Blessures ne se cumulent pas (seule la pire compte) ; le coût pour réduire une Blessure est réduit de 2D."],
  ["Sommeil réparateur", "adaptation", 2, "Récupère la totalité de ses Réserves avec seulement 4 heures de repos ininterrompu, même en conditions difficiles."],
  ["Sympathie", "adaptation", 2, "Peut voter avec le Groupe lorsqu'il souhaite dépenser des Dés de la Réserve de Groupe."],
  // Mutations 3D
  ["Acuité auditive", "mutation", 3, "Bonus de 3D aux jets de Perception basés sur l'audition ; entend à une distance cinq fois supérieure à la normale."],
  ["Analgésie", "mutation", 3, "Aucune perte de Sang-Froid en cas de Blessure ; le Malus subi à la suite des Blessures est réduit de 1D."],
  ["Camouflage", "mutation", 3, "Ajoute sa Volonté aux jets de camouflage ; immobile, gagne 3 Réussites supplémentaires (perdues dès qu'il se déplace)."],
  ["Griffes", "mutation", 3, "Dommages 2 (L), Trait Rapide (2) ; peut dépenser jusqu'à 3D d'Effort pour +1 Dommage chacun ; les griffes se brisent en fin de combat."],
  ["Hyperosmie", "mutation", 3, "Bonus de 3D aux jets de Perception olfactive ; reconnaît un individu à l'odeur et suit une piste jusqu'à une semaine après le passage."],
  ["Musculature surdéveloppée", "mutation", 3, "Bonus de 3D aux jets de Vigueur de force brute ; Vigueur considérée +3D pour les Dommages de mêlée et de corps à corps (sans bonus à l'attaque)."],
  ["Régénération", "mutation", 3, "Après une nuit de repos, réduit une Blessure d'un niveau (ou efface une Légère) sans dépense ; coût de guérison réduit de 2D par type."],
  ["Vision nocturne", "mutation", 3, "Aucun Malus de Perception visuelle en faible lumière (aveugle dans le noir complet) ; ses yeux réfléchissent la lumière."],
  // Mutations 4D
  ["Exosquelette", "mutation", 4, "Protection 3/5 (L) sans Handicap de Mobilité ; Bonus de 2D pour intimider, Malus de 2D aux autres Actions sociales."],
  ["Immunité absolue", "mutation", 4, "Immunisé à toutes les infections et toxines, ne peut pas développer d'addiction ; en contrepartie, médicaments et stimulants sont sans effet."],
  ["Indestructible", "mutation", 4, "Gagne un cercle dans chaque type de Blessure ; (I) Handicap de Mobilité permanent ; a besoin de deux rations de nourriture."],
  ["Peau mimétique", "mutation", 4, "Dépense 1D de Sang-Froid pour gagner 4D aux jets de discrétion visuelle ; une attaque non repérée le rend Offensif et ses adversaires Passifs."],
  ["Phéromones attractives", "mutation", 4, "A priori positif des créatures ; +3D aux Actions sociales sur des cibles désignées (1 par Dé de Volonté et par scène) ; un agresseur doit réussir Volonté + Psychologie (Difficulté 7)."],
  ["Phéromones répulsives", "mutation", 4, "Les créatures s'éloignent ; les cibles désignées doivent réussir Volonté + Psychologie (Difficulté 7) pour l'approcher ou l'attaquer, avec un Malus de 1D."],
  ["Surhumain", "mutation", 4, "Une Caractéristique choisie gagne 1D et peut atteindre 4D."],
  ["Toucher empoisonné", "mutation", 4, "Au contact (attaque de Corps à corps passant la Protection), sécrète un poison de Virulence 5 + Dés d'Effort dépensés ; Blessure Légère immédiate puis une par minute par Dé de Sang-Froid dépensé."]
];

// --- Traumatismes (physiques / psychologiques) ---
const traumatismes = [
  ["Bouche rafistolée", "physique", "(I) Handicap et Malus de 1D lors des interactions sociales nécessitant une diction claire."],
  ["Cicatrisation lente", "physique", "Le Malus de récupération et le coût de guérison des Blessures augmentent de 1D."],
  ["Coude douloureux", "physique", "(I) Handicap et Malus de 1D supplémentaire avec un outil ou une arme au Trait « Lourd »."],
  ["Crâne défoncé", "physique", "(I) Handicap et Malus de 1D aux jets de Savoir pour se souvenir d'un événement de plus d'une semaine."],
  ["Défiguré", "physique", "(I) Handicap et Malus de 1D lors des interactions sociales où l'apparence joue un rôle."],
  ["Doigt manquant", "physique", "(I) Handicap et Malus de 1D aux Actions manuelles nécessitant une dextérité fine."],
  ["Mauvaise immunité", "physique", "Réserve d'Effort réduite de 1D ; Malus de 1D aux jets de Santé pour résister à une maladie."],
  ["Mobilité réduite", "physique", "(I) Handicap de Mobilité et Malus de 1D aux esquives, parades, Lancer, Mêlée et Corps à corps."],
  ["Œil percé", "physique", "Malus de 1D à tous les jets de Perception ou de Précision impliquant la vue."],
  ["Respiration douloureuse", "physique", "(I) Handicap aux jets de Vigueur en effort violent ; toute perte de Réserve due à un effort prolongé augmente de 1D."],
  ["Dépendance", "psychologique", "Chaque jour sans consommer la substance : perte de 1D dans une Réserve au choix, dont le maximum baisse de 1D jusqu'à consommation."],
  ["Déprimé", "psychologique", "Quand une Réserve est vide, le Malus est de 2D ; quand les deux Réserves sont vides, il est de 3D."],
  ["Fragilité", "psychologique", "Toute perte de Sang-Froid due à un stress ou un choc psychologique est augmentée de 1D."],
  ["Insomnies", "psychologique", "Au réveil, même après une récupération complète, perd 1D dans une Réserve au choix."],
  ["Paranoïa", "psychologique", "Dépenser 1D de la Réserve de Groupe oblige à dépenser aussi 1D de Sang-Froid (impossible si celui-ci est épuisé)."],
  ["Phobie", "psychologique", "À la confrontation de l'objet de sa phobie, perd 1D de Sang-Froid, puis 1D par tour (combat) ou par minute tant qu'il est à proximité."],
  ["Réminiscence", "psychologique", "Au début d'un combat, perd 1D de Sang-Froid et subit un Malus de 1D à son jet de Réaction."],
  ["Technophobe", "psychologique", "Malus de 1D à toutes les Actions liées à la technologie ou à la culture ancienne."]
];

// --- Historiques (coût 1, ou 2 pour ceux marqués d'un astérisque) ---
const historiques = [
  ["Arme optimisée", 2, "Arme de qualité supérieure (Rareté 10/II) dotée de deux améliorations au choix : Fiabilité +1, Rapide/Rafale +1, Dommages +1, portées doublées, ou une Relance."],
  ["Compagnon animal mineur", 1, "Petit animal sans Caractéristiques ni jets, joué par le meneur ; permet d'utiliser les Capacités qui ne fonctionnent que « seul »."],
  ["Compagnon animal majeur", 2, "Animal de combat (Gabarit Chien, Taille 1) aux valeurs fixes : Pister/repérer 4D, Esquiver/attaquer 3D, Réaction 3D+1, Dommages 3 (L), Blessures Légère(2) OOO / Grave(4) O / Mortelle(8) O."],
  ["Héros local", 1, "Réputation inférieure de 3 dans un rayon d'environ 50 km autour du lieu de son exploit ; aide probable de ceux qui le reconnaissent."],
  ["Mental d'acier", 1, "Perte de Sang-Froid en cas de choc réduite de 1D ; peut réduire de 1D la perte de Réserve de Groupe (Volonté + Psychologie, Difficulté 7)."],
  ["Nomade", 1, "Pertes d'Effort dues à une marche longue ou difficile réduites de 1D ; Bonus de 1D aux jets de Route pour l'itinéraire le plus sûr/court/rapide."],
  ["Objet fétiche", 1, "Objet au Trait Fétiche : 1D utilisable en Effort ou Sang-Froid ; tant qu'il le possède, échappe à l'Épuisement même Réserves propres à 0."],
  ["Organisation alliée", 1, "Une organisation le traite avec respect (abri, nourriture, parfois soins ou matériel) ; sa Réputation est inférieure de 2 auprès d'elle."],
  ["Refuge secret", 1, "Un abri sûr connu de lui seul, éloigné des menaces, avec des vivres impérissables pour une semaine."],
  ["Relique", 2, "Objet technologique d'avant l'effondrement (drone, GPS, radio à ondes courtes, taser, talkies…), aux possibilités et limites définies avec le meneur."],
  ["Réseau", 1, "Connaît quelqu'un dans les communautés qu'il visite : bonne source d'information ou aide, sans prise de risque."],
  ["Vieil ami", 1, "Un ami intime redevable, prêt à prendre des risques une fois pour s'acquitter de sa dette ; l'Historique est ensuite perdu."]
];

// --- Afflictions (maladies, toxines/venins, parasites, addictions) ---
// Jet de résistance : Santé vs Virulence (Volonté vs Virulence pour une addiction),
// sans Réserve, sans Relance, sans Compétence.
const afflictions = [
  ["Venin de scorpion", "toxine", 7, "24 h", "", "Perte de 3D dans chaque Réserve ; 1 Blessure Légère par heure. Chaque Réussite au jet de Santé réduit la perte de Dés ou la durée."],
  ["Morsure de veuve noire", "toxine", 5, "24 h", "", "(II) Handicaps à toutes les Actions pendant la durée. Effet continu : aucun jet ne l'interrompt une fois déclaré."],
  ["Piqûre de frelon", "toxine", 3, "", "", "Douleur et gonflement. Plusieurs piqûres d'un même essaim augmentent le nombre de Réussites requises au jet de Santé."],
  ["Feuille de coca", "addiction", 5, "", "2 heures", "Stimulant : +1D d'Effort tant qu'il en consomme. En manque, l'effet s'inverse. Sevrage : se passer d'autant de doses que la Virulence (+1 Handicap par dose sautée)."],
  ["Scolopendre (parasite)", "parasite", 5, "", "", "Tant que le parasite est présent : -1D en Précision et Réflexes, -2D de Sang-Froid, et -1D à la récupération des Réserves. Extraction : Action de soin (Difficulté = Virulence)."],
  ["Infection de plaie", "maladie", 5, "", "", "Une Blessure non soignée s'infecte : empêche la récupération complète des Réserves et peut s'aggraver. Soin : Savoir + Soins vs Virulence."],
  ["Fièvre des marais", "maladie", 6, "plusieurs jours", "", "Malus de 1D aux Actions tant que la fièvre dure ; empêche de recharger totalement les Réserves au repos."]
];

const macroJet = [
  "// Jet Vermine — ouvre le dialogue de jet pour le personnage sélectionné.",
  "const actor = canvas.tokens?.controlled[0]?.actor ?? game.user.character;",
  "if (!actor) { ui.notifications.warn('Vermine 2047 : sélectionnez un jeton ou assignez un personnage.'); }",
  "else if (game.vermine?.rollDialog) { game.vermine.rollDialog(actor); }",
  "else if (actor.rollAction) { actor.rollAction(); }"
].join("\n");

export const PACKS = [
  {
    name: "adaptations",
    label: "Adaptations & Mutations",
    docs: adaptations.map(([name, categorie, cout, desc]) => ({
      name, type: "adaptation",
      img: categorie === "mutation" ? "icons/svg/explosion.svg" : "icons/svg/upgrade.svg",
      system: { description: p(desc), categorie, cout }
    }))
  },
  {
    name: "traumatismes",
    label: "Traumatismes",
    docs: traumatismes.map(([name, categorie, desc]) => ({
      name, type: "traumatisme", img: "icons/svg/blood.svg",
      system: { description: p(desc), categorie }
    }))
  },
  {
    name: "historiques",
    label: "Historique",
    docs: historiques.map(([name, cout, desc]) => ({
      name, type: "historique", img: "icons/svg/book.svg",
      system: { description: p(desc), cout }
    }))
  },
  {
    name: "afflictions",
    label: "Afflictions",
    type: "Item",
    docs: afflictions.map(([name, categorie, virulence, duree, frequence, desc]) => ({
      name, type: "affliction", img: "icons/svg/poison.svg",
      system: { description: p(desc), categorie, virulence, duree, frequence }
    }))
  },
  {
    name: "macros",
    label: "Macros",
    type: "Macro",
    docs: [
      { name: "Jet Vermine", img: "icons/svg/d20-black.svg", command: macroJet }
    ]
  }
];
