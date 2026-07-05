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

// --- Rites chamaniques ---
// Lancement : offrande + transe (pas de jet), puis jet Caractéristique + Niveau du Rite,
// Difficulté 7 par défaut ; les Réussites déterminent la puissance. Transe interrompue = -2D
// dans chaque Réserve. (*) = connu gratuitement à la création par les chamans.
const rites = [
  ["Rite d'appel", "1 h / 10 min / 1 min", "Jet de Volonté. Attire des animaux sauvages ; Difficulté selon le Gabarit (3 insecte, 5 rat, 7 chien, 9 ours). 1 animal appelé et 1 h de présence par Réussite. Si un animal appelé meurt, le chaman perd 5D de Réserves."],
  ["Rite d'apprentissage *", "3 j / 12 h / 3 h", "Gratuit à la création. En phase d'Expérience uniquement : apprend un nouveau Rite ou augmente son Niveau (jet d'Expérience, Diff. 5/7/9/10). Vide les deux Réserves."],
  ["Rite de l'aspect totémique", "1 h / 10 min / 1 min", "Jet de Volonté. Prend l'aspect d'un animal lié à un Totem : Bonus égal aux Réussites pour les Actions liées à cet aspect, une scène. Offrande de sang = 1 Blessure Légère. Interdit pour le Totem opposé."],
  ["Rite de bénédiction", "12 h / 1 h / 1 min", "Jet = Caractéristique d'usage de l'objet. Rend un objet/arme/outil plus efficace : +1D Bonus par Réussite pendant 1 jour pour son utilisateur. Objets bénis à la fois = Niveau du Rite."],
  ["Rite de communication animale", "1 min / 10 s / instantané", "Jet d'Empathie (Diff. 3 compagnon, 5 même espèce, 7 mammifères, 9 insectes). 1 information par Réussite. Contact physique requis."],
  ["Rite de communion", "10 min / 1 min / qq s", "Jet d'Empathie. Perçoit les événements marquants passés d'un lieu (portée temporelle selon le Mode). 1 information par Réussite. Coût : -2D de Sang-Froid. Doit être seul sur place."],
  ["Rite de contrition *", "12 h / 3 h / 1 h", "Gratuit à la création. Jet de Vigueur. Récupère les Dés de Réserve perdus après un Interdit brisé : 1D par Réussite. Le chaman doit s'infliger de vraies Blessures dont la somme des Seuils égale les Dés récupérés."],
  ["Rite de divination", "12 h / 3 h / 1 h", "Jet d'Empathie. Pose une question fermée aux Totems ; vision cryptique, 1 indice par Réussite. Coût : 8D / 6D / 4D de Réserves selon le Mode. Transe non interruptible."],
  ["Rite de fertilité", "3 j / 12 h / 3 h", "Jet de Santé. +10 % de fertilité par Réussite (écosystème, troupeau, communauté). Sacrifice de 2 animaux ; vide l'Effort. Interdit au chaman du Solitaire."],
  ["Rite de guérison", "1 nuit / 1 h / 10 min", "Jet de Santé. Soigne 1 Blessure Légère par bénéficiaire, +1 par Réussite (répartie). Chaque bénéficiaire paie 1D d'Effort par Blessure soignée. Blessures Graves/Mortelles selon le Mode."],
  ["Rite du guerrier", "1 h / 10 min / 1 min", "Jet de Vigueur. Ajoute à la Réserve de Groupe des Dés temporaires = Réussites + valeur d'Attaque de l'animal prédateur sacrifié. Les Dés inutilisés disparaissent en fin de combat (ou après 12 h)."],
  ["Rite d'intercession", "12 h / 3 h / 1 h", "Jet de Volonté. Imprègne une zone (~50 m) de l'esprit d'un Totem : +1D aux Actions respectant ses Instincts, -1D à celles brisant ses Interdits. Offrande de sang = 1 Blessure Légère. Réussites doublées avec son propre Totem."],
  ["Rite de perception totémique", "2 h / 10 min / 1 min", "Jet d'Empathie. Révèle le Totem dominant de la région (informations supplémentaires selon les Réussites)."],
  ["Rite de purification", "par point de Virulence", "Jet de Santé. Purge une infection, toxine ou venin : -1 point de Virulence par Réussite (1 Réussite stoppe la contagion). Doit libérer un animal qui mourra de l'infection ; le bénéficiaire partage la transe."],
  ["Rite du rêve lucide", "6 h (tous Modes)", "Jet de Volonté. Voyage hors du corps pour observer un lieu et transmettre un message à un dormeur (portée et longueur du message selon le Mode). Le sommeil n'est pas réparateur."],
  ["Rite de transfert", "1 h / 10 min / instantané", "Jet de Volonté. Transfère l'esprit du chaman dans un animal non hostile (utilise ses Caractéristiques physiques) ; 1 min à 1 h par Réussite selon le Mode. Si l'animal meurt, les deux Réserves du chaman sont vidées."]
];

