# NovaNest — Production Website

**"A New Way of Living"** — A community-driven experience company creating spaces to reconnect with yourself, others, and nature.

**Stack:** Next.js 16 · MongoDB + Mongoose · NextAuth.js · Cal.com · Resend · Zod · Upstash

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in all values (see Environment Variables section below)

# 3. Seed the database (creates admin user + default services)
npm run seed

# 4. Start dev server
npm run dev
```

Visit `http://localhost:3000` · Admin at `/admin`

**Default login:** `admin@novanest.com` / `novanest2024!`
**Change this immediately** — update the password in MongoDB Atlas after first login.

---

## Environment Variables

```env
# MongoDB Atlas connection string
MONGODB_URI="mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/novanest?retryWrites=true&w=majority"

# Auth — generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"  # → https://yourdomain.com in production

# Email (Resend — resend.com, free tier is generous)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="NovaNest <hello@yourdomain.com>"
EMAIL_TO="your@email.com"

# Cal.com (your cal.com username)
NEXT_PUBLIC_CAL_USERNAME="your-cal-username"
CAL_WEBHOOK_SECRET="your-webhook-secret"

# Rate limiting (Upstash — upstash.com, free tier)
# Leave empty to disable in development
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxxx"
```

---

## Cal.com Setup

1. Create account at [cal.com](https://cal.com)
2. Create **Event Types** with these exact slugs:
   - `nature-half-day` (240 min)
   - `movement-expression` (75 min)
   - `sound-healing` (60 min)
   - `breathwork` (75 min)
   - `leadership-intro` (180 min)
   - `retreat-info` (30 min, free)
3. Set your working hours and availability in Cal.com
4. **Webhooks** → Add endpoint: `https://yourdomain.com/api/bookings`
   - Events: `BOOKING_CREATED`, `BOOKING_CANCELLED`
   - Copy the signing secret → set as `CAL_WEBHOOK_SECRET`

---

## Replacing Placeholders

Search for `***` in the codebase. Every instance needs real content:

| Placeholder | File | Replace with |
|-------------|------|--------------|
| `***YOUR EMAIL***` | contact/client.tsx | Real contact email |
| `***YOUR PHONE***` | contact/client.tsx | Real phone / WhatsApp |
| `***YOUR CITY, COUNTRY***` | contact/client.tsx | Real location |
| `***In-person · Virtual · Both?***` | contact/client.tsx | Gathering format |
| `***PRICE***` (×5) | offerings/client.tsx | Real pricing per experience |

---

## Image Uploads (Cloudinary — signed, server-side)

Uploads are **signed**: the browser sends the file to our own admin-gated API route (`/api/upload`), which uses your Cloudinary API secret to upload server-side. The secret never reaches the browser, and only a signed-in admin can hit the route — this is more locked-down than an unsigned upload preset, which anyone who inspects network traffic could otherwise use to upload to your account.

**One-time setup:**
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. On the dashboard home page, copy your **Cloud Name**, **API Key**, and **API Secret**
3. Add them to `.env.local` — none of these need a `NEXT_PUBLIC_` prefix, since only the server ever touches them:
   ```
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```
4. Restart `npm run dev` (env vars are only read on server start)

No upload preset needed with this approach — that was only required for the unsigned flow.

**Where this is used, and what actually persists:**
- **Homepage hero**, **About page portrait**, and **each Experience card on /offerings** upload via `/api/upload`, then save the resulting URL to a `SiteSettings` document in MongoDB (`lib/models/SiteSettings.ts`) — a single document holding a `{ key: url }` map. Changing any of these as an admin persists it for every visitor, not just your own session.
- **Gallery admin** (`/admin/gallery/new`) → same upload route, but saved as its own `Photo` document instead (since a gallery is a list, not a single named slot).
- These pages are ISR (`revalidate = 300`), so a newly uploaded image can take up to 5 minutes to show for visitors who already had the page cached — refreshing as the admin who's logged in always shows the latest instantly.

Without the env vars set, uploads fail with a clear inline error instead of silently doing nothing.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, pillars, offerings, testimonials, CTA |
| `/offerings` | Full offering details with per-offering image zones |
| `/about` | Biography, portrait upload, timeline, values, pillars |
| `/book` | Service selector → Cal.com live calendar embed |
| `/journal` | Blog listing with ISR (revalidates hourly) |
| `/journal/[slug]` | Individual post with dynamic OG metadata |
| `/contact` | Contact form → Resend email + auto-reply |
| `/admin` | Dashboard with stats |
| `/admin/bookings` | View/cancel/restore bookings |
| `/admin/availability` | Weekly schedule + upcoming bookings |
| `/admin/services` | Create/edit/show/hide services |
| `/admin/posts` | Create/edit/publish journal posts |
| `/admin/testimonials` | Add/show/hide testimonials |

---

## Architecture

```
app/
├── (site)/          ← Public pages (share Nav + Footer via SiteShell)
│   ├── about/
│   ├── book/
│   ├── contact/
│   ├── journal/
│   └── offerings/
├── admin/
│   ├── (dashboard)/ ← Protected pages (own layout with sidebar)
│   └── login/       ← Unprotected
├── api/             ← All API routes (Zod-validated, rate-limited)
└── page.tsx         ← Homepage (ISR, fetches testimonials from DB)

lib/
├── models/          ← Mongoose schemas (User, Service, Booking, Post, Testimonial, Availability)
├── auth.ts          ← NextAuth config
├── email.ts         ← Resend email service with branded templates
├── mongoose.ts      ← Cached MongoDB connection
├── ratelimit.ts     ← Upstash rate limiting (graceful no-op fallback)
├── seed.ts          ← One-time DB seed script
├── utils.ts         ← Shared utilities
└── validations/     ← Zod schemas for all API inputs
```

---

## Production Deployment (Vercel)

```bash
npm install -g vercel
vercel

# Set environment variables in Vercel dashboard:
# Settings → Environment Variables → add all from .env.example
```

**Production checklist:**
- [ ] `MONGODB_URI` → MongoDB Atlas connection string
- [ ] `NEXTAUTH_SECRET` → strong random string (`openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` → `https://yourdomain.com`
- [ ] `RESEND_API_KEY` → from resend.com
- [ ] `EMAIL_FROM` → verified sender domain in Resend
- [ ] `EMAIL_TO` → your inbox
- [ ] `NEXT_PUBLIC_CAL_USERNAME` → your Cal.com username
- [ ] `CAL_WEBHOOK_SECRET` → from Cal.com webhook settings
- [ ] `UPSTASH_REDIS_REST_URL` + `TOKEN` → from upstash.com
- [ ] Run `npm run seed` once against production DB
- [ ] Change admin password after first login
- [ ] Replace all `***` placeholders
- [ ] Create Cal.com event types with correct slugs
- [ ] Set up Cal.com webhook → `/api/bookings`
- [ ] Add real photos (portrait, hero, offering images)
- [ ] Verify domain email in Resend before going live
