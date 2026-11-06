import { readFile, writeFile } from 'node:fs/promises';

const serverPath = new URL('../server.mjs', import.meta.url);
let server = await readFile(serverPath, 'utf8');
server = server
  .replace(/function syncOfferPricing\(pathname,html\)\{[\s\S]*?\r?\n\}\r?\n\r?\nasync function api/, 'function syncOfferPricing(pathname,html){ return html; }\n\nasync function api')
  .replaceAll('wificode-admin', 'accounts-for-cash-admin')
  .replaceAll('invoice:`WC-${order.id}`', 'invoice:`AFC-${order.id}`')
  .replaceAll('invoice:`WC-R-${audit.id}`', 'invoice:`AFC-R-${audit.id}`')
  .replaceAll('filename="wificode-leads-', 'filename="accounts-for-cash-leads-')
  .replaceAll('filename="wificode-sold-leads-', 'filename="accounts-for-cash-sold-leads-')
  .replaceAll('No approved WiFiCode purchase was found', 'No approved Accounts For Cash purchase was found');
await writeFile(serverPath, server, 'utf8');

const adminPath = new URL('../public/admin.html', import.meta.url);
let admin = await readFile(adminPath, 'utf8');
admin = admin.replaceAll('thanks for checking out WiFi Code', 'thanks for checking out Accounts For Cash');
await writeFile(adminPath, admin, 'utf8');
