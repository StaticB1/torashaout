# 🚀 ToraShaout Deployment Guide

This guide covers deploying ToraShaout to production environments.

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Payment gateways tested in sandbox
- [ ] Video upload/delivery tested
- [ ] SSL certificates obtained
- [ ] Domain DNS configured
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics configured (optional)

---

## 🌐 Vercel Deployment (Recommended for Frontend)

### Why Vercel?
- Zero-configuration Next.js deployment
- Global CDN with edge caching
- Automatic HTTPS
- Preview deployments for PRs
- Generous free tier

### Steps

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy via GitHub** (Recommended)
   - Push code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Configure environment variables
   - Click "Deploy"

3. **Deploy via CLI**
   ```bash
   cd torashaout-nextjs
   vercel
   # Follow prompts
   vercel --prod  # Deploy to production
   ```

4. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`
   - Separate values for Production, Preview, Development

5. **Custom Domain**
   - Project Settings → Domains
   - Add your domain (e.g., torashaout.com)
   - Update DNS with provided records

### Vercel Configuration

Create `vercel.json` in project root:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["sin1", "cdg1", "iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## 🖥️ Railway Deployment (Backend API)

### Why Railway?
- Easy Node.js hosting
- Built-in PostgreSQL
- Auto-scaling
- GitHub integration

### Steps

1. **Sign up at** [railway.app](https://railway.app)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your backend repo

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Copy DATABASE_URL to environment variables

4. **Configure Environment Variables**
   - Go to Variables tab
   - Add all backend env vars

5. **Deploy**
   - Railway auto-deploys on every push to main
   - Get your public URL (e.g., `api.torashaout.com`)

### Railway Configuration

Create `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🗄️ Supabase Setup (Database + Auth)

### Steps

1. **Create Project** at [supabase.com](https://supabase.com)

2. **Run Database Migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login
   supabase login
   
   # Link project
   supabase link --project-ref your-project-ref
   
   # Push schema
   supabase db push
   ```

3. **Get API Keys**
   - Project Settings → API
   - Copy `anon` and `service_role` keys
   - Add to environment variables

4. **Enable Row Level Security (RLS)**
   ```sql
   -- In Supabase SQL Editor
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
   
   -- Create policies
   CREATE POLICY "Users can view own data"
     ON users FOR SELECT
     USING (auth.uid() = id);
   ```

---

## 📹 Cloudflare Stream Setup

### Steps

1. **Get API Credentials**
   - Go to Cloudflare Dashboard → Stream
   - Copy Account ID and API Token

2. **Configure in App**
   ```typescript
   // lib/cloudflare-stream.ts
   const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
   const API_TOKEN = process.env.CLOUDFLARE_STREAM_TOKEN;
   
   export async function uploadVideo(file: File) {
     const formData = new FormData();
     formData.append('file', file);
     
     const response = await fetch(
       `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream`,
       {
         method: 'POST',
         headers: { 'Authorization': `Bearer ${API_TOKEN}` },
         body: formData
       }
     );
     
     return response.json();
   }
   ```

---

## 💳 Payment Gateway Setup

### Paynow (Zimbabwe)

1. **Register** at [paynow.co.zw](https://www.paynow.co.zw)
2. **Get Integration Keys**
   - Dashboard → Integrations
   - Copy Integration ID and Key
3. **Configure Webhook**
   - Add Result URL: `https://api.torashaout.com/webhooks/paynow`

### Stripe (International)

1. **Sign up** at [stripe.com](https://stripe.com)
2. **Get API Keys**
   - Developers → API Keys
   - Copy Publishable and Secret keys
3. **Configure Webhook**
   ```bash
   stripe listen --forward-to localhost:4000/webhooks/stripe
   ```
4. **In Production**
   - Webhooks → Add endpoint
   - URL: `https://api.torashaout.com/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.failed`

---

## 📱 WhatsApp Notifications (Twilio)

### Steps

1. **Sign up** at [twilio.com](https://www.twilio.com)
2. **Enable WhatsApp**
   - Messaging → Try it out → WhatsApp
   - Request access to WhatsApp Business API
3. **Create Template Messages**
   ```
   Your video from {{talent_name}} is ready! 🎉
   Download: {{video_link}}
   ```
4. **Get Credentials**
   - Account SID
   - Auth Token
   - WhatsApp number

---

## 🔐 Security Checklist

### SSL/TLS
- [ ] HTTPS enabled (Vercel handles this)
- [ ] HTTP → HTTPS redirect enabled
- [ ] Strong TLS configuration (TLS 1.2+)

### Environment Variables
- [ ] Never commit `.env` files to Git
- [ ] Use secrets managers for production
- [ ] Rotate API keys regularly

### Headers
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },
}
```

### Rate Limiting
```typescript
// Implement rate limiting on API routes
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for');
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  // Handle request
}
```

---

## 📊 Monitoring Setup

### Sentry (Error Tracking)

1. **Install SDK**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure**
   ```typescript
   // sentry.client.config.ts
   import * as Sentry from '@sentry/nextjs';
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
   });
   ```

3. **Add to Environment**
   ```env
   SENTRY_DSN=https://...@sentry.io/...
   ```

### Axiom (Logs)

```typescript
// lib/logger.ts
import { Axiom } from '@axiomhq/js';

const axiom = new Axiom({
  token: process.env.AXIOM_TOKEN!,
  dataset: 'torashaout-logs',
});

export function log(event: string, data: any) {
  axiom.ingest([{ event, ...data, timestamp: new Date() }]);
}
```

---

## 🌍 CDN Configuration

### Cloudflare (Frontend)

1. **Add Site to Cloudflare**
   - Add domain
   - Update nameservers

2. **Configure Caching**
   - Speed → Optimization
   - Enable Auto Minify (JS, CSS, HTML)
   - Enable Brotli compression

3. **Page Rules**
   - Cache everything on `/images/*`
   - Cache API responses for 5 minutes

---

## 📈 Performance Optimization

### Next.js Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
}
```

### Bundle Analysis

```bash
npm install @next/bundle-analyzer

# Update next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your config
})

# Run analysis
ANALYZE=true npm run build
```

---

## 🧪 Testing Before Production

### Checklist
- [ ] Test all payment flows (Paynow, Stripe, InnBucks)
- [ ] Verify video upload/download
- [ ] Test WhatsApp notifications
- [ ] Check responsive design on mobile
- [ ] Test slow network conditions (3G)
- [ ] Verify currency switching
- [ ] Test booking flow end-to-end
- [ ] Check admin dashboard functionality

### Load Testing
```bash
# Install k6
brew install k6  # macOS
# or download from k6.io

# Create test script
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  let res = http.get('https://torashaout.com');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
EOF

# Run test
k6 run load-test.js
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Check DATABASE_URL format
- Verify Supabase project is active
- Check firewall rules

### Payment Webhooks Not Firing
- Verify webhook URLs are publicly accessible
- Check webhook signatures
- Look at gateway dashboard logs

---

## 📞 Support

For deployment issues:
- Email: dev@torashaout.com
- Slack: #dev-support

---

**🎉 Happy Deploying!**
