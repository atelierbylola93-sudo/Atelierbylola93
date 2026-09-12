# Brief — page d'accueil

Entretien mené avec le propriétaire du projet. Réponses non paraphrasées.

Ce brief documente une **intervention sur un site existant**, pas une page
autonome. Le site est une application React en production, avec un tunnel de
réservation, un espace patron et une base de données. La méthode scrollcraft a
servi de cadre de goût et de grammaire ; son pipeline de build isolé (dossier
de build, moteur embarqué, assets générés) ne s'applique pas ici et n'a pas été
utilisé. Aucune ligne n'a donc été ajoutée au registre d'empreintes : il n'y a
pas de build à y inscrire.

---

## Les réponses

**1. Vibe.** « premium, cinématique, moderne, immersif », « luxe discret »,
« spa japonais contemporain », « univers éditorial haut de gamme ».

**2. Parcours.** Vidéo du salon en plein écran, puis la maison et son
architecture intérieure, puis les prestations, puis les témoignages, puis le
contact.

**3. Énergie.** Ouverture ample et lente. Le milieu de page se resserre sur la
lecture. Un point haut après la section « maison ». Sortie sur l'action.

**4. Le moment à retenir.** « Le bandeau qui défile. » Les quatre repères
traversant l'écran en grand, comme un générique.

**5. Ce que ne fait aucun autre site.** Un bandeau qui roule de droite à gauche,
en deux pistes de vitesses différentes, dont les horaires sont lus en direct
dans la base de l'institut.

**6. Registre.** Premium-minimal.

**7. Structure.** Scènes distinctes. Chaque section a son propre dispositif.

**8. Assets.** Vidéo du vrai salon (fournie, retravaillée), vrais avant/après
présents dans le projet mais non utilisés, photos de banque d'images encore en
place sur quatre cartes de prestations.

---

## La courbe des sensations

| Acte | Sensation | Ce qui la provoque |
|---|---|---|
| Héros | Saisissement calme | La vidéo du vrai salon, au ralenti, en plein écran |
| Maison | Intimité | Texte éditorial, colonne étroite, aucune image |
| **Bandeau** | **Élan** | **Quatre repères en 96 px traversant l'écran, deux vitesses** |
| Prestations | Choix | Grille, prix réels, promotions lues en base |
| Témoignages | Confiance | Paroles de clientes |
| Contact | Décision | Une action, un libellé |

**Le silence avant le pic** : la section « maison » est volontairement calme,
sans image depuis le retrait de la photo de devanture. Sans ce creux, le
bandeau ne serait qu'une section de plus.

## Le pic

> « C'est le site où le nom de l'institut te passe devant les yeux comme un
> générique de film, et où les horaires affichés sont ceux qu'on t'appliquera
> vraiment. »

Il vit dans la section `BandeauDefilant`, entre « maison » et les prestations.

## La phrase

« C'est le site où **on voit le vrai salon avant de lire un seul mot**. »

---

## Contraintes tenues

- **Aucun chiffre inventé.** Les notes Google fabriquées (« 4.9 / 5 · Avis
  Google Certifiés », à deux endroits) et le « +500 expériences réalisées »
  invérifiable ont été retirés. Le bandeau ne porte que des faits : une
  prestation, un lieu, une adresse, des horaires lus en base.
- **Aucun indicateur de défilement.** Retiré du héros.
- **Palette.** Crème, laiton, espresso. La méthode met en garde contre cette
  combinaison quand elle est choisie par défaut ; ici elle est l'identité
  revendiquée de l'institut, présente sur l'enseigne et le logo. Conservée pour
  cette raison, pas par facilité.
- **Mouvement réduit.** Le bandeau ralentit à 240 s au lieu de s'arrêter : la
  méthode demande moins et plus doux, pas zéro.
