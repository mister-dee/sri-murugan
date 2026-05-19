# Sri Murugan Coconut Wholesale

Production-ready fullstack ordering platform for a local coconut and oil wholesale shop.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style reusable components
- Supabase PostgreSQL
- Supabase Auth for admin login
- Mobile-first responsive UI

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor.
3. Copy project URL, anon key, and service role key into `.env.local`.
4. Create admin users in Supabase Auth.
5. Add allowed admin emails to `ADMIN_EMAILS`.

The app reads products, daily rates, and shop status publicly. Orders are written through server API routes using the service role key, and admin pages are protected by Supabase Auth plus the `ADMIN_EMAILS` allowlist.

## Important Routes

- `/` - QR-friendly public ordering homepage
- `/qr` - compact landing page for printed QR codes
- `/api/orders` - create and list orders
- `/api/rates` - read and update daily rates
- `/api/shop-status` - read and update shop status
- `/admin` - admin dashboard
- `/admin/orders` - order management
- `/admin/rates` - daily rate updates
- `/admin/products` - product management
- `/admin/settings` - shop status and pickup details

## Folder Structure

```text
app/
  api/
    orders/route.ts
    rates/route.ts
    shop-status/route.ts
  admin/
    actions.ts
    login/
    orders/
    products/
    rates/
    settings/
  qr/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  admin/
  site/
  ui/
lib/
  supabase/
  admin-data.ts
  auth.ts
  config.ts
  data.ts
  fallback-data.ts
  format.ts
  types.ts
  validators.ts
  whatsapp.ts
public/
  coconut-market.png
supabase/
  migrations/001_initial_schema.sql
middleware.ts
```

## Deploy

Deploy on Vercel or any Next.js host. Add the environment variables from `.env.example`, run the Supabase migration first, and keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
