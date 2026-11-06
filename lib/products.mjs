export const products = Object.freeze({
  front: { name: 'FBM Account Unlock', amount: 19, next: '/upsell1' },
  upsell1: { name: 'Done For You Account Setup', amount: 99.99, next: '/upsell2' },
  upsell2: { name: 'Account Payout Lock', amount: 79, next: '/upsell3' },
  upsell2_downsell: { name: 'Account Payout Lock — Discount', amount: 54, next: '/upsell3' },
  upsell3: { name: 'Account Fast Track', amount: 97, next: '/upsell4' },
  upsell3_downsell: { name: 'Account Fast Track — Discount', amount: 57, next: '/upsell4' },
  upsell4: { name: 'Pro Account Tier', amount: 95, next: '/upsell5' },
  upsell4_downsell: { name: 'Pro Account Tier — Discount', amount: 45, next: '/upsell5' },
  upsell5: { name: 'Account Coach', amount: 997, next: '/thankyou' },
  upsell5_downsell_497: { name: 'Account Coach — $497 Offer', amount: 497, next: '/thankyou' },
  upsell5_downsell_297: { name: 'Account Coach — $297 Offer', amount: 297, next: '/thankyou' },
  upsell5_downsell_97: { name: 'Account Coach — $97 Offer', amount: 97, next: '/thankyou' }
});

export function getProduct(id) {
  const product = products[id];
  if (!product) throw new Error('Unknown product');
  return { id, ...product, currency: 'USD' };
}
