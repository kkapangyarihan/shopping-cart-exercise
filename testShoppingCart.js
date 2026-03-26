import assert from 'assert';
import fs from 'fs';
import ShoppingCart from './ShoppingCart.js';

const pricingRules = JSON.parse(fs.readFileSync('products.json', 'utf8'));

// Test 1: 3 x Unlimited 1 GB, 1 x Unlimited 5 GB
(() => {
  const cart = new ShoppingCart(pricingRules);
  cart.add("ult_small");
  cart.add("ult_small");
  cart.add("ult_small");
  cart.add("ult_large");
  assert.strictEqual(cart.total, 94.70);
  console.log("Test 1 passed");
})();

// Test 2: 2 x Unlimited 1 GB, 4 x Unlimited 5 GB
(() => {
  const cart = new ShoppingCart(pricingRules);
  cart.add("ult_small");
  cart.add("ult_small");
  cart.add("ult_large");
  cart.add("ult_large");
  cart.add("ult_large");
  cart.add("ult_large");
  assert.strictEqual(Number(cart.total.toFixed(2)), 209.40);
  console.log("Test 2 passed");
})();

// Test 3: 1 x Unlimited 1 GB, 2 X Unlimited 2 GB
(() => {
  const cart = new ShoppingCart(pricingRules);
  cart.add("ult_small");
  cart.add("ult_medium");
  cart.add("ult_medium");
  assert.strictEqual(Number(cart.total.toFixed(2)), 84.70);
  console.log("Test 3 passed");
})();

// Test 4: 1 x Unlimited 1 GB, 1 x 1 GB Data-pack, 'I<3AMAYSIM' Promo Applied
(() => {
  const cart = new ShoppingCart(pricingRules);
  cart.add("ult_small");
  cart.add("1gb", "I<3AMAYSIM");
  assert.strictEqual(Number(cart.total.toFixed(2)), 31.32);
  console.log("Test 4 passed");
})();