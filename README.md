# Mizan — Algeria salary calculator

A responsive, browser-only salary estimator based on the supplied salary PDF. No accounts, database, secrets, or runtime dependencies. Salary inputs stay in the browser.

## Develop and validate

Use Node.js 22 or newer in the existing checkout:

```sh
npm test
npm run build
npm run dev
```

The development server uses port 3000 (override with `PORT`). `npm run build` produces `dist/` for static hosting. Print a calculation using the Print button.

## Deploy to Vercel

Push this project to your GitHub repository, then import it into Vercel. Select **Other** as the framework if prompted. The included `vercel.json` sets build command `npm run build` and output directory `dist`. No environment variables are required. Alternatively run `npx vercel` from an authenticated local terminal and follow the deployment prompts.

## Calculation assumptions

- Employee CNAS: 9%; employer contribution estimate: 25.5%.
- Overtime: base salary divided by configurable monthly hours, multiplied by 150%. Default monthly hours: 173.33, adjustable to your contract.
- Meal and transport amounts must be the exempt portion only. Put taxable excess in bonuses.
- Uses progressive monthly IRG and the standard 40% reduction, bounded to 1,000–1,500 DA. Taxable income up to 30,000 DA is exempt.
- The supplied document ambiguously references `IRGcalc` in its smoothing formulas. The implementation uses tax **after** the standard reduction; this interpretation is disclosed in the UI and needs official confirmation before real payroll use. Special relief is selectable.
- Retains decimal precision internally; the fourth PDF example rounds intermediate IRG, so this app returns 61,865.30 DA versus the PDF's rounded 61,865 DA.
- The PDF's legal references, employer rate and exemption limits have not been independently verified. This is a calculator estimate, not a certified payroll system.

Google Fonts is optional; the interface falls back to system sans-serif fonts if unavailable. No salary data is sent to that service.
