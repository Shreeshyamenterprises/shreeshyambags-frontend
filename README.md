# Shree Shyam Bags — Customer Frontend

Next.js customer-facing storefront for the Shree Shyam Bags e-commerce platform. Includes product browsing, cart, Razorpay checkout, order tracking, and bulk quote requests.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| HTTP | Axios |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Icons | Lucide React |

---

## Project Structure

```
nonwoven-frontend/
├── app/                         # Next.js App Router pages
│   ├── page.tsx                 # Homepage (hero, categories, highlights)
│   ├── layout.tsx               # Root layout with Navbar + Footer
│   ├── login/page.tsx           # Customer login
│   ├── signup/page.tsx          # Customer signup
│   ├── products/
│   │   ├── page.tsx             # Product listing with filters
│   │   └── [slug]/page.tsx      # Product detail page
│   ├── cart/page.tsx            # Shopping cart
│   ├── checkout/page.tsx        # Checkout with Razorpay
│   ├── orders/page.tsx          # Order history
│   ├── order-success/page.tsx   # Payment success page
│   ├── dashboard/page.tsx       # User dashboard
│   ├── contact/page.tsx         # Bulk quote / contact form
│   └── about/page.tsx           # About page
├── components/
│   ├── layout/
│   │   ├── navbar.tsx           # Navigation header
│   │   └── footer.tsx           # Footer
│   ├── auth/
│   │   ├── login-form.tsx       # Login form
│   │   ├── signup-form.tsx      # Signup form
│   │   └── auth-guard.tsx       # Protected route wrapper
│   ├── home/
│   │   └── hero.tsx             # Hero section
│   └── products/
│       ├── product-card.tsx     # Product card
│       ├── product-gallery.tsx  # Image gallery
│       └── variant-selector.tsx # Size/color/shape picker
├── store/
│   ├── auth-store.ts            # Auth state (Zustand)
│   └── cart-store.ts            # Cart count state (Zustand)
├── lib/
│   ├── api.ts                   # Axios instance
│   └── auth.ts                  # Token helpers (get/set/remove)
├── types/
│   └── index.ts                 # TypeScript type definitions
├── public/                      # Static assets
└── netlify.toml                 # Netlify deployment config
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, categories, custom printing section |
| `/products` | Product listing with search and filters |
| `/products/[slug]` | Product detail with variants and add to cart |
| `/cart` | Review cart items, quantities, custom text |
| `/checkout` | Shipping address + Razorpay payment |
| `/orders` | User's order history |
| `/order-success` | Payment confirmation page |
| `/login` | Customer login |
| `/signup` | Customer registration |
| `/contact` | B2B bulk quote enquiry form |
| `/about` | About Shree Shyam Bags |

---

## Getting Started (Local Setup)

### Prerequisites
- Node.js 20+
- npm
- Backend API running (see [shreeshyambags-backend](https://github.com/Shreeshyamenterprises/shreeshyambags-backend))

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/Shreeshyamenterprises/shreeshyambags-frontend.git
cd shreeshyambags-frontend
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Set up environment variables

Create a `.env.local` file in the project root:

```env
# URL of the running backend API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> For production, this will be your Render backend URL e.g. `https://shreeshyambags-backend.onrender.com`

### Step 4 — Start the development server

```bash
npm run dev
```

Frontend will be running at `http://localhost:3001`

> Make sure the backend is also running at `http://localhost:3000`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3001 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## State Management

### Auth Store (Zustand)
```
- token: string | null       # JWT token
- loggedIn: boolean          # Whether user is logged in
- load()                     # Load token from localStorage on app init
- login(token)               # Save token and mark as logged in
- logout()                   # Clear token
```

### Cart Store (Zustand)
```
- count: number              # Number of items in cart
- setCount(count)            # Update cart count (shown in navbar)
```

---

## Deployment (Netlify — Free Tier)

### Step 1 — Push to GitHub
Make sure your code is pushed to the `main` branch.

### Step 2 — Create a site on Netlify
1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Connect GitHub → select `shreeshyambags-frontend`

### Step 3 — Configure build settings

| Field | Value |
|-------|-------|
| Branch | `main` |
| Base directory | *(leave empty)* |
| Build command | `npm run build` |
| Publish directory | `.next` |

### Step 4 — Add environment variable

In Netlify → **Site configuration → Environment variables**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://shreeshyambags-backend.onrender.com` |

### Step 5 — Deploy
Click **Deploy site**. Your frontend will be live at `https://your-site.netlify.app`

> After changing any environment variable on Netlify, always do **Trigger deploy → Clear cache and deploy** — Next.js bakes env vars at build time.

---

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production — deploys to Netlify automatically |
| `staging` | Staging — test here before merging to main |

### Recommended workflow
```bash
# Work on staging
git checkout staging
# make your changes
git add . && git commit -m "your change"
git push origin staging

# When ready for production
git checkout main
git merge staging
git push origin main
```
