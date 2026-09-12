import {
  Children,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

/**
 * Primitives de défilement.
 *
 * Chaque section de la page doit se comporter différemment de la précédente :
 * cinq sections qui bougent pareil, c'est une section montrée cinq fois. Ces
 * quatre dispositifs couvrent ce dont la page a besoin, et ils se pilotent tous
 * par la progression de leur propre section, jamais par celle de la page.
 *
 * Aucun n'anime de largeur, de hauteur ni de position : uniquement `transform`,
 * `opacity` et `clip-path`, les trois seules propriétés qu'un navigateur
 * compose sans repasser par la mise en page.
 */

/** Progression 0 → 1 d'un élément traversant l'écran. */
export function useProgression(cible: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: cible,
    offset: ['start end', 'end start'],
  });
  return scrollYProgress;
}

/**
 * Avant la peinture côté client, rien côté serveur. React avertit si on
 * appelle useLayoutEffect pendant le rendu serveur ; le choix se fait donc une
 * fois pour toutes, à l'import, et reste stable pour toute la durée de vie.
 */
const useAvantPeinture = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Vrai dès que l'élément a été vu — ou dépassé.
 *
 * L'observateur d'intersection seul ne suffit pas. Une ancre, un retour
 * arrière, une molette rapide ou un lien profond peuvent franchir un élément
 * sans qu'il soit jamais signalé comme visible : il resterait alors à son état
 * de départ, c'est-à-dire invisible, pour toute la visite. Un texte qu'on ne
 * voit jamais n'est pas un effet raté, c'est du contenu perdu — et sur cette
 * page le contenu est le produit.
 *
 * Le filet est donc explicite : si l'élément est passé au-dessus de l'écran,
 * on le montre, animation ou pas.
 */
function useVu(ref: React.RefObject<HTMLElement | null>) {
  const observe = useInView(ref, { once: true, margin: '-10% 0px' });
  const [depasse, setDepasse] = useState(false);

  useEffect(() => {
    if (observe || depasse) return;

    const verifie = () => {
      const el = ref.current;
      if (!el) return;
      // Même seuil que l'observateur : l'élément est entré d'un dixième
      // d'écran. C'est une condition sur la position actuelle, pas sur un
      // passage à surprendre — donc elle reste vraie une fois l'élément
      // dépassé, et on ne peut pas la manquer.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        setDepasse(true);
      }
    };

    verifie();
    window.addEventListener('scroll', verifie, { passive: true });

    // Le défilement seul ne suffit pas, et ajouter des écouteurs ne règle pas
    // le fond du problème : au chargement, l'hydratation, le saut d'ancre et
    // l'attache de l'écouteur se courent après. Selon qui arrive le premier,
    // l'élément est franchi sans que personne ne le voie, et il reste alors
    // invisible pour toute la visite.
    //
    // On ne gagne pas une course de ce genre, on la supprime : tant que
    // l'élément est caché, on regarde simplement où il en est. Un relevé de
    // position toutes les 400 ms, qui s'arrête dès qu'il est révélé — donc au
    // plus quelques dizaines de mesures pour toute la page, et aucune une fois
    // la visite commencée.
    const minuterie = window.setInterval(verifie, 400);

    return () => {
      window.removeEventListener('scroll', verifie);
      window.clearInterval(minuterie);
    };
  }, [observe, depasse, ref]);

  return observe || depasse;
}

/**
 * Faux pendant le rendu serveur et la toute première image, vrai ensuite.
 *
 * C'est ce qui décide que **le serveur rend le contenu visible**. Framer Motion
 * grave sinon l'état de départ — donc `opacity: 0` — directement dans le HTML
 * envoyé par le serveur. Tant que le JavaScript n'a pas pris la main (réseau
 * lent, onglet en arrière-plan, hydratation retardée, script en échec), la
 * page reste alors littéralement vide de son texte. Aucun filet côté client ne
 * peut rattraper ça : le client ne tourne pas encore.
 *
 * On inverse donc la charge. Le HTML servi porte l'état final ; l'état caché
 * n'est appliqué qu'une fois monté, et seulement aux éléments qui sont sous la
 * ligne de flottaison — là où personne ne peut voir le basculement.
 */
function useMonte() {
  const [monte, setMonte] = useState(false);
  useAvantPeinture(() => setMonte(true), []);
  return monte;
}

/* ------------------------------------------------------------------ kinetic */

/**
 * Le texte s'assemble ligne à ligne pendant que le cadre reste immobile.
 *
 * Réservé aux titres. Une ligne de corps de texte qui monte pendant qu'on
 * essaie de la lire est un défaut, pas un effet.
 */
