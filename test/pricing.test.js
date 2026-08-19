'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { subtotal, memberTotal, saleTotal, couponTotal } = require('../src/pricing');

const lines = [{ unitCents: 1999, qty: 2 }, { unitCents: 505, qty: 1 }];

test('subtotal', () => {
  assert.equal(subtotal(lines), 4503);
});

test('member discount is 10%', () => {
  assert.equal(memberTotal(lines), 4053);
});

test('sale discount', () => {
  assert.equal(saleTotal(lines, 25), 3377);
});

test('coupons', () => {
  assert.equal(couponTotal(lines, { kind: 'percent', value: 50 }), 2251);
  assert.equal(couponTotal(lines, { kind: 'fixed', value: 10000 }), 0);
});
