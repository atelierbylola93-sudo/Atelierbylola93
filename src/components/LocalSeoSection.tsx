import { INSTITUT_INFO } from '../data';
import { useHoraires } from '../lib/use-horaires';
import { resumerHoraires } from '../lib/opening-hours';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

interface LocalSeoSectionProps {
  serviceName: string;
  serviceDescription: string;
  url: string;
  /** Accent color used for icons and highlights (default: gold). */
  accent?: string;
}

/**
 * Bloc SEO local : adresse, horaires, téléphone + schema.org Service
 * rattaché au BeautySalon (LocalBusiness) déjà présent dans le footer.
 */
export default function LocalSeoSection({
  serviceName,
  serviceDescription,
  url,
  accent = '#B88F4D',
}: LocalSeoSectionProps) {
  const lignesHoraires = resumerHoraires(useHoraires());

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: serviceDescription,
    url,
    provider: {
      '@type': 'BeautySalon',
      name: INSTITUT_INFO.name,
      telephone: INSTITUT_INFO.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '10 rue du 14 juillet',
        addressLocality: 'Le Pré-Saint-Gervais',
        postalCode: '93310',
        addressRegion: 'Seine-Saint-Denis',
        addressCountry: 'FR',
      },
    },
    areaServed: [
      'Le Pré-Saint-Gervais',
      'Pantin',
      'Les Lilas',
      'Paris 19e',
      'Paris 20e',
    ],
  };

  return (
    <section
      aria-label="Informations pratiques et accès"
      className="max-w-7xl mx-auto px-4 md:px-8 py-16"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <div className="bg-white rounded-[24px] border border-[#B88F4D]/25 shadow-sm p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-8 border-b border-[#B88F4D]/15">
          <div>
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-bold block mb-2"
              style={{ color: accent }}
            >
              Accès & Informations
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-medium">
              Votre rendez-vous au cœur du Pré-Saint-Gervais
            </h2>
          </div>
          <a
            href="https://maps.google.com/?q=10+Rue+du+14+Juillet,+93310+Le+Pr%C3%A9-Saint-Gervais"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity"
            style={{ color: accent }}
          >
            <Navigation className="h-4 w-4" />
            Itinéraire Google Maps
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="flex items-start gap-4">
            <div
              className="h-11 w-11 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${accent}1A` }}
            >
              <MapPin className="h-5 w-5" style={{ color: accent }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-charcoal mb-1">Adresse</h3>
              <address className="not-italic text-sm text-secondary-gray leading-relaxed">
                10 rue du 14 juillet<br />
                93310 Le Pré-Saint-Gervais<br />
                <span className="text-xs">(proche Pantin, Les Lilas, Paris 19e)</span>
              </address>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div
              className="h-11 w-11 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${accent}1A` }}
            >
              <Clock className="h-5 w-5" style={{ color: accent }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-charcoal mb-1">Horaires</h3>
              <p className="text-sm text-secondary-gray leading-relaxed">
                {lignesHoraires.length > 0 ? (
                  lignesHoraires.map((l) => (
                    <span key={l}>
                      {l}
                      <br />
                    </span>
                  ))
                ) : (
                  <span>{INSTITUT_INFO.hours}</span>
                )}
                <span className="text-xs">Sur rendez-vous uniquement</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div
              className="h-11 w-11 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${accent}1A` }}
            >
              <Phone className="h-5 w-5" style={{ color: accent }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-charcoal mb-1">Contact</h3>
              <a
                href={`tel:${INSTITUT_INFO.phoneFormatted}`}
                className="text-sm text-secondary-gray hover:text-charcoal transition-colors block"
              >
                {INSTITUT_INFO.phone}
              </a>
              <a
                href="/reservation"
                className="text-xs font-semibold uppercase tracking-wider mt-1 inline-block hover:opacity-70 transition-opacity"
                style={{ color: accent }}
              >
                Réserver en ligne 24h/24
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
