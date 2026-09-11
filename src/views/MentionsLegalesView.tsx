import { INSTITUT_INFO } from '../data';

export default function MentionsLegalesView() {
  return (
    <div className="w-full pt-28 pb-16 bg-[#EFE7D2]">
      <section className="max-w-3xl mx-auto px-4 md:px-8 space-y-8">
        <header className="space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B88F4D] font-bold">Informations légales</span>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal font-light tracking-wide">
            Mentions légales
          </h1>
          <div className="h-[1px] w-16 bg-[#B88F4D]" />
        </header>

        <div className="bg-white rounded-2xl border border-[#B88F4D]/15 shadow-sm p-6 md:p-8 space-y-6 text-charcoal/85 text-base leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl text-charcoal font-medium">Éditeur du site</h2>
            <p>
              <strong>{INSTITUT_INFO.name}</strong><br />
              Institut de beauté et de coiffure<br />
              {INSTITUT_INFO.address}<br />
              Téléphone : {INSTITUT_INFO.phone}<br />
              E-mail : contact@latelierbylola.fr
            </p>
            <p className="text-sm text-secondary-gray">
              SIRET, numéro RCS et forme juridique : à compléter par le gérant.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-charcoal font-medium">Directrice de la publication</h2>
            <p>Lola — Fondatrice de L'Atelier by Lola.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-charcoal font-medium">Hébergement</h2>
            <p>
              Le site est hébergé par Vercel Inc. (vercel.com).<br />
              Pour toute question relative à l'hébergement, contactez l'éditeur du site.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-charcoal font-medium">Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus (textes, images, logo, identité visuelle) est la propriété exclusive de {INSTITUT_INFO.name}. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-charcoal font-medium">Responsabilité</h2>
            <p>
              Les informations présentées sur ce site sont fournies à titre indicatif et ne constituent en aucun cas un avis médical. Les résultats des soins peuvent varier selon la nature de la peau, des cheveux et le mode de vie de chaque personne.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
