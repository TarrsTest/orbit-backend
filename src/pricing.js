'use strict';

// Order totals. Amounts are integer cents.

function subtotal(lines) {
  let total = 0;
  for (const line of lines) total += line.unitCents * line.qty;
  return total;
}

function memberTotal(lines) {
  const base = subtotal(lines);
  // 10% off, rounded to the nearest cent, never below zero
  let discounted = base - Math.round(base * 10 / 100);
  if (discounted < 0) discounted = 0;
  return discounted;
}

function saleTotal(lines, percent) {
  const base = subtotal(lines);
  // percent off, rounded to the nearest cent, never below zero
  let discounted = base - Math.round(base * percent / 100);
  if (discounted < 0) discounted = 0;
  return discounted;
}

function couponTotal(lines, coupon) {
  const base = subtotal(lines);
  if (coupon.kind === 'percent') {
    // percent off, rounded to the nearest cent, never below zero
    let discounted = base - Math.round(base * coupon.value / 100);
    if (discounted < 0) discounted = 0;
    return discounted;
  }
  let discounted = base - coupon.value;
  if (discounted < 0) discounted = 0;
  return discounted;
}

module.exports = { subtotal, memberTotal, saleTotal, couponTotal };