export function TexteAssemble({
  lignes,
  className = '',
  classeLigne = '',
  decalage = 0.08,
}: {
  lignes: ReactNode[];
  className?: string;
  classeLigne?: string;
  decalage?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const vu = useVu(ref);
  const sobre = useReducedMotion();
  const cache = useMonte() && !vu && !sobre;

  return (
    <span ref={ref} className={className}>
      {lignes.map((ligne, i) => (
        // Le débordement est masqué pour que la ligne monte depuis le bas.
        // La marge négative rend la place aux descendantes sans décaler le
        // rythme vertical du titre.
        <span key={i} className="block overflow-hidden pb-[0.16em] -mb-[0.16em]">
          <motion.span
            className={`block ${classeLigne}`}
            initial={false}
            animate={cache ? { y: '110%', opacity: 0 } : { y: '0%', opacity: 1 }}
            transition={{
              duration: 0.85,
              delay: i * decalage,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {ligne}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------- reveal */

/**
 * Un volet qui découvre l'élément depuis un bord.
 *
 * Se lit comme une transformation, pas comme une apparition : à réserver aux
 * moments où quelque chose devient autre chose. Sur un petit élément c'est une
 * agitation ; il faut de la surface.
 */
export function Revele({
  children,
  depuis = 'bas',
  duree = 1.1,
  delai = 0,
  className = '',
}: {
  children: ReactNode;
  depuis?: 'bas' | 'haut' | 'gauche' | 'droite';
  duree?: number;
  delai?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const vu = useVu(ref);
  const sobre = useReducedMotion();
  const cache = useMonte() && !vu && !sobre;

  const depart = {
    bas: 'inset(100% 0 0 0)',
    haut: 'inset(0 0 100% 0)',
    gauche: 'inset(0 100% 0 0)',
    droite: 'inset(0 0 0 100%)',
  }[depuis];

  const ferme = { clipPath: depart, opacity: 0.4 };
  const ouvert = { clipPath: 'inset(0% 0 0 0)', opacity: 1 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={cache ? ferme : ouvert}
      transition={{ duration: duree, delay: delai, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------- parallax */

/**
 * Une couche qui avance à une vitesse propre.
 *
 * Le taux est en centaines de pixels sur toute la traversée : 0,3 à 1,5 pour
 * une couche dans un cadre. Au-delà de deux cents pixels de course, ça cesse
 * de se lire comme de la profondeur et commence à se lire comme un défaut.
 *
 * Jamais de corps de texte sur une couche : ce qu'on lit ne doit pas bouger
 * par rapport à ce sur quoi on le lit.
 */
export function Couche({
  children,
  taux = 0.6,
  className = '',
}: {
  children: ReactNode;
  taux?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useProgression(ref);
  const sobre = useReducedMotion();

  const course = sobre ? 0 : taux * 50;
  const y = useTransform(p, [0, 1], [course, -course]);
  // Ce qui est loin est plus petit et moins contrasté : sans ça, une couche
  // qui glisse ne fabrique aucun relief.
  const ampleur = sobre ? 0 : Math.abs(taux) * 0.02;
  const echelle = useTransform(p, [0, 0.5, 1], [1 + ampleur, 1, 1 + ampleur]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, scale: echelle }}>{children}</motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ flow+in */

function ElementCascade({
  children,
  delai,
  className,
}: {
  children: ReactNode;
  delai: number;
  className: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const vu = useVu(ref);
  const sobre = useReducedMotion();
  const cache = useMonte() && !vu && !sobre;

  const ferme = { opacity: 0, y: 26 };
  const ouvert = { opacity: 1, y: 0 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={cache ? ferme : ouvert}
      transition={{ duration: 0.7, delay: delai, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Une série d'éléments qui arrivent l'un après l'autre.
 *
 * C'est la différence entre une grille qui apparaît d'un bloc et une grille
 * qu'on lit. Le décalage reste court : au-delà d'un dixième de seconde par
 * élément, la visiteuse attend le dernier au lieu de lire le premier.
 *
 * Le conteneur garde la classe de grille ; chaque enfant est enveloppé, donc
 * l'enveloppe doit porter la hauteur si les cartes s'étirent.
 */
export function Cascade({
  children,
  decalage = 0.09,
  className = '',
  classeEnfant = '',
}: {
  children: ReactNode;
  decalage?: number;
  className?: string;
  classeEnfant?: string;
}) {
  return (
    <div className={className}>
      {Children.map(children, (enfant, i) => (
        <ElementCascade delai={i * decalage} className={classeEnfant}>
          {enfant}
        </ElementCascade>
      ))}
    </div>
  );
}
