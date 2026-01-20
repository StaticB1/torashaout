# 🎬 ToraShaout - Celebrity Video Marketplace

**Your Favorite Stars, Delivered Anywhere in the World**

A premium two-sided marketplace connecting Zimbabwean celebrities with fans globally. Built with Next.js 14, TypeScript, and Tailwind CSS.

---

## 🚀 Quick Start

### Option 1: GitHub Codespaces (Recommended - No Local Setup!)

**Perfect if you don't have a development computer!**

1. Upload this project to GitHub
2. Click "Code" → "Codespaces" → "Create codespace"
3. Wait 2 minutes for automatic setup
4. Run `npm run dev` in the terminal
5. **Done!** Your app opens in the browser

**📖 Full Guide**: See `CODESPACES.md` for detailed instructions

---

### Option 2: Local Development

#### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

#### Installation

```bash
# 1. Navigate to project directory
cd torashaout-nextjs

# 2. Install dependencies
npm install

# 3. Set up environment variables (copy from .env.example)
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:3000
```

---

## 🔐 Authentication & Admin Setup

### Backend Setup

ToraShaout uses **Supabase** for authentication and database. Follow the complete setup guide:

📖 **[Backend Setup Guide](./BACKEND_CHECKLIST.md)**

### Creating Admin Accounts

After setting up Supabase, create an admin account using the provided script:

```bash
node create-admin-simple.js <email> <password> <full-name>
```

**Example:**
```bash
node create-admin-simple.js admin@example.com securepassword "Admin User"
```

**Security:** Store admin credentials securely and never commit them to version control.

📖 **[Complete Authentication Guide](./docs/AUTHENTICATION_GUIDE.md)**

---

## 📁 Project Structure

```
torashaout/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles with Tailwind
│   ├── browse/                  # Browse talent catalog
│   │   └── page.tsx
│   ├── talent/[id]/             # Individual talent profiles
│   │   └── page.tsx
│   ├── checkout/                # Payment & booking
│   │   └── page.tsx
│   ├── booking/[id]/            # Booking confirmation & tracking
│   │   └── page.tsx
│   ├── how-it-works/            # Platform explanation
│   │   └── page.tsx
│   ├── faq/                     # Frequently asked questions
│   │   └── page.tsx
│   ├── business/                # Business solutions
│   │   └── page.tsx
│   ├── join/                    # Talent application
│   │   └── page.tsx
│   ├── about/                   # About the platform
│   │   └── page.tsx
│   ├── contact/                 # Contact form
│   │   └── page.tsx
│   ├── dashboard/               # Talent dashboard (4 tabs)
│   │   └── page.tsx
│   ├── customer-dashboard/      # Customer/Fan dashboard
│   │   └── page.tsx
│   ├── admin/                   # Admin panel
│   │   └── page.tsx
│   ├── privacy/                 # Privacy policy
│   │   └── page.tsx
│   └── terms/                   # Terms of service
│       └── page.tsx
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   └── Button.tsx           # Primary button component
│   ├── Navbar.tsx               # Navigation with currency switcher & notifications
│   ├── Footer.tsx               # Site footer with social links
│   ├── TalentCard.tsx           # Talent profile card
│   ├── BookingForm.tsx          # Reusable booking form
│   └── NotificationCenter.tsx   # Real-time notification system
│
├── lib/                         # Utility functions & API
│   ├── utils.ts                 # Helper functions (cn, formatCurrency)
│   ├── mock-data.ts             # Mock data for development
│   ├── supabase/                # Supabase client utilities
│   │   ├── client.ts            # Client-side Supabase client
│   │   ├── server.ts            # Server-side Supabase client
│   │   └── middleware.ts        # Auth middleware
│   └── api/                     # API utility functions
│       ├── talents.ts           # Talent CRUD operations
│       ├── bookings.ts          # Booking management
│       ├── users.ts             # User operations
│       ├── favorites.ts         # Favorites management
│       ├── notifications.ts     # Notification system
│       └── admin.ts             # Admin dashboard queries
│
├── types/                       # TypeScript type definitions
│   ├── index.ts                 # All app types (User, Talent, Booking, etc.)
│   └── database.ts              # Supabase database types
│
├── docs/                        # Documentation
│   ├── SUPABASE_SETUP.md        # Complete Supabase setup guide
│   └── BACKEND_README.md        # Backend architecture & usage
│
├── public/                      # Static assets
│   └── images/                  # Images folder
│
├── .env.local                   # Environment variables (Supabase, payments, etc.)
├── BACKEND_CHECKLIST.md         # Step-by-step backend setup checklist
├── tailwind.config.ts           # Tailwind configuration (brand colors)
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
└── package.json                 # Dependencies and scripts
```

