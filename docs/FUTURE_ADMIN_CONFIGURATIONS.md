# Admin System Configurations Module (Future Feature)

## 🎯 Purpose

Allow admins to control platform-wide settings without code changes.

---

## 🔧 Proposed Configurable Settings

### 1. Financial Settings
- **Platform Fee Percentage** (currently hardcoded: 25%)
- **Minimum Booking Amount** (USD & ZIG)
- **Maximum Booking Amount**
- **Payout Threshold** (minimum for talent withdrawals)
- **Tax Rate** (if applicable)

### 2. Business Rules
- **Video Delivery Deadline** (currently: 7 days)
- **Refund Window** (days after booking)
- **Talent Response Time** (default hours)
- **Booking Cancellation Window**
- **Auto-reject Threshold** (missed deadlines before suspension)

### 3. Platform Limits
- **Max Bookings per User per Day**
- **Max Video Duration** (seconds)
- **Max Talent Profiles per User**
- **Image Upload Size Limit** (MB)

### 4. Notification Settings
- **Email Notification Toggles**
- **SMS Notification Toggles**
- **Admin Alert Thresholds**
- **Notification Delays** (hours before reminder)

### 5. Feature Flags
- **Enable Guest Checkout**
- **Enable Video Reviews**
- **Enable Talent Tips**
- **Enable Booking Scheduling**
- **Maintenance Mode**

---

## 📊 Database Schema

### Proposed `platform_settings` Table

```sql
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  value_type TEXT NOT NULL,  -- 'number', 'string', 'boolean', 'json'
  category TEXT NOT NULL,     -- 'financial', 'business_rules', 'limits', etc.
  description TEXT,
  min_value DECIMAL,          -- For numeric values
  max_value DECIMAL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example records
INSERT INTO platform_settings (key, value, value_type, category, description) VALUES
('platform_fee_percent', '0.25', 'number', 'financial', 'Platform commission percentage'),
('delivery_days', '7', 'number', 'business_rules', 'Days until video due date'),
('min_booking_usd', '10.00', 'number', 'financial', 'Minimum booking amount in USD'),
('max_bookings_per_day', '10', 'number', 'limits', 'Max bookings per user per day'),
('enable_guest_checkout', 'false', 'boolean', 'features', 'Allow checkout without login');
```

---

## 🎨 Admin UI Design

### Configuration Page Layout

```
/admin/settings

├── Financial Settings
│   ├── Platform Fee: [25%] slider/input
│   ├── Min Booking (USD): [$10.00]
│   ├── Min Booking (ZIG): [ZIG 500]
│   └── Payout Threshold: [$100.00]
│
├── Business Rules
│   ├── Delivery Deadline: [7 days]
│   ├── Refund Window: [24 hours]
│   └── Auto-reject After: [3 missed deadlines]
│
├── Platform Limits
│   ├── Daily Bookings Limit: [10]
│   ├── Max Video Duration: [180 seconds]
│   └── Image Size Limit: [5 MB]
│
├── Notifications
│   ├── Email Notifications: [✓ Enabled]
│   ├── SMS Notifications: [✓ Enabled]
│   └── Reminder After: [24 hours]
│
└── Feature Flags
    ├── Guest Checkout: [☐ Disabled]
    ├── Video Reviews: [✓ Enabled]
    └── Maintenance Mode: [☐ Disabled]
```

---

## 💻 Implementation Plan

### Phase 1: Database & API
1. Create `platform_settings` table
2. Seed with default values
3. Create API endpoints:
   - GET `/api/admin/settings` - Fetch all settings
   - PATCH `/api/admin/settings/:key` - Update single setting
   - POST `/api/admin/settings/bulk` - Update multiple

### Phase 2: Settings Service
Create `lib/settings.ts`:
```typescript
export class PlatformSettings {
  private static cache: Map<string, any> = new Map();

  static async get(key: string, defaultValue?: any): Promise<any> {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Fetch from database
    const value = await this.fetchFromDB(key);
    this.cache.set(key, value);
    return value || defaultValue;
  }

  static async getPlatformFee(): Promise<number> {
    return await this.get('platform_fee_percent', 0.25);
  }

  static async getDeliveryDays(): Promise<number> {
    return await this.get('delivery_days', 7);
  }

  // Invalidate cache when settings change
  static clearCache() {
    this.cache.clear();
  }
}
```

