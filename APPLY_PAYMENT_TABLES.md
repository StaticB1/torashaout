# Apply Payment Tables to Supabase

## 🚨 Quick Fix Instructions

The migration script doesn't work with Supabase's RPC limitations. Apply the migration manually instead:

---

## 📝 Step-by-Step Instructions

### 1. Open Supabase SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project (fyvqvqzdtuugqcxglwew)
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"

### 2. Copy the Migration SQL

Open this file: `supabase/migrations/MANUAL_PAYMENT_MIGRATION.sql`

**Or copy this:**

```sql
-- Drop existing tables (if they exist)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,

  recipient_name TEXT NOT NULL,
  occasion TEXT,
  instructions TEXT,

  currency TEXT NOT NULL CHECK (currency IN ('USD', 'ZIG')),
  amount_paid DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  talent_earnings DECIMAL(10, 2) NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending_payment',

  video_url TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  customer_rating INTEGER,
  customer_review TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_talent ON bookings(talent_id);
CREATE INDEX idx_bookings_code ON bookings(booking_code);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  gateway TEXT NOT NULL,
  reference TEXT UNIQUE NOT NULL,

  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_reference ON payments(reference);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users view own bookings" ON bookings FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Users create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users update own bookings" ON bookings FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Users view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger for automatic booking update
CREATE OR REPLACE FUNCTION update_booking_after_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE bookings
    SET status = 'payment_confirmed', due_date = NOW() + INTERVAL '7 days', updated_at = NOW()
    WHERE id = NEW.booking_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_completed_trigger
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_after_payment();
```

### 3. Run the Query

1. Paste the SQL into the SQL Editor
2. Click "Run" button (or press Ctrl+Enter)
3. Wait for "Success" message

### 4. Verify Tables Created

1. Go to "Table Editor" in left sidebar
2. You should see:
   - ✅ `bookings` table
   - ✅ `payments` table

---

## ✅ After Running Migration

### Test the Payment Flow:

1. **Login** at http://localhost:3000/login

2. **Browse talents** at http://localhost:3000/browse

3. **Book a video**:
   - Select a talent
   - Fill booking form
   - Submit

4. **Complete payment**:
   - You'll be redirected to payment page
   - Select payment method
   - Fill form and click "Pay"

5. **Check Supabase**:
   - Go to Table Editor → `payments`
   - Should see new payment record!
   - Go to Table Editor → `bookings`
   - Status should be `payment_confirmed`!

---

## 🐛 If It Still Doesn't Work

### Check Browser Console
Press F12 → Console tab
Look for any errors

### Check Dev Server Logs
Look at the terminal where `npm run dev` is running
Check for error messages when you click "Pay"

### Verify You're Logged In
- Must be authenticated
- User ID must match the booking customer_id

---

## 📞 Need Help?

If payments still don't save:
1. Copy the error from browser console
2. Copy the error from dev server logs
3. Share them so I can debug further

---

**Once migration is applied, the full payment flow will work!** 🚀