---

## 🎨 Design System

### Brand Colors

```typescript
// Primary Gradient
Purple: #9333ea → #a855f7
Pink: #db2777 → #ec4899

// Usage in Tailwind
className="bg-gradient-to-r from-purple-600 to-pink-600"
className="text-gradient-brand" // Gradient text utility
```

### Typography

- Font: Inter (Google Fonts)
- Headings: Bold, 2xl-7xl
- Body: Regular, base-xl

### Components

- **Button**: 3 variants (primary, outline, ghost) + 3 sizes (sm, md, lg)
- **TalentCard**: Hover animations, rating badges, responsive pricing, verified badge
- **Navbar**: Mobile-first with hamburger menu, currency switcher, "Join as Talent" link
- **Footer**: 4-column layout with links, social media icons (X, Instagram, Facebook, WhatsApp, Email)
- **BookingForm**: Reusable form with validation for booking requests

---

## 🔧 Key Features Implemented

### ✅ Phase 1 - Frontend (Completed)

**Pages:**
- [x] Landing page with hero, categories, featured talent, and "Join as Talent" CTA
- [x] Browse talent catalog with search, filters, and sorting
- [x] Individual talent profile pages (`/talent/[id]`)
- [x] Checkout page with booking form and payment method selection
- [x] Booking confirmation and tracking page (`/booking/[id]`)
- [x] How It Works - 4-step process explanation with FAQ
- [x] FAQ page - 35+ questions across 6 categories with search
- [x] For Business - B2B features, use cases, pricing tiers
- [x] Join as Talent - Comprehensive application form
- [x] About page - Platform information and mission
- [x] Contact page - Contact form with support information
- [x] Talent Dashboard (`/dashboard`) - Full talent management dashboard with 4 tabs
- [x] Customer Dashboard (`/customer-dashboard`) - Fan dashboard with bookings and favorites
- [x] Admin Panel (`/admin`) - Platform management with analytics and moderation
- [x] Privacy Policy - Complete privacy policy page
- [x] Terms of Service - Complete terms and conditions page

**Core Features:**
- [x] Dual currency switcher (USD ↔ ZIG) in navigation
- [x] Responsive navigation with mobile hamburger menu
- [x] Real-time notification center with dropdown UI
- [x] Mobile-first responsive design
- [x] Dark theme with purple/pink gradient branding
- [x] TypeScript types for all entities
- [x] Reusable component library
- [x] Social media integration in footer
- [x] Mock data for development
- [x] Category filtering and talent search
- [x] Rating and review system (UI ready)
- [x] Three complete dashboard types (Talent, Customer, Admin)
- [x] Analytics and reporting UI
- [x] Content moderation interface

### ✅ Phase 2 - Backend Setup (Completed)

**Supabase Integration:**
- [x] Supabase project configuration
- [x] Database schema design (7 core tables)
- [x] Row Level Security (RLS) policies
- [x] Database functions and triggers
- [x] Client-side and server-side Supabase clients
- [x] API utility functions for all entities
- [x] Real-time subscriptions setup
- [x] File storage configuration

**API Layer:**
- [x] Talent API (CRUD operations, search, filters)
- [x] Booking API (create, update, status tracking)
- [x] User API (profiles, authentication helpers)
- [x] Favorites API (add, remove, toggle)
- [x] Notifications API (real-time, mark as read)
- [x] Admin API (platform stats, analytics)

**Documentation:**
- [x] Complete Supabase setup guide with SQL migrations
- [x] Backend architecture documentation
- [x] Step-by-step setup checklist
- [x] Usage examples and troubleshooting

**📖 See:** [BACKEND_CHECKLIST.md](./BACKEND_CHECKLIST.md) to set up Supabase

### 🚧 Phase 3 - Authentication & Integration (Next)

- [ ] Authentication pages (login, signup, password reset)
- [ ] Connect dashboards to Supabase (replace mock data)
- [ ] Protected routes with middleware
- [ ] User session management
- [ ] Role-based access control

### 🚧 Phase 4 - Payments & Media (Future)

- [ ] Payment integration (Paynow + Stripe + InnBucks)
- [ ] Payment webhook handlers
- [ ] Video upload to Supabase Storage
- [ ] Cloudflare Stream integration
- [ ] Email notifications (Resend)
- [ ] SMS/WhatsApp notifications (Twilio)

### 🚧 Phase 5 - Polish & Deploy (Future)

- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Error monitoring (Sentry)
- [ ] Analytics tracking
- [ ] Deploy to Vercel
- [ ] Custom domain setup

---

## 🛠️ Technology Stack

| Category       | Technology            | Why?                                                  |
| -------------- | --------------------- | ----------------------------------------------------- |
| **Framework**  | Next.js 14            | Server-side rendering, App Router, Image optimization |
| **Language**   | TypeScript            | Type safety, better DX                                |
| **Styling**    | Tailwind CSS          | Utility-first, responsive design                      |
| **Icons**      | Lucide React          | Lightweight, tree-shakeable                           |
| **State**      | React Hooks           | Built-in, no external library needed                  |
| **Database**   | Supabase (PostgreSQL) | Real-time, RLS, built-in auth                         |
| **Backend**    | Supabase BaaS         | Serverless, auto-scaling, file storage                |
| **API Client** | @supabase/supabase-js | Type-safe database queries                            |

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

---

## 🎯 Performance Optimizations

### Built-in Next.js Features

- **Automatic Code Splitting**: Only load JS for current page
- **Image Optimization**: WebP/AVIF with lazy loading
- **Server Components**: Reduce client-side JavaScript
- **Edge Functions**: Deploy close to users

### Tailwind CSS

- **Purge Unused CSS**: Production builds only include used classes
- **JIT Compiler**: On-demand generation of utility classes

---

## 🌍 Dual Currency System

The app automatically detects user location and displays prices in USD or ZIG:

```typescript
// In TalentCard.tsx
const price = currency === 'USD' ? talent.priceUSD : talent.priceZIG;

// Format with utility
formatCurrency(50, 'USD'); // "$50.00"
formatCurrency(2500, 'ZIG'); // "ZIG 2,500"
```

---

## 🔗 API Integration (Ready for Backend)

All components are designed to accept props from API responses:

```typescript
// Example: Fetching talents
async function getTalents() {
  const response = await fetch('/api/talents');
  const talents: TalentProfile[] = await response.json();
  return talents;
}

// Use in Server Component
export default async function BrowsePage() {
  const talents = await getTalents();
  return <TalentGrid talents={talents} />;
}
```

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on Vercel
3. Deploy with one click

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Environment Variables

Create `.env.local` for API keys:

```env
NEXT_PUBLIC_API_URL=https://api.torashaout.com
NEXT_PUBLIC_STRIPE_KEY=pk_live_...
PAYNOW_INTEGRATION_ID=...
PAYNOW_INTEGRATION_KEY=...
```

---

## 📚 Type Definitions

All TypeScript types are defined in `types/index.ts`:

- `User` - User accounts (fans, talent, admin)
- `TalentProfile` - Celebrity profiles
- `Booking` - Video orders
- `Payment` - Payment transactions
- `Currency` - USD | ZIG
- `TalentCategory` - musician, comedian, gospel, etc.

---

## 🎨 Custom Tailwind Utilities

```css
/* Text gradient with brand colors */
.text-gradient-brand

/* Background gradient */
/* Background gradient */
/* Background gradient */
/* Background gradient */
.bg-gradient-brand

/* Border with purple glow */
.border-gradient;
```

---

## 🤝 Contributing

### Adding a New Page

1. Create file in `app/` directory:

   ```typescript
   // app/browse/page.tsx
   export default function BrowsePage() {
     return <div>Browse Talent</div>;
   }
   ```

2. Add route to navigation in `Navbar.tsx`

### Adding a New Component

1. Create component in `components/`:

   ```typescript
   // components/BookingForm.tsx
   export function BookingForm() {
     return <form>...</form>;
   }
   ```

2. Export from component file
3. Import where needed

---

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### TypeScript errors

```bash
# Rebuild TypeScript cache
rm -rf .next
npm run dev
```

### Module not found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📧 Support

For questions or issues, contact:

- Email: bsiwonde@gmail.com
- WhatsApp: +821048370343

---

## 📚 Documentation

Complete documentation is available for all aspects of the project:

### Getting Started
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick setup guide
- **[CODESPACES.md](./CODESPACES.md)** - GitHub Codespaces setup
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions

### Backend & API
- **[docs/BACKEND_README.md](./docs/BACKEND_README.md)** - Complete backend guide with API examples
- **[docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)** - Database setup and schema
- **[docs/AUTHENTICATION_GUIDE.md](./docs/AUTHENTICATION_GUIDE.md)** - Authentication flow documentation

