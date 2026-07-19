/**
 * Données source des compendiums (packs LevelDB), curées et paraphrasées à partir
 * du guide officiel — jamais copiées mot pour mot (droits Studio Agate).
 *
 * NOTE : seul l'export `totems` est présent dans ce fichier. Les données des autres
 * packs déjà compilés (adaptations, traumatismes, historiques, afflictions, rites,
 * profils, armes, protections, macros) ne sont pas reconstituées ici — ces packs
 * existent déjà en `packs/<nom>` et n'ont pas besoin d'être régénérés pour ajouter
 * les Capacités de Totems.
 *
 * Chaque entrée de `totems` devient un Item de type "capacite" (type: "totem").
 */

const ICON = "icons/svg/upgrade.svg";

/** Construit les entrées d'un Totem à partir d'une liste [nom, niveau, description]. */
function totem(totemKey, entries) {
  return entries.map(([name, niveau, description]) => ({
    name,
    img: ICON,
    type: "capacite",
    system: { description: `<p>${description}</p>`, type: "totem", totem: totemKey, niveau }
  }));
}

export const totems = [
  ...totem("predateur", [
    ["Connais ton ennemi", 1, "Bonus 1D aux oppositions mentales/sociales contre un adversaire agressif. Jet Perception + Psychologie (Difficulté 7, Handicap I) pour percer les intentions d'un ennemi en combat, une fois par affrontement."],
    ["Coûte que coûte", 1, "Réduit de 1D (minimum 1D) les pertes de Réserve et les Malus liés au stress ou aux chocs psychologiques."],
    ["L'instinct du chasseur", 1, "Agit en premier au tour 1 s'il est Offensif. En situation de traque, chaque Réussite inflige 2D de perte de Réserve d'Effort à la proie, jusqu'à l'épuiser."],
    ["Louve", 1, "Bonus 1D en attaque contre qui menace directement un allié. Si blessé pendant ce combat, +1 aux Dommages infligés jusqu'à la fin du combat."],
    ["Second souffle", 1, "Une fois par jour : jet de Vigueur, ignore les Malus de Blessure pendant un nombre de tours égal aux Réussites. Une fois par jour, rétrograde une Blessure d'un cran hors repos ; le coût de guérison associé est réduit de 10."],
    ["Frisson de la chasse", 2, "Désigne une cible par affrontement ou traque : chaque fois qu'elle est blessée ou mise en difficulté, regagne 10 dans une Réserve. En cas de capture ou de mise à mort, Réserves au maximum ou +10 d'Expérience, au choix."],
    ["Leurre", 2, "Jet de Perception + Environnement (Difficulté 7) pour préparer une embuscade : lui et ses alliés bénéficient d'un Bonus de 10 contre la cible pendant tout le combat."],
    ["Plus gros que soi", 2, "Bonus de 10 sur les Actions de combat quand lui et ses alliés sont en infériorité numérique ou face à un adversaire de plus grande taille."],
    ["Machine à tuer", 3, "Toute attaque inflige au moins une Blessure Légère, même ratée. Si l'attaque et les Dommages sont pleinement réussis, une Blessure Légère s'ajoute aux Dommages normaux."],
    ["Trancher la tête", 3, "Bonus de 10 aux dégâts contre un Groupe, une meute ou une nuée. Hors nuées, abattre un membre régénère 10 au choix ; tuer une cible clé donne une Relance gratuite et permet un jet de Volonté + Psychologie (Difficulté 7) pour faire fuir les survivants."]
  ]),
  ...totem("charognard", [
    ["Calculateur", 1, "Lors d'une Action coordonnée de Groupe, gagne 10 d'Effort et de Sang-Froid en restant hors de tout danger pendant que le reste du Groupe affronte des obstacles dangereux."],
    ["Insignifiant", 1, "Bonus 1D en discrétion ou mensonge pour passer inaperçu ou paraître plus faible. Choisi en dernier pour les missions à risque ; visé en dernier en combat, sauf action hostile de sa part."],
    ["L'estomac vide", 1, "Réduit de 1D par jour les pertes de Réserve dues à la faim ou à la soif ; un repas rapporte 1D de Sang-Froid supplémentaire. Déshydratation et absence totale de nourriture coûtent moins cher que la normale."],
    ["Les ordures d'un homme", 1, "Bonus 1D en fouille ; peut obtenir 1D supplémentaire en renonçant à un critère de recherche ou en acceptant une moindre Fiabilité. Cet effet ne peut pas être annulé en dépensant des Réussites."],
    ["Point faible", 1, "Bonus 1D en opposition physique ou sociale contre un adversaire blessé ou affaibli. Jet d'Empathie + Psychologie (Difficulté 7) pour cerner la faille, le secret ou la phobie d'un interlocuteur, une fois par personne."],
    ["Défendre sa peau", 2, "Bonus 1D sur les jets de défense, d'esquive, de discrétion ou de négociation lorsque sa vie est directement menacée."],
    ["Résistance de cafard", 2, "Bonus 1D aux jets de Santé contre maladies, poisons et venins ; consommer nourriture avariée ne le gêne pas. Toute Blessure subie est rétrogradée d'un cran si un cercle du niveau inférieur est libre (sauf Légère)."],
    ["Saboteur", 2, "Bonus 1 aux Dommages ou Réussite automatique, au choix, pour détruire une ressource matérielle adverse. Bonus 1D aux jets sociaux pour semer la discorde au sein d'un Groupe."],
    ["Jusqu'à l'os", 3, "En cas de Blessure, peut dépenser 1D de chacune de ses Réserves pour la reporter intégralement sur l'allié le plus proche, sans défense possible pour lui."],
    ["Survivre à tout prix", 3, "Face à une Blessure qui serait fatale, réduit définitivement une Caractéristique au choix de 1D (ou accepte un Traumatisme sans les Dés d'Expérience associés) pour annuler tous les dégâts et survivre."]
  ]),
  ...totem("symbiote", [
    ["Apaisement", 1, "Jet d'Empathie + Animalisme (Difficulté selon l'agressivité, Handicap selon la taille, +2 degrés si l'espèce ne communique pas avec l'homme) pour améliorer d'un cran l'état d'esprit d'un animal ou d'une créature isolée."],
    ["Berceau", 1, "Bonus 1D pour se cacher ou trouver nourriture et eau en milieu naturel, extensible à ses compagnons tant qu'ils ne dégradent rien. Coût de guérison réduit de 1D, pour lui seul."],
    ["Clan", 1, "Une fois par jour, jet de Volonté + Psychologie (Difficulté 7) pour réduire de 1D les pertes de Sang-Froid dues au stress ou aux chocs subis par les autres membres du Groupe."],
    ["Transfert", 1, "Par contact physique et empathique prolongé avec un allié consentant, transfère jusqu'à 3D de ses propres Réserves ; une seule fois par jour avec la même personne."],
    ["Un monde meilleur", 1, "Bonus 1D sur les Actions sociales réalisées au bénéfice de son Groupe."],
    ["Communion", 2, "Ressent l'ambiance d'un lieu, paisible ou dangereuse. Jet d'Empathie + Environnement (Difficulté 7) : chaque Réussite permet une question précise à laquelle le meneur doit répondre sincèrement."],
    ["Force collective", 2, "Regagne 1D de Réserve en participant à une Action collective de Groupe ; gagne 1D d'Expérience par Objectif atteint lorsqu'il a fédéré des communautés disparates pour l'occasion."],
    ["Martyr", 2, "Peut s'infliger une Blessure Légère pour qu'un allié blessé regagne 2D de Réserve d'Effort et voie ses Malus de Blessure réduits de 1D jusqu'à la fin de la scène."],
    ["Adaptation", 3, "Se lie à une espèce animale ou végétale : immunité à ses poisons ou venins, et effets d'Apaisement ou de Berceau acquis (ou doublés s'il les possède déjà) selon le règne concerné."],
    ["Sans toi, je n'existe pas", 3, "Lien irréversible avec un allié consentant : tant qu'ils restent physiquement proches, ils partagent librement Réserves, Blessures et Compétences. Le lien se rompt dès qu'un Interdit est brisé."]
  ]),
  ...totem("parasite", [
    ["Chapardeur", 1, "Bonus 1D pour dérober discrètement un objet. Jet de Perception + Rumeurs pour découvrir où un Groupe cache ses biens précieux et comment s'en emparer."],
    ["Imitateur", 1, "Jet d'Empathie (Difficulté 7, Bonus 1D, Handicap selon la notoriété de la personne imitée) pour se faire passer pour quelqu'un d'autre. Un jet préalable de Perception + Rumeurs (Difficulté 7) sur la cible donne une Relance par Réussite sur ce jet."],
    ["Je suis des vôtres", 1, "Bonus 1D pour mentir en se faisant passer pour quelqu'un d'honnête ; un degré de Handicap supplémentaire s'applique à quiconque tente de l'accuser."],
    ["Mauvaise influence", 1, "Par un jet de Volonté en opposition, pousse un allié à commettre un acte répréhensible de risque modéré, ou lui impose le résultat de son vote secret."],
    ["Sangsue", 1, "Après un tour d'observation ou de contact, jet de Volonté + Soins (Difficulté = Réserve de Sang-Froid actuelle de la cible) pour établir un lien de domination et voler 1D de Réserve par tour d'observation, jusqu'à 3D."],
    ["Endoparasite", 2, "Tant qu'aucun Interdit n'est brisé, les autres membres du Groupe le couvrent systématiquement en cas d'accusation. Une fois par jour, utilise une Capacité de Groupe ou puise dans la Réserve de Groupe sans phase de vote."],
    ["Parasitoïde", 2, "Regagne 1D de Réserve chaque fois qu'un Interdit, personnel ou de Groupe, est brisé ; gagne en plus 1D d'Expérience si l'acte coûte une Capacité de Totem."],
    ["Pour mon bien", 2, "Une fois par jour, jet de Volonté en opposition pour s'accaparer la Capacité d'un autre personnage jusqu'à la fin de la journée, au coût de 1D de Sang-Froid par Niveau à chaque utilisation."],
    ["Faux prophète", 3, "Jet de Volonté en opposition (Difficulté 5 à 10 selon le risque encouru par la cible) pour imposer une Action à quelqu'un contre son gré."],
    ["Je me nourris de toi", 3, "Jet d'Empathie + Psychologie (Difficulté 7) pour établir un lien avec une cible consciente, consentante ou non. Vole ensuite 2D d'une Réserve par tour, ou inflige une Blessure Légère par tour en échange d'en effacer une des siennes."]
  ]),
  ...totem("batisseur", [
    ["Bidouillage", 1, "Jet de Précision + Bricolage (Difficulté = Rareté de l'objet visé, +2 si composant technologique) pour fabriquer un objet rudimentaire à usage unique à partir de bric et de broc, en un nombre de minutes égal à la Rareté."],
    ["Fondation", 1, "Bonus 1D sur les Actions de fabrication, fortification, réparation, sabotage ou destruction d'objets, machines ou édifices humains. Chaque Réussite bénéficiant de ce Bonus régénère 1D dans chaque Réserve."],
    ["Le défaut dans la cuirasse", 1, "Réduit l'indice spécifique de Protection de l'adversaire de 1 par Niveau dans la Compétence utilisée pour l'attaque, jusqu'à -4 au Niveau Maître, avec un minimum de 0."],
    ["Renforcement", 1, "Jet de Précision + Armurerie (Difficulté 7 ou 9 selon que la Protection a un indice spécifique) pour augmenter durablement de 1 les indices d'une Protection ; une seule fois par objet."],
    ["Socle de compétences", 1, "Gagne 1D d'Expérience gratuit en développant une Compétence déjà possédée, et offre le même bénéfice (2D s'il est Expert ou Maître, 3D s'il est Légende) à quiconque apprend ou progresse avec lui dans cette Compétence."],
    ["Analyse", 2, "Jet de Perception + Compétence technique adaptée à l'objet ou au lieu étudié, pour reconstituer son histoire ou son usage ; chaque Réussite apporte une information sincère du meneur."],
    ["Construit pour durer", 2, "Jet de Précision + Compétence technique adaptée (Difficulté = Fiabilité actuelle) pour augmenter la Fiabilité maximale d'un objet intact de 1 par Réussite ; en s'imposant un Handicap, peut aussi lui offrir le Trait Coque."],
    ["Me lâche pas maintenant !", 2, "Une fois par jour, jet de Savoir ou Précision + Bricolage (Difficulté 7) pour continuer d'utiliser un équipement à Fiabilité 0 ; chaque Réussite autorise une utilisation supplémentaire (ou un kilomètre pour un véhicule)."],
    ["Renaissance", 3, "Jet de Précision (Compétence et Difficulté fixées par le meneur, Handicaps ignorés) qui restaure la Fiabilité maximale d'un objet en cas de Succès."],
    ["Sanctuaire", 3, "Jet de Volonté + Discrétion (Difficulté 7) pour interdire l'accès d'une zone, sur un rayon de 100 mètres par Réussite, aux créatures et effets liés à un Totem précis."]
  ]),
  ...totem("horde", [
    ["Flair", 1, "Jet de Perception + Environnement (Difficulté = Rareté de la ressource) pour localiser nourriture, eau ou équipement ; chaque Réussite donne une précision (direction, distance, quantité)."],
    ["La Horde est ma force", 1, "Bonus 1D à sa première attaque du combat, renouvelé chaque tour tant que tous les membres du Groupe attaquent également."],
    ["Pillage", 1, "Bonus 1D en fouille, avec deux critères d'interprétation des Réussites au choix ; le premier degré de Handicap lié à une propriété particulière recherchée est ignoré."],
    ["Pire cauchemar", 1, "Bonus 1D pour intimider ou pour résister à l'intimidation et à la peur ; les pertes de Sang-Froid dues à la peur sont réduites de 1D."],
    ["Toujours prêt", 1, "Les dés de Sang-Froid dépensés pour améliorer sa Réaction comptent double, dans la limite habituelle de la Caractéristique concernée."],
    ["Destruction", 2, "Toute attaque contre du matériel, Protection comprise, réduit sa Fiabilité du nombre de Réussites obtenues, avant même le calcul des Dommages."],
    ["Moisson", 2, "Ses attaques de Corps à corps et de Mêlée gagnent les Traits Rapide (2) et Zone (3)."],
    ["Neutralisation", 2, "Jet de Volonté + Technologie (Difficulté 7) au contact d'un objet électronique pour le désactiver pendant 2 tours, plus 1 par Réussite supplémentaire."],
    ["Carnage", 3, "Regagne 1D dans chacune de ses Réserves en assistant à une mort, une explosion ou une destruction majeure (2D s'il y participe directement)."],
    ["Inexorable", 3, "Tant qu'il ne fait qu'attaquer, compte comme un groupe de créatures de Taille 3 pour son nombre d'attaques ; chaque adversaire qu'il blesse perd 1D de Sang-Froid. La moindre action de défense de sa part lui fait perdre l'usage de cette Capacité pour le combat."]
  ]),
  ...totem("ruche", [
    ["Autorité", 1, "Une fois par jour, jet de Volonté + Psychologie (Difficulté 7) : chaque Réussite rend 1D de Sang-Froid à tous les présents, et autant à la Réserve de Groupe si la moitié du Groupe est réunie."],
    ["Haut les cœurs", 1, "Jet d'Empathie + Psychologie (Difficulté = 2 fois le nombre de cibles) : les alliés qui suivent ses conseils obtiennent une Réussite automatique sur l'Action concernée ; regagne 1D de Sang-Froid par allié coopératif."],
    ["Leader", 1, "Bonus 1D sur ses interactions sociales avec des personnes extérieures au Groupe, lorsqu'il est entouré de tout son Groupe."],
    ["Localisation instinctive", 1, "Jet d'Empathie + Traces (Difficulté 7) pour obtenir la direction et la distance approximative d'un membre du Groupe ; chaque Réussite ajoute une information supplémentaire."],
    ["Reine de la ruche", 1, "Ignore les Malus liés au Moral du Groupe ; utilise les Capacités de Groupe même en Crise et puise librement dans la Réserve de Groupe tant qu'aucun Interdit n'est rompu."],
    ["Voix de la reine", 2, "Son vote compte double lors des votes de Groupe ; une fois par session, peut demander au meneur le résultat d'un vote secret."],
    ["Motivation", 2, "Le Groupe ignore les Malus dus à une Réserve vide ; la Réserve de Groupe est toujours considérée au moins égale à son propre Sang-Froid. Regagne 1D de Sang-Froid chaque fois que la Réserve de Groupe regagne des dés."],
    ["Savoir collectif", 2, "Jet d'Empathie + Compétence adaptée au sujet (Difficulté = Réputation de l'élément moins 2, moins 4 en Mode Apocalypse) pour se remémorer des informations d'origine humaine ; une question sincère par Réussite."],
    ["Conscience partagée", 3, "Une fois par scène, copie le Niveau de Compétence d'un allié, ou lui prête le Niveau d'une des siennes, pour le reste de la scène."],
    ["Vue d'ensemble", 3, "Une fois par session, assigne un rôle et une Compétence à chaque allié consentant : Bonus 1D et Réussite automatique sur cette Compétence jusqu'à la fin du défi commun ; désobéir annule le bénéfice."]
  ]),
  ...totem("solitaire", [
    ["Improvisation", 1, "Bonus 1D sur tous ses jets de Réaction."],
    ["Les liens qui m'enserrent", 1, "Bonus 1D sur toute Action réalisée seul, loin du Groupe et sans communiquer avec ses camarades ; perd alors l'accès à la Réserve de Groupe."],
    ["Orientation", 1, "Choisit un environnement de prédilection : Réussite automatique sur tous ses jets de Perception + Environnement dans ce type de lieu."],
    ["Rationnement", 1, "Les pertes de Réserve dues à la faim et à la soif surviennent deux fois moins souvent que la normale."],
    ["Survivant", 1, "Pertes de Dés de Réserve et Malus liés aux Blessures réduits de 1D, jusqu'à un minimum de 1D ; coûts de guérison réduits de 2D par type de Blessure."],
    ["Adaptabilité", 2, "Ignore le Handicap de Rareté d'une Compétence qu'il ne possède pas, comme s'il s'agissait d'une Compétence basique."],
    ["J'ai déjà connu pire", 2, "Réduit d'un cran le niveau d'une Blessure qui lui est infligée, à condition qu'un cercle du niveau inférieur soit encore libre."],
    ["Une ombre rôde", 2, "Les jets pour le repérer subissent 2 points de Difficulté supplémentaires ; en dépensant 2D de Sang-Froid, surprend automatiquement un ennemi qui ne l'a pas vu, qui agira alors après lui."],
    ["Juste une égratignure", 3, "Stabilisé automatiquement en cas de Blessure Mortelle : perd ses Dés de Réserve jusqu'à épuisement des deux Réserves, mais ne subit pas de nouvelle Blessure et ne meurt pas, sauf coup de grâce."],
    ["Pressentiment", 3, "Une fois par jour, annule une Action, un jet de dés ou un événement négatif, qui se rejoue en tenant compte de l'avertissement reçu ; un seul usage par événement."]
  ])
];
