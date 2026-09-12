import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import { useProgression } from './scroll/primitives';
import { useHoraires } from '../lib/use-horaires';
import { resumeCompact } from '../lib/opening-hours';

/**
 * Bandeau défilant — le moment que la visiteuse doit retenir.
 *
 * Quatre repères traversent l'écran de droite à gauche, en grand, comme un
 * générique. Rien d'invérifiable n'y figure : les horaires sont lus en base,
 * et aucun chiffre ne prétend mesurer quoi que ce soit.
 *
 * La profondeur vient de l'écart de vitesse entre deux pistes. Une seule se
 * lirait comme un glissement ; deux, dont l'une plus petite et plus lente, se
 * lisent comme un relief.
 *
 * L'écho d'arrière-plan ne porte que les titres. Y remettre les sous-titres
 * donnait du texte à 1,7 de contraste : illisible, mais assez présent pour
 * qu'on essaie de le lire.
 */

interface Repere {
  titre: string;
  detail: string;
}

function Piste({
  reperes,
  duree,
  classeTitre,
  classeDetail,
  classeSeparateur,
  avecDetails = true,
  cache = false,
}: {
  reperes: Repere[];
  duree: number;
  classeTitre: string;
  classeDetail?: string;
  classeSeparateur: string;
  avecDetails?: boolean;
  cache?: boolean;
}) {
  // Le contenu est rendu deux fois : la piste se déplace de la moitié de sa
  // largeur, donc la reprise tombe pile sur la copie.
  const suite = [...reperes, ...reperes];

  return (
    <div className="bandeau-piste" style={{ animationDuration: `${duree}s` }} aria-hidden={cache}>
      {suite.map((r, i) => (
        <div key={`${r.titre}-${i}`} className="flex items-baseline shrink-0">
          <span className={classeTitre}>{r.titre}</span>
          {avecDetails && classeDetail && <span className={classeDetail}>{r.detail}</span>}
          <span className={classeSeparateur} aria-hidden="true">
            ◆
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BandeauDefilant() {
  const horaires = resumeCompact(useHoraires());
  const section = useRef<HTMLElement>(null);
  const progression = useProgression(section);

  // Les deux pistes dérivent verticalement à des amplitudes différentes pendant
  // que la section traverse l'écran. Le fond bouge moins que le premier plan,
  // comme un décor vu depuis un train.
  const derivePremierPlan = useTransform(progression, [0, 1], ['5%', '-5%']);
  const deriveArrierePlan = useTransform(progression, [0, 1], ['16%', '-16%']);

  // Le sol dérive pendant la traversée : profond aux bords, ouvert au centre.
  // Les trois paliers restent dans la même famille d'espresso — dériver vers une
  // autre couleur au milieu d'une page n'est pas une atmosphère, c'est une
  // visiteuse qui se demande si elle a changé de site.
  const sol = useTransform(progression, [0, 0.5, 1], ['#19140E', '#241D14', '#19140E']);

  const reperes: Repere[] = [
    { titre: 'Head Spa', detail: 'Rituel japonais thermal' },
    { titre: 'Privatif', detail: 'Boudoir intimiste' },
    { titre: 'Le Pré', detail: 'Saint-Gervais · 2 min de Paris' },
    {
      titre: horaires ? horaires.jours : 'Sur rendez-vous',
      detail: horaires ? `${horaires.horaires} · sur rendez-vous` : 'Nous consulter',
    },
  ];

  return (
    <motion.section
      ref={section}
      aria-label="L'Atelier by Lola en quatre repères"
      className="relative overflow-hidden py-12 md:py-16"
      style={{ backgroundColor: sol }}
    >
      {/* Grain : un aplat sombre moisonne sur les écrans réels. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      {/* Pas de fondu aux bords : sur une bande de 284 px, un dégradé haut et
          bas mange la moitié de la hauteur et se lit comme un flou, pas comme
          une lumière. Le raccord avec la page est franc, et c'est la dérive du
          sol, plus lente que l'œil, qui l'empêche d'être une cassure. */}

      <div className="bandeau-masque relative w-full">
        {/* Écho d'arrière-plan : titres seuls, plus petits, plus lents. */}
        <motion.div style={{ y: deriveArrierePlan }} className="mb-3 md:mb-5">
          <Piste
            cache
            avecDetails={false}
            reperes={reperes}
            duree={104}
            classeTitre="font-serif text-2xl md:text-4xl font-normal text-[#8A6A38] whitespace-nowrap"
            classeSeparateur="mx-10 md:mx-16 text-[#8A6A38] text-xs self-center"
          />
        </motion.div>

        {/* Premier plan : le message. */}
        <motion.div style={{ y: derivePremierPlan }}>
          <Piste
            reperes={reperes}
            duree={58}
            classeTitre="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#F5ECDC] whitespace-nowrap"
            classeDetail="ml-4 md:ml-7 text-[11px] md:text-sm uppercase tracking-[0.32em] text-[#C9A96B]"
            classeSeparateur="mx-10 md:mx-20 text-[#C9A96B] text-sm md:text-lg self-center"
          />
        </motion.div>

      </div>
    </motion.section>
  );
}
