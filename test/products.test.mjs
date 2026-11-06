import test from 'node:test';
import assert from 'node:assert/strict';
import { getProduct, products } from '../lib/products.mjs';

test('front-end product starts the recovered funnel at $19', () => {
  assert.equal(getProduct('front').amount, 19);
  assert.equal(getProduct('front').next, '/upsell1');
});

test('every product has a valid positive amount and internal next route', () => {
  for (const [id, product] of Object.entries(products)) {
    assert.ok(product.amount > 0, `${id} must have a positive amount`);
    assert.match(product.next, /^\//, `${id} must use an internal next route`);
  }
});

test('recovered upsell and downsell prices match the source funnel', () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(products).map(([id, product]) => [id, product.amount])),
    {
      front: 19,
      upsell1: 99.99,
      upsell2: 79,
      upsell2_downsell: 54,
      upsell3: 97,
      upsell3_downsell: 57,
      upsell4: 95,
      upsell4_downsell: 45,
      upsell5: 997,
      upsell5_downsell_497: 497,
      upsell5_downsell_297: 297,
      upsell5_downsell_97: 97
    }
  );
});
