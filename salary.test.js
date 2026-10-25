import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from './salary.js';
const near = (actual, expected, tolerance = .01) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);
test('PDF worked examples: gross to net', () => {
  for (const [base, net] of [[30000, 27300], [60000, 47558], [150000, 105650]]) near(calculate({ base }).net, net);
});
test('PDF earnings and deductions example retains fractional dinars', () => {
  const r = calculate({ base: 60000, experience: 10, bonus: 5000, meal: 5000, transport: 3000, deductions: 1000 });
  near(r.gross, 71000); near(r.tax, 9744.7); near(r.net, 61865.3);
});
test('progressive top bracket, overtime and employer share', () => {
  const r = calculate({ base: 400000, monthlyHours: 200, overtime: 10 });
  near(r.overtime, 30000); near(r.grossTax, 117155); near(r.employerCnas, 109650);
  near(r.net, r.gross - r.cnas - r.tax);
});
test('exemption boundary, smoothing and special relief', () => {
  near(calculate({ base: 30000 / .91 }).tax, 0);
  const normal = calculate({ base: 32000 / .91 });
  near(normal.tax, (2760 - 1104) * 137 / 51 - 27925 / 8);
  assert.ok(calculate({ base: 40000 / .91, special: true }).tax < calculate({ base: 40000 / .91 }).tax);
  near(calculate({ base: 0 }).net, 0);
});
test('reject invalid inputs', () => {
  for (const input of [{ base: -1 }, { base: Infinity }, { base: 60000, monthlyHours: 0 }]) assert.throws(() => calculate(input));
});