// --- Profils (24) regroupés par archétype ---
const boosts = {
  chasseurs: "Deux Spécialités supplémentaires à la création (Domaines Animal, Arme ou Terre).",
  combattants: "5D de Matériel supplémentaires à la création (arme ou protection uniquement).",
  nomades: "Réserves d'Effort et de Sang-Froid augmentées de 1D à la création.",
  specialistes: "Monte une Compétence d'un cran supplémentaire (Expert→Maître pour Adulte/Ancien, Confirmé→Expert pour Jeune).",
  survivants: "Un cercle de Blessure Légère supplémentaire à la création.",
  chamans: "Connaît les Rites d'apprentissage et de contrition, plus deux Rites au choix du profil."
};

// [nom, archetype, domaine, capaciteNom, capaciteEffet, competences, specialites, rites?]
const profils = [
  ["Le Dresseur", "chasseurs", "l'Animal", "Communication", "Empathie + Animalisme (Diff. 7) pour comprendre et communiquer avec son auxiliaire animal (joué par le MJ, valeurs fixes).", "Déb. : Discrétion, Dissection, Environnement, Flore, Répulsion, Soins ; Conf. : Alimentation, Armes de tir, Lancer, Traces ; Exp. : Animalisme, Faune.", "Un type d'animal auxiliaire, une arme de lancer ou de tir."],
  ["L'Éclaireur", "chasseurs", "la Terre", "Festin", "Savoir + Alimentation (Diff. = repas +3) : un festin qui rend 3D d'Effort et 1D de Sang-Froid (2D d'Effort même en cas d'échec).", "Déb. : Athlétisme, Discrétion, Rumeurs, Toxiques, Vestiges, Vigilance ; Conf. : Faune, Flore, Traces ; Exp. : Alimentation, Environnement.", "Un type de plantes, un type d'environnement."],
  ["L'Éradicateur", "chasseurs", "l'Animal ou la Machine", "Technicité", "Peut utiliser Technologie au lieu de Bricolage pour les pièges ; Précision + Technologie avec (I) Handicap, réussite = 2 Réussites bonus à répartir.", "Déb. : Armes à feu/tir, Artisanat, Discrétion, Dissection, Environnement, Flore, Traces ; Conf. : Bricolage, Faune, Technologie ; Exp. : Répulsion, Toxiques.", "Pièges, appâts, un type de vermine."],
  ["Le Fauve", "chasseurs", "l'Animal ou la Survie", "Embuscade", "Une fois une proie repérée, Bonus de 1D à la première Action tentée contre elle.", "Déb. : Alimentation, Animalisme, Dissection, Environnement, Faune, Vigilance ; Conf. : Armes à feu/tir, Athlétisme, Lancer, Traces ; Exp. : Corps à corps, Discrétion, Mêlée.", "Gibier, pistage, un type d'arme, une espèce."],
  ["L'Artificier", "combattants", "l'Arme ou la Machine", "As", "Ignore les Handicaps de Rareté des Compétences de la Machine qu'il ne possède pas (et de Spécialisation s'il possède la Compétence).", "Déb. : Armes de tir, Lancer, Mécanique, Mêlée, Répulsion, Toxiques, Vestiges ; Conf. : Armes à feu, Bricolage, Technologie ; Exp. : Armurerie, Artisanat.", "Armes lourdes, explosifs, désamorçage, drone/robot."],
  ["Le Bourreau", "combattants", "l'Arme ou la Survie", "Muraille", "Quiconque tente une Action contre lui ajoute un degré de Handicap à sa première tentative.", "Déb. : Armes de tir, Armurerie, Discrétion, Lancer, Psychologie ; Conf. : Armes à feu, Athlétisme, Vigilance ; Exp. : Corps à corps, Mêlée.", "Duel, un type d'arme de mêlée, intimidation."],
  ["La Sentinelle", "combattants", "l'Arme ou la Survie", "Patience", "Peut diminuer de 1 le Seuil de Blessure Mortelle d'une cible en ajoutant un degré de Handicap à son jet.", "Déb. : Athlétisme, Corps à corps, Environnement, Lancer, Traces, Vestiges ; Conf. : Armes à feu/tir, Armurerie, Mêlée ; Exp. : Discrétion, Vigilance.", "Camouflage, une arme à feu/tir, espionnage, renseignement."],
  ["Le Soldat", "combattants", "l'Arme", "Réactivité", "Son jet de Réaction (Réflexes + Vigilance) est au minimum Actif, jamais Passif.", "Déb. : Discrétion, Environnement, Lancer, Psychologie, Traces, Vigilance ; Conf. : Armes de tir, Armurerie, Athlétisme, Corps à corps ; Exp. : Armes à feu, Mêlée.", "Un type d'armes à feu, intimidation, munitions."],
  ["Le Messager", "nomades", "la Terre ou l'Homme", "Il était une fois", "Réputation initiale -1 ; sur un jet de Savoir, la Réputation de l'information ciblée est aussi diminuée de 1.", "Déb. : Alimentation, Athlétisme, Civilisation, Discrétion, Faune, Flore, Mécanique, Pilotage, Vigilance ; Conf. : Environnement, Psychologie, Vestiges ; Exp. : Route, Rumeurs.", "Recueil d'informations, mythologies, cartographie, itinéraires."],
  ["Le Pilote", "nomades", "la Machine ou l'Animal", "Transport", "3D de Matériel supplémentaires (véhicule ou monture) ; +1D pour réparer/soigner son véhicule ou sa monture endommagé.", "Déb. : Discrétion, Flore, Rumeurs, Technologie, Traces, Vestiges, Vigilance ; Conf. : Bricolage, Environnement, Faune, Mécanique, Soins ; Exp. : Animalisme, Pilotage, Route.", "Conduite d'un type de véhicule, manœuvres, attelage."],
  ["Le Prêcheur", "nomades", "l'Homme", "Adage", "+1D aux jets de Volonté pour capter l'attention de plusieurs personnes ; peut utiliser Volonté au lieu de Savoir quand la conviction prime.", "Déb. : Environnement, Soins, Technologie, Vestiges, Vigilance ; Conf. : Arts, Civilisation, Route ; Exp. : Psychologie, Rumeurs.", "Démagogie, mensonge, discrétion."],
  ["Le Traceur", "nomades", "la Terre", "Chat maigre", "Athlétisme et une Spécialité suivent les règles du Domaine de prédilection (réussites automatiques possibles).", "Déb. : Alimentation, Discrétion, Faune, Flore, Psychologie, Vestiges, Vigilance ; Conf. : Athlétisme, Rumeurs, Traces ; Exp. : Environnement, Route.", "Art du déplacement, escalade, fouille, pièges, repérage."],
  ["Le Leader", "specialistes", "l'Homme", "Galvanisation", "Volonté ou Empathie + Psychologie (Diff. 7) : chaque membre du Groupe gagne +1D sur une Action (2D si Réussites ≥ nombre de membres).", "Déb. : Armes à feu, Arts, Athlétisme, Corps à corps, Environnement, Mêlée, Soins ; Conf. : Route, Rumeurs, Vestiges ; Exp. : Civilisation, Vigilance ; Maître : Psychologie.", "Mensonge, manipulation, encouragement, démagogie."],
  ["Le Mentor", "specialistes", "l'Homme", "Enseignement", "Chaque matin, une de ses Compétences Confirmé+ est partagée à tout le Groupe pour la journée (plafonnée à Confirmé).", "Déb. : Artisanat, Arts, Environnement, Rumeurs, Vestiges ; Conf. : Civilisation, Soins, Technologie, Vigilance ; Exp. : Psychologie ; Maître : au choix.", "Évaluation, éducation, une profession, un domaine scientifique."],
  ["Le Soigneur", "specialistes", "l'Homme", "Pharmacie", "3D de Matériel supplémentaires (matériel médical) ; +1D à chaque phase de Matériel pour du matériel médical.", "Déb. : Alimentation, Artisanat, Arts, Faune, Technologie, Vestiges ; Conf. : Civilisation, Dissection, Flore ; Exp. : Psychologie, Toxiques ; Maître : Soins.", "Diagnostic, premiers secours, chirurgie, un type de pathologies."],
  ["Le Virtuose", "specialistes", "au choix", "Perfectionniste", "Une fois par scène, en réussissant un jet de Difficulté ≥ 7 via une Spécialité, récupère 1D de Sang-Froid.", "Déb. : Environnement, Bricolage, Faune, Flore, Répulsion, Rumeurs, Toxiques ; Conf. : Artisanat, Mécanique, Vestiges ; Exp. : Arts, Civilisation, Technologie ; Maître : au choix.", "Expertise, estimation, un domaine scientifique, une profession."],
  ["L'Architecte", "survivants", "l'Homme ou la Terre", "Prospérité", "Quand un Objectif de Groupe est rempli, gagne 1D d'Expérience individuel (3D pour un Objectif majeur).", "Déb. : Armes à feu, Armurerie, Artisanat, Environnement, Mécanique, Route ; Conf. : Arts, Psychologie, Rumeurs ; Exp. : Civilisation, Technologie, Vestiges.", "Restauration, religions, industrie."],
  ["Le Gardien", "survivants", "l'Arme, la Machine ou la Survie", "Protecteur", "Une fois par combat, défense gratuite (même hors de son tour) pour subir à la place d'un allié proche une attaque qui le visait.", "Déb. : Animalisme, Bricolage, Discrétion, Répulsion, Psychologie, Soins ; Conf. : Athlétisme, Armurerie, Artisanat, Corps à corps ; Exp. : Armes à feu/tir, Mêlée, Vigilance.", "Fortifications, défenses, armures, réparations."],
  ["L'Invisible", "survivants", "la Survie ou la Terre", "Collectionneur", "Une fois par jour, Savoir + Bricolage vs Rareté d'un objet cherché : réussite = il en trouve un dans son barda (Fiabilité = Réussites +1).", "Déb. : Alimentation, Civilisation, Environnement, Faune, Flore, Mécanique, Rumeurs, Technologie ; Conf. : Bricolage, Route, Vigilance ; Exp. : Discrétion, Vestiges.", "Fouiller, voler, dissimuler."],
  ["L'Orphelin", "survivants", "la Survie ou la Terre", "Increvable", "Sur un jet de Santé raté, peut dépenser autant de Dés d'Effort que de Réussites manquantes pour éviter les conséquences ; sur un succès, gagne 1D d'Effort (dépassement possible).", "Déb. : Animalisme, Athlétisme, Bricolage, Corps à corps, Faune, Flore, Traces ; Conf. : Discrétion, Environnement, Route ; Exp. : Alimentation, Vigilance.", "Comestibles, repérage, orientation."],
  ["L'Animiste", "chamans", "l'Animal ou la Terre", "Rituel", "Une fois par séance, un rituel permet à tous les participants de récupérer toute leur Réserve de Sang-Froid.", "Déb. : Alimentation, Dissection, Psychologie, Rumeurs, Traces, Vigilance ; Conf. : Faune, Flore ; Exp. : Animalisme, Environnement.", "Apaisement, une espèce, un environnement, religion.", "Rites : communication animale, guérison, intercession, rêve lucide, transfert."],
  ["Le Mimétique", "chamans", "l'Animal, la Survie ou la Terre", "Sens de la Nature", "Quand il se fie à son instinct plutôt qu'à ses connaissances, +1D (hors jets de Savoir et Domaine de la Machine).", "Déb. : Animalisme, Athlétisme, Discrétion, Faune, Flore, Route ; Conf. : Alimentation, Traces ; Exp. : Environnement, Vigilance.", "Apaisement, météo, mimétisme, orientation.", "Rites : appel, aspect totémique, purification."],
  ["L'Oracle", "chamans", "l'Homme, la Survie ou la Terre", "Vision", "Une fois par session, Empathie + Vigilance (Diff. 9) pour obtenir une information vitale, transmise comme une sensation cryptique.", "Déb. : Animalisme, Discrétion, Environnement, Faune, Flore, Route ; Conf. : Psychologie, Traces ; Exp. : Rumeurs, Vigilance.", "Charisme, mensonge, météo, religion.", "Rites : communion, divination, perception totémique, rêve lucide."],
  ["Le Sorcier", "chamans", "l'Animal, l'Homme, la Survie ou la Terre", "Captivé", "Un rituel choisit deux Domaines : jusqu'au prochain rituel, +1D aux jets du premier Domaine, -1D à ceux du second.", "Déb. : Athlétisme, Environnement, Faune, Flore, Répulsion, Toxiques ; Conf. : Rumeurs, Soins ; Exp. : Psychologie, Vigilance.", "Enseignement, intimidation, manipulation, prestidigitation.", "Rites : bénédiction, fertilité, guérison, guerrier."]
];

