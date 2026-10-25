import { calculate } from './salary.js';
const form = document.querySelector('form');
const format = n => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
function update() {
  if (!form.checkValidity()) { document.querySelector('#error').textContent = 'Complete all fields with valid, non-negative numbers. Monthly hours must be greater than zero.'; document.querySelector('.results').style.opacity = '.4'; return; }
  try {
    const data = Object.fromEntries(new FormData(form));
    data.special = form.elements.special.checked;
    const r = calculate(data);
    document.querySelector('#error').textContent = '';
    document.querySelector('.results').style.opacity = '1';
    for (const key of ['gross', 'cnas', 'taxable', 'tax', 'allowances', 'deductions', 'employerCnas', 'employerCost']) {
      document.getElementById(key).textContent = (['cnas', 'tax', 'deductions'].includes(key) ? '− ' : key === 'allowances' ? '+ ' : '') + format(r[key]) + ' DA';
    }
    document.querySelector('#net').textContent = format(r.net);
    document.querySelector('#net-total').textContent = format(r.net) + ' DA';
    const takehome = Math.max(0, r.gross - r.cnas - r.tax);
    for (const [id, n] of [['net', takehome], ['cnas', r.cnas], ['tax', r.tax]]) document.getElementById(id + '-bar').style.width = `${r.gross ? n / r.gross * 100 : 0}%`;
    document.querySelector('#net-percent').textContent = `${r.gross ? (takehome / r.gross * 100).toFixed(1) : '0'}% of gross`;
    document.querySelector('#minimum-note').textContent = Number(data.base) < 24000 ? 'Below the 24,000 DA monthly SNMG stated in the source.' : 'Before contributions and income tax.';
    document.querySelector('#tax-note').textContent = r.taxable <= 30000 ? 'Exempt: taxable salary ≤ 30,000 DA' : 'Progressive tax, after relief';
  } catch (e) { document.querySelector('#error').textContent = e.message; }
}
form.addEventListener('input', update);
form.addEventListener('submit', e => e.preventDefault());
document.querySelector('#reset').onclick = () => { form.reset(); update(); };
document.querySelector('#print').onclick = () => window.print();
for (const button of document.querySelectorAll('[data-example]')) button.onclick = () => {
  form.reset();
  const full = button.dataset.example === 'full';
  form.elements.base.value = full ? 60000 : button.dataset.example;
  if (full) for (const [key, value] of Object.entries({ experience: 10, bonus: 5000, meal: 5000, transport: 3000, deductions: 1000 })) form.elements[key].value = value;
  update();
};
update();
