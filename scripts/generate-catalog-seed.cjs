// Extrait SERVICE_CATALOG du fichier TypeScript et produit le SQL de peuplement.
const fs = require('fs');

const src = fs.readFileSync('src/lib/service-catalog.ts', 'utf8');
const debut = src.indexOf('export const SERVICE_CATALOG');
const apresEgal = src.indexOf('= [', debut) + 2;
const corps = src.slice(apresEgal);
// Fin du tableau : premier crochet fermant qui rééquilibre l'ouverture.
// Le fichier contient d'autres exports ensuite, un lastIndexOf en avalerait trop.
let profondeur = 0;
let fin = -1;
for (let i = 0; i < corps.length; i++) {
  const c = corps[i];
  if (c === '[') profondeur++;
  else if (c === ']') {
    profondeur--;
    if (profondeur === 0) { fin = i; break; }
  }
}
if (fin === -1) throw new Error('tableau SERVICE_CATALOG non délimité');
const tableau = corps.slice(0, fin + 1);

// eslint-disable-next-line no-eval
const catalogue = eval(tableau);

console.error(`${catalogue.length} prestations extraites`);

const esc = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const num = (v) => (v === null || v === undefined ? 'null' : String(v));
const bool = (v) => (v ? 'true' : 'false');

const lignesServices = [];
const lignesUpsells = [];

catalogue.forEach((s, i) => {
  lignesServices.push(
    `  (${esc(s.id)}, ${esc(s.name)}, ${esc(s.category)}, ${esc(s.description)}, ` +
      `${num(s.price)}, ${num(s.duration_min)}, ${esc(s.duration_label)}, ` +
      `${bool(s.priceOnQuote)}, ${esc(s.priceNote ?? null)}, ${i * 10})`,
  );
  (s.upsells || []).forEach((u, j) => {
    lignesUpsells.push(
      `  (${esc(u.id)}, ${esc(s.id)}, ${esc(u.name)}, ${num(u.price)}, ${esc(u.description)}, ${j * 10})`,
    );
  });
});

const sql = `-- Peuplement du catalogue depuis src/lib/service-catalog.ts
-- ${catalogue.length} prestations, ${lignesUpsells.length} finitions.

INSERT INTO public.services
  (id, name, category, description, price, duration_min, duration_label, price_on_quote, price_note, sort_order)
VALUES
${lignesServices.join(',\n')}
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.service_upsells
  (id, service_id, name, price, description, sort_order)
VALUES
${lignesUpsells.join(',\n')}
ON CONFLICT (id) DO NOTHING;
`;

fs.writeFileSync(process.argv[2], sql);
console.error(`SQL écrit : ${lignesServices.length} services, ${lignesUpsells.length} finitions`);
