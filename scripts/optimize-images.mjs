// Convertit les visuels de src/assets en WebP.
//
// Les photos étaient stockées en PNG, un format sans perte conçu pour les
// logos et les captures d'écran : quatre fichiers pesaient à eux seuls plus
// de 7 Mo, pour un premier affichage mesuré à 5,2 s sur mobile.
//
// Usage : node scripts/optimize-images.mjs [--write]
// Sans --write, le script se contente d'annoncer ce qu'il ferait.

import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const DIR = 'src/assets';
const LARGEUR_MAX = 1920;
const QUALITE = 78;
const ecrire = process.argv.includes('--write');

const ko = (n) => `${Math.round(n / 1024)} Ko`;

const fichiers = (await readdir(DIR)).filter((f) =>
  ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase()),
);

let avant = 0;
let apres = 0;
const lignes = [];

for (const f of fichiers) {
  const src = join(DIR, f);
  const poidsAvant = (await stat(src)).size;
  const entree = await readFile(src);
  const meta = await sharp(entree).metadata();

  let pipeline = sharp(entree);
  if (meta.width > LARGEUR_MAX) {
    pipeline = pipeline.resize({ width: LARGEUR_MAX, withoutEnlargement: true });
  }
  const sortie = await pipeline.webp({ quality: QUALITE, effort: 6 }).toBuffer();

  const dest = join(DIR, `${basename(f, extname(f))}.webp`);
  if (ecrire) await writeFile(dest, sortie);

  avant += poidsAvant;
  apres += sortie.length;

  const gain = Math.round((1 - sortie.length / poidsAvant) * 100);
  lignes.push(
    `${f.padEnd(32)} ${String(meta.width).padStart(5)}px  ${ko(poidsAvant).padStart(9)} -> ${ko(sortie.length).padStart(8)}  (-${gain} %)`,
  );
}

console.log(lignes.join('\n'));
console.log('-'.repeat(78));
console.log(`TOTAL${' '.repeat(34)}${ko(avant).padStart(9)} -> ${ko(apres).padStart(8)}  (-${Math.round((1 - apres / avant) * 100)} %)`);
if (!ecrire) console.log('\n(simulation — relancer avec --write pour écrire les fichiers)');
