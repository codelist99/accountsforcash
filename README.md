# Accounts For Cash

Authorized mirror of the Accounts For Cash FBM funnel, migrated from Explodely checkout to an isolated Authorize.Net checkout and Neon Postgres reporting database.

## Funnel

`/` → `/checkout` ($19) → `/upsell1` → `/upsell2` → `/upsell3` → `/upsell4` → `/upsell5` → `/thankyou`

The product catalog and verified source prices live in `lib/products.mjs`. The standard campaign admin dashboard is available at `/admin`, and the standard onboarding/support page is available at `/thankyou`.

Production domain: `https://www.accounts4cash.dev`

## Configuration

Copy `.env.example` to `.env` for local development. Production secrets belong in the Accounts For Cash Vercel project only. Do not copy WiFi Code, CashTap AI, or another offer's database URL into this project.

Required services:

- Dedicated Neon Postgres resource: `accountsforcash-data` (`twilight-wave-85191546`)
- Authorize.Net API login ID, transaction key, and public client key
- Unique session and cron secrets

The Neon resource is connected to the Accounts For Cash Vercel project for Production, Preview, and Development. Payment credentials are configured for Production only so preview deployments cannot submit live transactions.

Run `npm install`, `npm run mirror`, and `npm start`.
