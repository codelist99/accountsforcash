import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const origin = 'https://accountsforcash.com';
const pages = [
  { source: '/fbm/vsl/?affid=affidhere', target: 'index.html' },
  { source: '/fbm/vsl/?affid=affidhere', target: 'fbm/vsl/index.html' },
  ...[1, 2, 3, 4, 5].map(number => ({ source: `/fbm/upsell${number}/`, target: `upsell${number}/index.html` })),
  { source: '/fbm/thank-you/', target: 'thankyou/index.html' }
];

const replacements = [
  ['https://explodely.com/p/1626475473?cid=fbm-fe-19', '/checkout?product=front'],
  ['https://explodely.com/p/1522001582?ocu=yes', '#purchase-upsell1'],
  ['https://explodely.com/p/576045853?ocu=yes&amp;cid=fbm-lock-54', '#purchase-upsell2_downsell'],
  ['https://explodely.com/p/576045853?ocu=yes', '#purchase-upsell2'],
  ['https://explodely.com/p/958657524?ocu=yes&amp;cid=fbm-fast-57', '#purchase-upsell3_downsell'],
  ['https://explodely.com/p/958657524?ocu=yes', '#purchase-upsell3'],
  ['https://explodely.com/p/1857878249?ocu=yes&amp;cid=fbm-high-45', '#purchase-upsell4_downsell'],
  ['https://explodely.com/p/1857878249?ocu=yes', '#purchase-upsell4'],
  ['https://explodely.com/p/45460031?ocu=yes&amp;cid=fbm-vip-497', '#purchase-upsell5_downsell_497'],
  ['https://explodely.com/p/45460031?ocu=yes&amp;cid=fbm-vip-297', '#purchase-upsell5_downsell_297'],
  ['https://explodely.com/p/45460031?ocu=yes&amp;cid=fbm-vip-97', '#purchase-upsell5_downsell_97'],
  ['https://explodely.com/p/45460031?ocu=yes', '#purchase-upsell5'],
  ['/fbm/upsell1/', '/upsell1'], ['/fbm/upsell2/', '/upsell2'],
  ['/fbm/upsell3/', '/upsell3'], ['/fbm/upsell4/', '/upsell4'],
  ['/fbm/upsell5/', '/upsell5'], ['/fbm/thank-you/', '/thankyou']
];

function localize(html) {
  html = html.replaceAll('href="/fbm/assets/', `href="${origin}/fbm/assets/`)
    .replaceAll('src="/fbm/assets/', `src="${origin}/fbm/assets/`)
    .replaceAll('href="/fbm/disclaimers/', `href="${origin}/fbm/disclaimers/`);
  for (const [from, to] of replacements) html = html.replaceAll(from, to);
  if (!html.includes('/assets/funnel.js')) html = html.replace(/<\/body>/i, '<script src="/assets/funnel.js" defer></script><script src="/assets/tracker.js" defer></script></body>');
  return html;
}

const results = [];
for (const page of pages) {
  const response = await fetch(`${origin}${page.source}`, { headers: { 'user-agent': 'Mozilla/5.0 AccountsForCash authorized mirror' } });
  if (!response.ok) throw new Error(`${page.source}: HTTP ${response.status}`);
  const html = localize(await response.text());
  const output = join(process.cwd(), page.target);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html, 'utf8');
  results.push({ ...page, bytes: Buffer.byteLength(html) });
}
await writeFile('mirror-manifest.json', JSON.stringify({ source: origin, generatedAt: new Date().toISOString(), pages: results }, null, 2));
console.table(results);
