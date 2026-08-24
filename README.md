# The Laundry Ladies

A single-page site for a premium doorstep dry cleaning and laundry-on-wheels service: interactive booking, a pricing calculator, and an administrative valet portal.

## Stack

React 19 + TypeScript, Vite 6, Tailwind CSS 4, Motion, lucide-react.

## Run locally

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server on port 3000, bound to `0.0.0.0` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |

The dev server binds `0.0.0.0`, so the site is reachable from other devices on your
network — useful for checking mobile layouts. Drop `--host=0.0.0.0` to keep it local.

No environment variables are needed. The only external runtime dependency is the
Google Fonts import at the top of `src/index.css`; offline, the fonts fall back.

## Layout

```
src/
  App.tsx                      page shell and section composition
  data.ts                      service catalogue, pricing, time slots
  types.ts                     shared domain types (Booking, ServiceItem, ...)
  components/
    BookingForm.tsx            multi-step booking flow
    PricingCalculator.tsx      itemised quote builder
    ValetPortal.tsx            admin view over bookings
    Logo.tsx                   brand mark
```