### Phase 3: Update Booking API
Replace hardcoded value:
```typescript
// Before
const PLATFORM_FEE_PERCENT = 0.25;

// After
const PLATFORM_FEE_PERCENT = await PlatformSettings.getPlatformFee();
```

### Phase 4: Admin UI
Create `/app/admin/settings/page.tsx`:
- Form with all configurable settings
- Validation (min/max values)
- Real-time preview
- Save button
- Change history log

### Phase 5: Audit Trail
```sql
CREATE TABLE settings_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔒 Security Considerations

### Access Control
- Only users with `admin` role can view/edit
- Audit log for all changes
- Validation on all inputs
- Rate limiting on API

### Critical Settings Protection
- Require password re-entry for critical changes
- Two-admin approval for platform fee changes
- Rollback capability
- Email notification to all admins

---

## 🎨 UI Components Needed

1. **SettingsCard** - Grouped settings display
2. **NumberInput** - With min/max validation
3. **PercentageSlider** - Visual percentage selector
4. **Toggle** - For boolean flags
5. **SettingsHistory** - Show recent changes
6. **ConfirmationModal** - For critical changes

---

## 📊 Benefits

### For Platform
✅ Change fees without code deployment
✅ A/B test different fee structures
✅ Respond to market conditions quickly
✅ Seasonal promotions
✅ Regional pricing differences

### For Development
✅ No code changes needed
✅ No deployments for config changes
✅ Easy rollback
✅ Version control for settings
✅ Testing different configurations

### For Admins
✅ Self-service configuration
✅ Instant updates
✅ Change history
✅ Preview before save
✅ Audit trail

---

## 📋 Example Use Cases

### Use Case 1: Promotional Period
```
Admin wants to reduce fee to 15% for holiday promotion:
1. Login to admin panel
2. Go to Settings → Financial
3. Update Platform Fee: 25% → 15%
4. Set expiry date: Jan 31, 2026
5. Save
→ All new bookings use 15% until expiry
```

### Use Case 2: Market Adjustment
```
Competitor changes pricing:
1. Update minimum booking to match
2. Adjust platform fee if needed
3. Changes effective immediately
→ No code deploy needed
```

### Use Case 3: Crisis Mode
```
System issues detected:
1. Enable Maintenance Mode
2. All bookings temporarily disabled
3. Message shown to users
4. Fix issues
5. Disable Maintenance Mode
→ Platform back online
```

---

## 🚀 Implementation Timeline

**Phase 1:** Database & API (1 week)
**Phase 2:** Settings Service (3 days)
**Phase 3:** Update Existing Code (3 days)
**Phase 4:** Admin UI (1 week)
**Phase 5:** Audit Trail (3 days)

**Total:** ~3-4 weeks

---

## 💡 Current Workaround

Until this is built, settings can be changed by:
1. Updating constant in code
2. Committing to git
3. Deploying to production

**Current location for platform fee:**
- `app/api/bookings/route.ts` line 23
- `lib/api/admin.client.ts` line 99

---

## 🎯 Priority

**Recommended Priority:** MEDIUM

**Build After:**
1. ✅ Payment integration (current)
2. Video infrastructure
3. Notifications system
4. ← Then build admin configurations

**Reasoning:** Other core features are more critical for launch. Configuration module adds convenience but isn't blocking.

---

## 📝 Notes for Future Implementation

- Use caching to avoid database hits on every request
- Invalidate cache when settings change
- Consider environment-specific settings (dev vs prod)
- Add feature flags for gradual rollout
- Include documentation for each setting
- Add setting validation rules
- Consider setting presets (templates)

---

**Status:** 📋 Documented for Future Development
**Created:** January 26, 2026
**Next Review:** After Phase 6 (Payment) and Phase 7 (Video) complete
