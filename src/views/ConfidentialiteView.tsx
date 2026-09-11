import { INSTITUT_INFO } from '../data';

export default function ConfidentialiteView() {
  return (
    <div className="w-full pt-28 pb-16 bg-[#EFE7D2]">
      <section className="max-w-3xl mx-auto px-4 md:px-8 space-y-8">
        <header className="space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B88F4D] font-bold">Vie privée</span>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal font-light tracking-wide">
            Politique de confidentialité & RGPD
          </h1>
          <div className="h-[1px] w-16 bg-[#B88F4D]" />
        </header>

        <div className="bg-white rounded-2xl border border-[#B88F4D]/15 shadow-sm p-6 md:p-8 space-y-6 text-charcoal/85 text-base leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl text-charcoal font-medium">Responsable du traitement</h2>
            <p>
              {INSTITUT_INFO.name} — {INSTITUT_INFO.address}. Contact : {INSTITUT_INFO.phone}.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-charcoal font-medium">Données collectées</h2>
            <p>
              Dans le cadre d'une prise de rendez-vous, nous collectons uniquement les informations nécessaires : nom, prénom, e-mail, numéro de téléphone, prestation choisie, date et heure souhaitées, ainsi qu'un éventuel message. Aucune donnée bancaire n'est stockée sur ce site.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-charcoal font-medium">Finalités</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gestion des réservations et de la relation client.</li>
              <li>Envoi de confirmations et de rappels de rendez-vous.</li>
              <li>Amélioration de nos services (statistiques anonymes).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-charcoal font-medium">Durée de conservation</h2>
            <p>
              Vos données sont conservées le temps nécessaire à la gestion de votre relation avec l'institut, et au maximum 3 ans après votre dernière visite.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-charcoal font-medium">Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition sur vos données personnelles. Pour exercer ces droits, contactez-nous à : contact@latelierbylola.fr.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-charcoal font-medium">Cookies</h2>
            <p>
              Ce site utilise uniquement des cookies techniques strictement nécessaires à son bon fonctionnement (session, préférences). Aucun cookie publicitaire n'est déposé sans votre consentement.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