// --- Armes & Protections (données officielles Vermine 2047, tables p69/p71) ---
const CODE_DEGATS = { C: "choc", L: "lame", F: "feu", B: "balle" };
const CODE_PROT = { C: "Choc", L: "Lame", F: "Feu", B: "Balles", "*": "Piqûres, essaims", "**": "Radiations, virus, gaz" };
const NOM_TRAIT = {
  "fragile": "cassant", "cassant": "cassant", "pratique": "pratique", "lourd": "lourd",
  "rafale": "rafale", "zone": "zone", "incapacitant": "incapacitant", "rapide": "rapide",
  "intimidant": "intimidant", "duree": "duree", "malus": "malus", "etanche": "etanche"
};
const sansAccent = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
const LABEL_ARME = {
  armesFeu: "Arme à feu.", melee: "Arme de mêlée.", corpsACorps: "Attaque à mains nues.",
  armesTir: "Arme de tir (portées souvent multipliées par la Vigueur).",
  lancer: "Arme de lancer (portées souvent multipliées par la Vigueur)."
};

function parseDegats(str) {
  const m = str.match(/\(([CLFB])\)/);
  const type = m ? CODE_DEGATS[m[1]] : "choc";
  if (/Vigueur/i.test(str)) {
    const n = str.match(/Vigueur\s*([+-]\s*\d+)?/i);
    const val = n && n[1] ? parseInt(n[1].replace(/\s/g, ""), 10) : 0;
    return { degats: val, degatsVigueur: true, typeDommages: type };
  }
  const n = str.match(/\d+/);
  return { degats: n ? parseInt(n[0], 10) : 0, degatsVigueur: false, typeDommages: type };
}
function parsePortees(str) {
  const m = str.match(/(\d+)\s*\/\s*(\d+)/);
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : [0, 0];
}
function parseRarete(str) { const m = String(str).match(/\d+/); return m ? parseInt(m[0], 10) : 0; }
function parseTraits(str) {
  const traits = {};
  if (!str) return traits;
  for (const part of str.split(",")) {
    const p2 = part.replace(/\*+/g, "").trim();
    if (!p2) continue;
    const val = p2.match(/\((\d+)\)/);
    const key = NOM_TRAIT[sansAccent(p2.replace(/\(.*\)/, ""))];
    if (!key) continue;
    traits[key] = val ? parseInt(val[1], 10) : true;
  }
  return traits;
}
function parseIndice(str) {
  if (str === "/" || !str) return null;
  const m = str.match(/(\d+)(?:\s*\/\s*(\d+))?\s*(?:\((\*{1,2}|[CLFB])\))?/);
  return {
    base: parseInt(m[1], 10),
    spec: m[2] ? parseInt(m[2], 10) : 0,
    type: m[3] ? (CODE_PROT[m[3]] ?? "") : ""
  };
}
const parseMob = (s) => ({ "(I)": 1, "(II)": 2, "(III)": 3 })[String(s).trim()] ?? 0;

