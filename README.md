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

# 3. Run development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

---

## 📁 Project Structure

```
torashaout-nextjs/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles with Tailwind
│
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   │   └── Button.tsx       # Primary button component
│   ├── Navbar.tsx           # Navigation with currency switcher
│   ├── Footer.tsx           # Site footer
│   └── TalentCard.tsx       # Talent profile card
│
├── lib/                     # Utility functions
│   ├── utils.ts             # Helper functions (cn, formatCurrency)
│   └── mock-data.ts         # Mock data for development
│
├── types/                   # TypeScript type definitions
│   └── index.ts             # All app types (User, Talent, Booking, etc.)
│
├── public/                  # Static assets
│   └── images/              # Images folder
│
├── tailwind.config.ts       # Tailwind configuration (brand colors)
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies and scripts
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
- **Button**: 3 variants (primary, secondary, outline) + 3 sizes
- **TalentCard**: Hover animations, rating badges, responsive pricing
- **Navbar**: Mobile-first with hamburger menu
- **Footer**: 4-column layout with links

---

## 🔧 Key Features Implemented

### ✅ Phase 1 (Current)
- [x] Landing page with hero section
- [x] Talent discovery grid (with mock data)
- [x] Category browsing
- [x] Currency switcher (USD ↔ ZIG)
- [x] Responsive navigation
- [x] Mobile-optimized design
- [x] TypeScript types for all entities
- [x] Reusable component library

### 🚧 Phase 2 (Next Steps)
- [ ] Talent profile page (`/talent/[id]`)
- [ ] Booking flow (multi-step form)
- [ ] Payment integration (Paynow + Stripe)
- [ ] Customer dashboard
- [ ] Talent dashboard
- [ ] Admin panel

---

## 🛠️ Technology Stack

| Category | Technology | Why? |
|----------|------------|------|
| **Framework** | Next.js 14 | Server-side rendering, App Router, Image optimization |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS | Utility-first, responsive design |
| **Icons** | Lucide React | Lightweight, tree-shakeable |
| **State** | React Hooks | Built-in, no external library needed |

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
formatCurrency(50, 'USD') // "$50.00"
formatCurrency(2500, 'ZIG') // "ZIG 2,500"
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
.bg-gradient-brand

/* Border with purple glow */
.border-gradient
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
- Email: support@torashaout.com
- WhatsApp: +263...

---

## 📄 License

© 2026 ToraShaout. All rights reserved.

---

## 🎯 Next Development Phases

### Phase 2: Talent Profiles
- Individual talent pages
- Video preview player
- Booking form with occasion selector

### Phase 3: Payment Integration
- Paynow setup (EcoCash, OneMoney)
- Stripe integration (cards, Apple Pay)
- InnBucks for remittances

### Phase 4: Dashboards
- Customer order tracking
- Talent request management
- Admin verification panel

### Phase 5: Video Infrastructure
- Cloudflare Stream integration
- Adaptive bitrate delivery
- WhatsApp notification system

---

**Built with ❤️ for Zimbabwe 🇿🇼**
