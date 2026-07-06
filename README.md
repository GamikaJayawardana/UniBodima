# BoardingFor.me

A full-stack housing marketplace that connects Sri Lankan university students with verified boarding places, hostels, and apartments near their campuses. Students can browse listings by university, post their own boarding offers or housing requests, and manage everything from a personal dashboard — while admins moderate content through a dedicated back office.

**Live site:** [www.boardingfor.me](https://www.boardingfor.me)

## Features

**For students & property owners**
- Browse and search housing **offers** (available rooms/apartments) and **requests** (students looking for a place), with filters for university, district, price/budget range, gender preference, room type, and amenities (Wi-Fi, AC, meals, parking, security, etc.)
- Post a listing with photo uploads, pricing, lease terms, and detailed room/building amenities
- Edit or delete your own listings, save favorites, and track views on your posts
- University landing pages showing live listing counts near each campus
- Click-to-reveal contact flow — a host's phone number is only shown after an explicit click, then a direct call action
- Report inappropriate or spam listings for moderation
- Sign in with Google or email/username + password

**Admin dashboard**
- Platform-wide stats (users, offers, requests)
- Full CRUD over every listing on the platform, not just your own
- User management with role changes (user / admin / super-admin) and account removal
- A moderation queue for user-submitted reports, with one-click dismiss or takedown

**SEO & performance**
- Server-rendered metadata per listing (Open Graph, Twitter cards, canonical URLs) so individual posts are indexable and shareable
- JSON-LD structured data (Organization, WebSite, Product/Offer) for rich search results
- Auto-generated sitemap covering every live listing and university page, plus `robots.txt`
- Security headers (HSTS, X-Frame-Options, Permissions-Policy) and hardened image loading via Next.js `remotePatterns`

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Server Components & Server Actions) |
| Language | TypeScript |
| Database | MongoDB with Mongoose |
| Auth | NextAuth.js (Google OAuth + credentials) |
| Image hosting | Cloudinary |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |

## Architecture Notes

- **Server Actions over a REST layer** — all data mutations (`src/app/actions/*`) run as Next.js Server Actions directly from client components, removing the need for a separate API layer for CRUD operations.
- **Two post types, one experience** — housing offers and requests are modeled as separate Mongoose collections (`OfferPost`, `RequestPost`) since they carry very different fields, but are merged and sorted together wherever the UI needs a unified feed.
- **Hybrid rendering for SEO** — listing detail pages are server components that fetch data for `generateMetadata` and initial paint, then hand off to a client component for interactivity (image carousel, save/report actions), so search engines see fully-rendered content without sacrificing UX.
- **Role-based authorization** — session role (`user` / `admin` / `super-admin`) is checked server-side in every mutating action, not just hidden in the UI.

## Getting Started

### Prerequisites
- Node.js 18.18+
- A MongoDB database (Atlas or self-hosted)
- A Cloudinary account (for image uploads)
- A Google Cloud OAuth client (for Google sign-in)

### Setup

```bash
git clone <repository-url>
cd boardingfor-me
npm install
cp .env.example .env.local
# fill in .env.local with your own MongoDB URI, NextAuth secret,
# Google OAuth credentials, and Cloudinary URL
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── actions/        # Server Actions (auth, posts, admin, users)
│   ├── admin/           # Admin dashboard (stats, users, posts, reports)
│   ├── api/auth/        # NextAuth route handler
│   ├── posts/[id]/      # Listing detail page (SSR metadata + client view)
│   ├── university/[slug]/  # Per-university landing pages
│   └── ...              # Offers, requests, dashboard, profile, auth pages
├── components/          # Shared UI (Navbar, Footer, PostCard, forms, etc.)
├── lib/                 # Database connection, constants
└── models/              # Mongoose schemas (User, OfferPost, RequestPost, Report)
```

## License

This project is provided for portfolio and demonstration purposes.