// Tables officielles : [nom, dommages, portées, rareté, fiabilité, traits]
const TABLES_ARMES = {
  armesFeu: [
    ["Pistolet ou fusil sportif", "2 (B)", "5/20", "7 (I)", "6", "Fragile, Pratique"],
    ["Pistolet, petit calibre", "3 (B)", "10/30", "9", "7", "Pratique"],
    ["Pistolet, gros calibre", "5 (B)", "10/50", "9 (I)", "8", ""],
    ["Fusil de chasse, petit calibre", "3 (B)", "10/60", "7 (I)", "6", "Lourd (2)"],
    ["Fusil de chasse, gros calibre", "4 (B)", "10/100", "7 (II)", "7", ""],
    ["Fusil de précision + lunette", "4 (B)", "50/500", "9 (III)", "8", ""],
    ["Fusil à pompe / Canon scié", "5 (B)", "5/20", "9 (I)", "6", "Lourd (2)"],
    ["Pistolet-mitrailleur", "4 (B)", "15/50", "10 (II)", "6", "Rafale (3)"],
    ["Fusil d'assaut", "6 (B)", "20/80", "9 (II)", "7", "Rafale (2)"],
    ["Lance-flammes", "8 (F)", "5/10", "10 (II)", "5", "Zone (10)"]
  ],
  melee: [
    ["Bâton de marche", "Vigueur (C)", "-", "5", "7", ""],
    ["Pied-de-biche / Batte", "Vigueur +1 (C)", "-", "5 (I)", "9", "Lourd (2)"],
    ["Batte en alu", "Vigueur +1 (C)", "-", "7", "7", ""],
    ["Masse de chantier", "Vigueur +2 (C)", "-", "7 (I)", "8", "Lourd (3)"],
    ["Taser", "1 (F)", "-", "9", "7", "Incapacitant (9)"],
    ["Poinçon", "1 (L)", "-", "3", "4", "Rapide (2)"],
    ["Couteau", "2 (L)", "-", "5", "6", ""],
    ["Sabre, épée", "2 (L)", "-", "7", "7", "Intimidant"],
    ["Machette / Hachette", "3 (L)", "-", "5 (I)", "8", ""],
    ["Hache lourde", "Vigueur +2 (L)", "-", "7 (I)", "7", "Lourd (3)"]
  ],
  corpsACorps: [
    ["Coup de poing", "Vigueur -1 (C)", "-", "-", "-", "Rapide (2)"],
    ["Coup de pied / tête", "Vigueur (C)", "-", "-", "-", ""],
    ["Poing américain", "Vigueur (C)", "-", "5 (I)", "8", ""]
  ],
  armesTir: [
    ["Sarbacane", "1 (L)", "5/10", "5", "8", "Rapide (2)"],
    ["Lance-pierre / Fronde", "1 (C)", "6/20", "5", "6", "Rapide (2)"],
    ["Arc, léger", "3 (L)", "10/25", "7 (I)", "7", "Lourd (2)"],
    ["Arc, lourd", "5 (L)", "15/50", "9 (II)", "8", "Lourd (3)"],
    ["Arbalète", "4 (L)", "10/50", "9 (III)", "8", ""]
  ],
  lancer: [
    ["Filet", "-", "1/2", "7", "5", "Durée (2), Malus (3)"],
    ["Pierre", "Vigueur -1 (C)", "2/6", "3", "9", "Rapide (2)"],
    ["Couteau de lancer", "2 (L)", "2/4", "5", "6", ""],
    ["Lance / Javelot", "Vigueur +2 (L)", "4/8", "5 (I)", "8", "Lourd (2)"],
    ["Cocktail Molotov", "3 (F)", "2/5", "5", "4", "Zone (4)"],
    ["Grenade offensive", "6 (B)", "3/8", "10 (II)", "5", "Zone (5)"],
    ["Grenade lacrymogène", "-", "3/8", "9 (II)", "6", "Durée (4), Malus (1), Zone (8)"]
  ]
};

