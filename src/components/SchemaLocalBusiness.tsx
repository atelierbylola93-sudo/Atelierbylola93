import { INSTITUT_INFO } from '../data';
import { useHoraires } from '../lib/use-horaires';
import { horairesJsonLd } from '../lib/opening-hours';

export default function SchemaLocalBusiness() {
  const specifications = horairesJsonLd(useHoraires());

  const schema = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": INSTITUT_INFO.name,
    "image": "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=1200",
    "url": "https://latelierbylola.fr",
    "telephone": INSTITUT_INFO.phone,
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "10 rue du 14 juillet",
      "addressLocality": "LE PRÉ SAINT GERVAIS",
      "postalCode": "93310",
      "addressRegion": "Seine-Saint-Denis",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.8843, 
      "longitude": 2.4047
    },
    // Déclaré à Google. Annoncer une ouverture le dimanche quand l'institut est
    // fermé envoie des clientes devant une porte close : la source est la base.
    "openingHoursSpecification": specifications,
    "sameAs": [
      INSTITUT_INFO.instagramUrl,
      INSTITUT_INFO.tiktokUrl
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
