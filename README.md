# Remote German Auto Feature Unlock Platform MVP

Production-minded MVP foundation built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Supabase scaffolding, and Stripe Checkout starter route.

## Stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase JS client + schema proposal
- Stripe Checkout starter API route

## Route map
### Public marketing
- /
- /how-it-works
- /supported-vehicles
- /features
- /pricing
- /faq
- /contact

### Vehicle + order flow
- /check-compatibility
- /check-compatibility/results
- /checkout/[packageId]
- /booking/[orderId]
- /setup-instructions/[orderId]

### Auth + customer
- /login
- /signup
- /dashboard
- /dashboard/orders
- /dashboard/vehicles
- /dashboard/sessions
- /dashboard/settings

### Admin foundation
- /admin
- /admin/orders
- /admin/sessions
- /admin/vehicles
- /admin/features
- /admin/customers

## Core components
- Navbar, Footer
- PremiumSection, HeroShell, PremiumCTA
- BrandPill, FeatureCard, PricingCard
- CompatibilityForm, CompatibilityResultCard
- DashboardShell, BookingTimeline, SetupChecklist
- OrderStatusBadge, VehicleCard, SessionCard
- AdminDataTable, EmptyState, FAQAccordion

## Data model files
- `lib/types/domain.ts`: app-level domain types
- `lib/types/database.ts`: Supabase typed table map
- `supabase/schema.sql`: schema proposal
- `supabase/seed.sql`: BMW-first example seed
- `lib/data/mock.ts`: realistic mock data for UI + logic

## Integration notes
### Supabase
1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Replace placeholder auth forms in `/login` and `/signup` with Supabase auth calls.
3. Migrate mock reads to server actions using generated types from `lib/types/database.ts`.

### Stripe
1. Set `STRIPE_SECRET_KEY`.
2. Update success/cancel URLs for deployment domain.
3. Pass real line items from selected feature/package.

## Development
```bash
npm install
npm run dev
```

### Database migrations
Run the following SQL files against your Supabase project in order:

1. `supabase/schema.sql` — base tables and constraints
2. `supabase/rls-policies.sql` — row-level security policies
3. `supabase/indexes-and-triggers.sql` — performance indexes and `updated_at` triggers
4. `supabase/seed.sql` — sample BMW vehicle configs, features, and compatibility rules