const armes = [];
for (const [competence, lignes] of Object.entries(TABLES_ARMES)) {
  for (const [nom, dmg, port, rar, fia, tr] of lignes) {
    const d = parseDegats(dmg);
    const [pc, pl] = parsePortees(port);
    armes.push({
      nom, competence, ...d, porteeCourte: pc, porteeLongue: pl,
      rarete: parseRarete(rar), fiabilite: parseRarete(fia), traits: parseTraits(tr)
    });
  }
}

// Protections : [nom, indice, rareté, fiabilité, mobilité, traits/note]
const TABLE_PROTECTIONS = [
  ["Manteau fourré", "1", "9", "6", "(I)", "", "Ignore les Handicaps dus au froid."],
  ["Partielle, légère", "2", "3", "4", "-", "", ""],
  ["Partielle, matelassée", "1/3 (C)", "5 (I)", "6", "-", "", ""],
  ["Partielle, renforcée", "1/3 (L)", "5 (I)", "5", "-", "", ""],
  ["Partielle, blindée", "4", "9 (II)", "7", "(II)", "Lourd (3)", ""],
  ["Partielle, pare-balles", "1/4 (B)", "9 (III)", "6", "(I)", "", ""],
  ["Intégrale, légère", "3", "5", "5", "(I)", "", ""],
  ["Intégrale, matelassée", "2/4 (C)", "7 (I)", "7", "(I)", "", ""],
  ["Intégrale, renforcée", "2/4 (L)", "7 (I)", "6", "(I)", "", ""],
  ["Intégrale, blindée", "6", "9 (II)", "8", "(III)", "Lourd (3)", ""],
  ["Intégrale, pare-balles", "2/6 (B)", "10 (III)", "7", "(II)", "Lourd (3)", ""],
  ["Combinaison de pompier", "2/6 (F)", "9 (II)", "9", "(I)", "Étanche", ""],
  ["Combinaison d'apiculteur", "0/6 (*)", "7 (II)", "5", "(I)", "", "Protège des piqûres et essaims."],
  ["Combinaison NRBC", "0/8 (**)", "10 (II)", "7", "(II)", "Étanche", "Protège des radiations, virus et gaz."],
  ["Bouclier en bois", "1/3 (C)", "6", "5", "(I)", "", "Bouclier (Mêlée) : +1D en parade, réduit seulement les Dommages parés."],
  ["Bouclier en métal", "1/3 (L)", "5", "6", "(I)", "", "Bouclier (Mêlée) : +1D en parade, réduit seulement les Dommages parés."],
  ["Bouclier en plexiglas", "2/4 (L)", "10 (I)", "9", "(I)", "", "Bouclier (Mêlée) : +1D en parade, réduit seulement les Dommages parés."]
];

