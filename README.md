# EnergyOS

Independent energy intelligence for homes, businesses and energy installers.

EnergyOS is a front-end product prototype built around four connected pillars:

1. **Consumption** — understand when and where energy is being used.
2. **Generation** — weather-adjusted solar performance and self-consumption.
3. **Grid & tariffs** — model import, export and time-of-use economics together.
4. **Asset health** — monitor equipment performance, degradation and warranty conditions.

The product is intentionally designed as a **decision engine rather than another dashboard**. It surfaces the recommended action, its expected financial value, confidence and timing.

## Included screens

- Overview — EnergyOS score, live energy flow, four-pillar status and prioritised actions.
- Optimise — ranked recommendations, payback and decision rules.
- Assets — cross-manufacturer asset health and warranty view.
- Tariffs — independent whole-system tariff modelling.
- Insights — quarterly performance and optimisation reporting.
- Installer — customer fleet monitoring, service triage and upgrade opportunities.
- Responsive mobile navigation and layout.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The app is Vite + React and is ready for static deployment to Vercel, Netlify, Cloudflare Pages or GitHub Pages.

## Next production integrations

The current repository contains realistic demo data so the complete product flow can be evaluated immediately. Production rollout should connect the same interface to:

- smart-meter / half-hourly consumption data,
- solar and inverter OEM APIs,
- battery and EV charger APIs,
- tariff and export-rate data feeds,
- irradiance / weather data,
- warranty and equipment manuals,
- installer CRM and service-management systems.

The recommended architecture keeps OEM integrations behind adapters so EnergyOS remains independent of any single equipment manufacturer or energy supplier.
