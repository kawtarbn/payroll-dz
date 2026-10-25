export const bands = [
  { lower: 0, upper: 20000, rate: 0 },
  { lower: 20000, upper: 40000, rate: .23 },
  { lower: 40000, upper: 80000, rate: .27 },
  { lower: 80000, upper: 160000, rate: .30 },
  { lower: 160000, upper: 320000, rate: .33 },
  { lower: 320000, upper: Infinity, rate: .35 },
];
export function calculate(input) {
  const value = (key, fallback = 0) => {
    const n = Number(input[key] ?? fallback);
    if (!Number.isFinite(n) || n < 0) throw new Error('Enter valid, non-negative amounts.');
    return n;
  };
  const base = value('base'), experience = base * value('experience') / 100;
  const hours = value('monthlyHours', 173.33);
  if (!hours) throw new Error('Monthly working hours must be greater than zero.');
  const overtime = base / hours * 1.5 * value('overtime');
  const gross = base + experience + overtime + value('bonus');
  const cnas = gross * .09, taxable = gross - cnas;
  const grossTax = bands.reduce((tax, band) => tax + Math.max(0, Math.min(taxable, band.upper) - band.lower) * band.rate, 0);
  const abatement = Math.min(grossTax, Math.min(1500, Math.max(1000, grossTax * .4)));
  const afterAbatement = grossTax - abatement;
  let tax = afterAbatement;
  // The document names IRGcalc in the smoothing formula ambiguously.
  // Apply smoothing to tax after the standard abatement for a continuous exemption boundary.
  if (taxable <= 30000) tax = 0;
  else if (input.special && taxable <= 42500) tax = afterAbatement * 93 / 61 - 81213 / 41;
  else if (taxable <= 35000) tax = afterAbatement * 137 / 51 - 27925 / 8;
  tax = Math.max(0, tax);
  const allowances = value('meal') + value('transport'), deductions = value('deductions');
  const employerCnas = gross * .255;
  return { base, experience, overtime, gross, cnas, taxable, grossTax, abatement, tax, allowances, deductions, net: gross - cnas - tax + allowances - deductions, employerCnas, employerCost: gross + employerCnas + allowances };
}