const protections = [];
for (const [nom, ind, rar, fia, mob, tr, note] of TABLE_PROTECTIONS) {
  const i = parseIndice(ind);
  if (!i) continue;
  protections.push({
    nom, indiceBase: i.base, indiceSpecifique: i.spec, typeSpecifique: i.type,
    handicapMobilite: parseMob(mob), rarete: parseRarete(rar), fiabilite: parseRarete(fia),
    traits: parseTraits(tr), note
  });
}

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
    name: "rites",
    label: "Rites chamaniques",
    type: "Item",
    docs: rites.map(([name, duree, desc]) => ({
      name, type: "rite", img: "icons/svg/daze.svg",
      system: { description: p(desc), cout: 0, portee: "", duree }
    }))
  },
  {
    name: "profils",
    label: "Profils",
    type: "Item",
    docs: profils.map(([name, archetype, domaine, capNom, capEffet, competences, specialites, ritesTxt]) => ({
      name, type: "profil", img: "icons/svg/mystery-man.svg",
      system: {
        archetype,
        boost: boosts[archetype],
        capaciteUnique: capNom,
        competences,
        description: p(`<strong>Capacité — ${capNom} :</strong> ${capEffet}`)
          + p(`<strong>Domaine de prédilection :</strong> ${domaine}`)
          + p(`<strong>Spécialités :</strong> ${specialites}`)
          + (ritesTxt ? p(`<strong>${ritesTxt}</strong>`) : "")
      }
    }))
  },
  {
    name: "armes",
    label: "Armes",
    type: "Item",
    docs: armes.map((a) => ({
      name: a.nom, type: "arme", img: "icons/svg/sword.svg",
      system: {
        description: p(LABEL_ARME[a.competence] ?? ""),
        degats: a.degats, degatsVigueur: a.degatsVigueur, typeDommages: a.typeDommages,
        competence: a.competence, porteeCourte: a.porteeCourte, porteeLongue: a.porteeLongue,
        fiabilite: a.fiabilite, protection: 0, rarete: a.rarete, traits: a.traits
      }
    }))
  },
  {
    name: "protections",
    label: "Protections",
    type: "Item",
    docs: protections.map((pr) => ({
      name: pr.nom, type: "protection", img: "icons/svg/shield.svg",
      system: {
        description: pr.note ? p(pr.note) : "",
        indiceBase: pr.indiceBase, indiceSpecifique: pr.indiceSpecifique, typeSpecifique: pr.typeSpecifique,
        handicapMobilite: pr.handicapMobilite, fiabilite: pr.fiabilite, rarete: pr.rarete,
        traits: pr.traits, equipee: false
      }
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
