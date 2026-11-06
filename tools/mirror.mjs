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

function standardizeThankYou(html) {
  const styles = `<style>
.standard-thanks{background:linear-gradient(135deg,#06185f,#124fb7);color:#fff;text-align:center;padding:48px 20px 54px;border-bottom:8px solid #ffd23f;font-family:Arial,Helvetica,sans-serif}
.standard-thanks h1{font-size:clamp(48px,7vw,112px);line-height:.95;margin:0 0 16px;font-weight:900;letter-spacing:-3px}.standard-thanks .thanks-sub{font:700 clamp(24px,3vw,40px)/1.15 Georgia,serif;margin:0 0 34px}.standard-thanks .complete{display:inline-block;background:#ffd23f;color:#111b38;border-radius:999px;padding:12px 26px;font-weight:900;letter-spacing:1px;margin-bottom:30px}.standard-thanks h2{font-size:clamp(38px,5vw,72px);line-height:1.08;margin:0 auto 28px;max-width:1300px;font-weight:900}.standard-thanks .phone{display:inline-block;background:#21c768;color:#fff;text-decoration:none;border-radius:16px;padding:20px 40px;font-size:clamp(42px,5vw,72px);font-weight:900;box-shadow:0 10px 0 #108e49}.standard-thanks .phone-note{font-size:20px;font-weight:700;margin:28px 0}.standard-thanks .or{font-size:34px;font-weight:900;margin:20px}.standard-thanks .schedule{display:block;max-width:1100px;margin:0 auto;background:#7c36ef;color:#fff;text-decoration:none;border-radius:16px;padding:24px 30px;font-size:clamp(35px,5vw,66px);font-weight:900;line-height:1.05;box-shadow:0 10px 0 #5220a6}.standard-thanks .refund-notice{max-width:1100px;margin:28px auto 0;border:3px solid #fff;background:#fff;color:#081b56;border-radius:12px;padding:17px 20px;font-size:clamp(15px,2vw,23px);font-weight:900;white-space:nowrap}.standard-thanks .refund-notice a{color:#124fb7}@media(max-width:720px){.standard-thanks{padding:34px 12px 42px}.standard-thanks h1{letter-spacing:-1px}.standard-thanks .refund-notice{white-space:normal}.standard-thanks .phone{padding:16px 22px}.standard-thanks .schedule{padding:20px 14px}}
</style>`;
  const hero = `<section class="standard-thanks">
  <h1>Congratulations</h1><p class="thanks-sub">Thanks for purchasing Accounts For Cash</p>
  <div class="complete">YOUR ORDER IS COMPLETE</div>
  <h2>STEP 1: CALL OUR OFFICE NOW<br>TO GET STARTED</h2>
  <a class="phone" href="tel:+12067032153">(206) 703-2153</a>
  <p class="phone-note">Tap the number or call now so our team can help you get started.</p>
  <div class="or">&mdash; OR &mdash;</div>
  <a class="schedule" href="https://cal.com/jon19/wificode-onboarding">Schedule Your Onboarding Call</a>
  <div class="refund-notice">FOR REFUNDS PLEASE EMAIL <a href="mailto:support@kairostechnologylabs.com">SUPPORT@KAIROSTECHNOLOGYLABS.COM</a></div>
</section>`;
  return html
    .replace(/<title>.*?<\/title>/i, '<title>Accounts For Cash - Order Complete</title>')
    .replace(/<\/head>/i, `${styles}</head>`)
    .replace(/<body([^>]*)>/i, `<body$1>${hero}`)
    .replaceAll('You will also get a receipt by email from Explodely. Keep it for your records.', 'A receipt will be sent to the email address used at checkout. Keep it for your records.')
    .replaceAll('tel:+12034032493', 'tel:+12067032153')
    .replaceAll('(203) 403-2493', '(206) 703-2153')
    .replaceAll('href="/fbm/members/"', 'href="https://cal.com/jon19/wificode-onboarding"')
    .replaceAll('Access the members area', 'Schedule your onboarding call')
    .replaceAll('Access Your Members Area', 'Schedule Your Onboarding Call')
    .replaceAll('Click here to log in and open your FBM account', 'Choose a convenient time for your onboarding call')
    .replaceAll('Sign in with the email address you used at checkout.', 'Use the email address and phone number provided at checkout.')
    .replace(/<p><strong>Explodely Disclaimer:<\/strong>[\s\S]*?<\/p>/i, '<p><strong>Order support:</strong> For refunds or payment assistance, email <a href="mailto:support@kairostechnologylabs.com">support@kairostechnologylabs.com</a>.</p>');
}

const results = [];
for (const page of pages) {
  const response = await fetch(`${origin}${page.source}`, { headers: { 'user-agent': 'Mozilla/5.0 AccountsForCash authorized mirror' } });
  if (!response.ok) throw new Error(`${page.source}: HTTP ${response.status}`);
  let html = localize(await response.text());
  if (page.target === 'thankyou/index.html') html = standardizeThankYou(html);
  const output = join(process.cwd(), page.target);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html, 'utf8');
  results.push({ ...page, bytes: Buffer.byteLength(html) });
}
await writeFile('mirror-manifest.json', JSON.stringify({ source: origin, generatedAt: new Date().toISOString(), pages: results }, null, 2));
console.table(results);