### Development
- **[ENHANCEMENTS.md](./ENHANCEMENTS.md)** - Feature documentation and updates
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and release notes
- **[RECENT_CHANGES.md](./RECENT_CHANGES.md)** - Latest updates and migration guides
- **[DOCUMENTATION_WORKFLOW.md](./DOCUMENTATION_WORKFLOW.md)** - Documentation update workflow

### Contributing
Before pushing changes, always update relevant documentation. See [DOCUMENTATION_WORKFLOW.md](./DOCUMENTATION_WORKFLOW.md) for the complete workflow.

**Pre-Push Checklist:**
- [ ] Update [CHANGELOG.md](./CHANGELOG.md) with your changes
- [ ] Update [ENHANCEMENTS.md](./ENHANCEMENTS.md) if adding features
- [ ] Update backend docs if changing API/database

A pre-push git hook will remind you to update documentation.

---

## 📄 License

© 2026 ToraShaout. All rights reserved.
© 2026 StatoTech. All rights reserved.

---

## 🎯 Next Development Phases

### Phase 2: Backend Setup (Priority)

**Authentication & Database:**
- Set up NextAuth.js or Clerk for authentication
- Configure PostgreSQL database with Prisma ORM
- Create API routes for CRUD operations
- Implement role-based access control (Fan, Talent, Admin)

**Payment Integration:**
- Paynow integration (EcoCash, OneMoney)
- Stripe setup (international cards, Apple Pay, Google Pay)
- Innbucks integration for USD payments
- Payment webhook handlers for order updates

**Core API Endpoints:**
```
/api/auth/*          - Authentication
/api/talents         - List and filter talents
/api/talents/[id]    - Talent details
/api/bookings        - Create and list bookings
/api/bookings/[id]   - Booking details and status
/api/payments        - Payment processing
/api/uploads         - Video upload handling
```

### Phase 3: Video Infrastructure

- Cloudflare Stream or AWS S3 for video storage
- Video upload and processing pipeline
- Adaptive bitrate delivery (HLS/DASH)
- Video thumbnail generation
- Download and streaming URLs with expiration

### Phase 4: Notifications & Communication

- Email notifications (SendGrid or Resend)
- WhatsApp notifications (Twilio or Africa's Talking)
- In-app notification system
- SMS alerts for payment confirmations

### Phase 5: Dashboards & Analytics

**Customer Dashboard:**
- Order history with status tracking
- Favorite talents
- Saved videos
- Payment history

**Talent Dashboard:**
- Pending requests
- Earnings overview
- Performance analytics
- Profile management
- Request acceptance/decline

**Admin Panel:**
- Talent verification workflow
- Content moderation
- Platform analytics
- Revenue tracking
- User management

### Phase 6: Advanced Features

- Gift card system
- Referral program
- Advanced search with Elasticsearch
- Video review and rating system
- Automated refund processing
- Multi-language support
- SEO optimization
- Performance monitoring (Sentry, New Relic)

### Phase 7: Mobile Apps

- React Native mobile apps (iOS & Android)
- Push notifications
- Offline video viewing
- Mobile payment integration

---

---

## 📊 Project Statistics

- **Total Pages:** 16 fully functional pages
- **Dashboard Types:** 3 (Talent, Customer, Admin)
- **Components:** 7+ reusable components
- **TypeScript Coverage:** 100%
- **Lines of Code:** ~8,000+
- **Responsive Breakpoints:** 5 (sm, md, lg, xl, 2xl)
- **Mock Talents:** 6 sample celebrities
- **Categories:** 6 talent categories
- **FAQ Questions:** 35+ with search functionality
- **Notification Types:** 9 different notification types supported

---

## 🎯 Development Roadmap

**✅ Completed:**
- Phase 1: Complete frontend with 16 pages
- Three dashboard types (Talent, Customer, Admin)
- Real-time notification center UI
- Dual currency system (USD/ZIG)
- Responsive design across all devices
- Component library and design system
- TypeScript type definitions
- Mock data for development
- Analytics and reporting interfaces
- Content moderation UI

**🔜 Up Next (Phase 2):**
- Backend API development
- User authentication system (NextAuth.js/Clerk)
- Database integration (PostgreSQL/Supabase)
- Payment gateway integration (Paynow, Stripe, Innbucks)
- Video upload infrastructure (Cloudflare Stream/S3)
- Email/WhatsApp notifications
- WebSocket integration for real-time notifications

**🚀 Future Phases:**
- Connect dashboards to real backend APIs
- Implement video review and approval workflow
- Add live chat/messaging system
- Mobile apps (iOS & Android)
- Advanced analytics with charts and graphs
- AI-powered recommendations

---

**Built with ❤️ for Zimbabwe 🇿🇼**
